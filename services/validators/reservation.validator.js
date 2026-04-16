const culturalSpaceDAO = require('../../dao/culturalSpace.dao');
const reservationRequestDAO = require('../../dao/reservationRequest.dao');

class ReservationValidator {
    async validateCreation(data) {
        const errors = [];
        const { space_id, requested_capacity, start_datetime, end_datetime } = data;

        const space = await culturalSpaceDAO.findByIdWithCapacity(space_id);
        
        if (!space) {
            errors.push('Space does not exist in heritage database');
            return { valid: false, errors };
        }

        if (space.conservation_status !== 'operational') {
            errors.push(`Space not operational (current: ${space.conservation_status})`);
        }

        if (requested_capacity > space.max_capacity) {
            errors.push(`Requested capacity (${requested_capacity}) exceeds maximum (${space.max_capacity})`);
        }

        const approved = await reservationRequestDAO.findApprovedBySpaceAndDate(space_id, start_datetime, end_datetime);
        if (approved.length > 0) {
            errors.push('Date range overlaps with existing approved reservation');
        }

        if (new Date(start_datetime) >= new Date(end_datetime)) {
            errors.push('End datetime must be after start datetime');
        }

        return { valid: errors.length === 0, errors, space };
    }
}

module.exports = new ReservationValidator();