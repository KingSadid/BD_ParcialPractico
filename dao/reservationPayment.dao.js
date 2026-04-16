const db = require('../services/reservations.service');

class ReservationPaymentDAO {
    async createPayment(reservation_id, amount, concept) {
        const [result] = await db.execute(
            `INSERT INTO reservation_payments 
             (reservation_id, amount, concept, payment_status) 
             VALUES (?, ?, ?, 'pending')`,
            [reservation_id, amount, concept]
        );
        return { id: result.insertId };
    }

    async findByReservationId(reservation_id) {
        const [rows] = await db.execute(
            'SELECT * FROM reservation_payments WHERE reservation_id = ?',
            [reservation_id]
        );
        return rows;
    }
}

module.exports = new ReservationPaymentDAO();