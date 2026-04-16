const reservationRequestDAO = require('../../dao/reservationRequest.dao');
const statusHistoryDAO = require('../../dao/statusHistory.dao');
const reservationValidator = require('../validators/reservation.validator');

class ReservationController {
    async create(req, res) {
        try {
            const data = req.body;
            const validation = await reservationValidator.validateCreation(data);

            if (!validation.valid) {
                return res.status(422).json({ success: false, errors: validation.errors });
            }

            // Create reservation
            const reservation = await reservationRequestDAO.create(data);
            
            // Create initial history entry
            await statusHistoryDAO.createEntry(
                reservation.id, 
                null, 
                'pending', 
                'Reservation request created'
            );

            res.status(201).json({ 
                success: true, 
                message: 'Reservation created successfully',
                data: reservation 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getStatus(req, res) {
        try {
            const reservation = await reservationRequestDAO.findById(req.params.id);
            if (!reservation) {
                return res.status(404).json({ success: false, message: 'Reservation not found' });
            }

            const history = await statusHistoryDAO.findByReservationId(req.params.id);
            
            res.json({
                success: true,
                data: {
                    ...reservation,
                    status_history: history
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new ReservationController();