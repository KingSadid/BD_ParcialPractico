const db = require('../services/database/reservations.db').getPool();

class ReservationDAO {
    async create(reservation) {
        const { space_id, requesting_organization, event_name, requested_capacity, start_datetime, end_datetime } = reservation;
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `INSERT INTO reservation_requests 
                 (space_id, requesting_organization, event_name, requested_capacity, start_datetime, end_datetime) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [space_id, requesting_organization, event_name, requested_capacity, start_datetime, end_datetime]
            );

            await connection.execute(
                `INSERT INTO status_history (reservation_id, previous_status, new_status, change_reason) 
                 VALUES (?, ?, ?, ?)`,
                [result.insertId, null, 'pending', 'Reservation created']
            );

            await connection.commit();
            return { id: result.insertId, ...reservation, status: 'pending' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async hasOverlap(spaceId, start, end) {
        const [rows] = await db.execute(
            `SELECT COUNT(*) as count FROM reservation_requests 
             WHERE space_id = ? AND status = 'approved' 
             AND NOT (end_datetime <= ? OR start_datetime >= ?)`,
            [spaceId, start, end]
        );
        return rows[0].count > 0;
    }

    async findByIdWithHistory(id) {
        const [reservations] = await db.execute(
            'SELECT * FROM reservation_requests WHERE id = ?',
            [id]
        );
        
        if (reservations.length === 0) return null;
        
        const [history] = await db.execute(
            'SELECT * FROM status_history WHERE reservation_id = ? ORDER BY created_at DESC',
            [id]
        );
        
        return { ...reservations[0], status_history: history };
    }
}

module.exports = new ReservationDAO();