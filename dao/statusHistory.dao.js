const db = require('../services/reservations.service');

class StatusHistoryDAO {
    async createEntry(reservation_id, previous_status, new_status, reason = '') {
        const [result] = await db.execute(
            `INSERT INTO status_history 
             (reservation_id, previous_status, new_status, change_reason) 
             VALUES (?, ?, ?, ?)`,
            [reservation_id, previous_status, new_status, reason]
        );
        return { id: result.insertId };
    }

    async findByReservationId(reservation_id) {
        const [rows] = await db.execute(
            'SELECT * FROM status_history WHERE reservation_id = ? ORDER BY created_at DESC',
            [reservation_id]
        );
        return rows;
    }
}

module.exports = new StatusHistoryDAO();