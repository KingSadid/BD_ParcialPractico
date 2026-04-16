const spaceDAO = require('../../dao/space.dao');
const reservationDAO = require('../../dao/reservation.dao');

class ReservationValidator {
    async validateCreation(data) {
        const errors = [];
        const { space_id, requested_capacity, start_datetime, end_datetime } = data;

        const spaceCheck = await spaceDAO.validateAvailability(space_id);
        
        if (!spaceCheck.exists) {
            errors.push('Space does not exist in heritage database');
            return { valid: false, errors };
        }

        if (!spaceCheck.operational) {
            errors.push(`Space not operational (status: ${spaceCheck.status})`);
        }

        if (requested_capacity > spaceCheck.max_capacity) {
            errors.push(`Capacity ${requested_capacity} exceeds maximum ${spaceCheck.max_capacity}`);
        }

        const hasOverlap = await reservationDAO.hasOverlap(space_id, start_datetime, end_datetime);
        if (hasOverlap) {
            errors.push('Date range overlaps with existing approved reservation');
        }

        if (new Date(start_datetime) >= new Date(end_datetime)) {
            errors.push('End datetime must be after start datetime');
        }

        return { valid: errors.length === 0, errors };
    }
}

module.exports = new ReservationValidator();