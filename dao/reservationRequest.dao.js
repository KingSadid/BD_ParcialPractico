const db = require('../services/reservations.service'); // El nuevo servicio

class ReservationRequestDAO {
    async create(data) {
        const { space_id, requesting_organization, event_name, requested_capacity, start_datetime, end_datetime } = data;
        const [result] = await db.execute(
            `INSERT INTO reservation_requests 
             (space_id, requesting_organization, event_name, requested_capacity, start_datetime, end_datetime) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [space_id, requesting_organization, event_name, requested_capacity, start_datetime, end_datetime]
        );
        return { id: result.insertId, ...data, status: 'pending' };
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM reservation_requests WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async findApprovedBySpaceAndDate(space_id, start, end) {
        const [rows] = await db.execute(
            `SELECT * FROM reservation_requests 
             WHERE space_id = ? AND status = 'approved'
             AND NOT (end_datetime <= ? OR start_datetime >= ?)`,
            [space_id, start, end]
        );
        return rows;
    }

    async updateStatus(id, status) {
        await db.execute('UPDATE reservation_requests SET status = ? WHERE id = ?', [status, id]);
        return true;
    }
}

module.exports = new ReservationRequestDAO();