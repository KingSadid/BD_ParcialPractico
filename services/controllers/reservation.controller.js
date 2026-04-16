const reservationDAO = require('../../dao/reservation.dao');
const reservationValidator = require('../validators/reservation.validator');

class ReservationController {
    async create(req, res) {
        try {
            const { space_id, requesting_organization, event_name, requested_capacity, start_datetime, end_datetime } = req.body;

            if (!space_id || !requesting_organization || !event_name || !requested_capacity || !start_datetime || !end_datetime) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields required'
                });
            }

            const validation = await reservationValidator.validateCreation({
                space_id: parseInt(space_id),
                requested_capacity: parseInt(requested_capacity),
                start_datetime, end_datetime
            });

            if (!validation.valid) {
                return res.status(422).json({ success: false, errors: validation.errors });
            }

            const reservation = await reservationDAO.create({
                space_id: parseInt(space_id), requesting_organization, event_name,
                requested_capacity: parseInt(requested_capacity), start_datetime, end_datetime
            });

            res.status(201).json({ success: true, data: reservation });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getStatus(req, res) {
        try {
            const reservation = await reservationDAO.findByIdWithHistory(req.params.id);
            if (!reservation) {
                return res.status(404).json({ success: false, message: 'Not found' });
            }
            res.json({ success: true, data: reservation });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new ReservationController();