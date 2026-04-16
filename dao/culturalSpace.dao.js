const db = require('../services/database/heritage.db').getPool();

class CulturalSpaceDAO {
    async create(data) {
        const { name, address, max_capacity, conservation_status, administrative_unit, description } = data;
        const [result] = await db.execute(
            `INSERT INTO cultural_spaces 
             (name, address, max_capacity, conservation_status, administrative_unit, description) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, address, max_capacity, conservation_status, administrative_unit, description]
        );
        return { id: result.insertId, ...data };
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM cultural_spaces WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async findOperational() {
        const [rows] = await db.execute(
            'SELECT * FROM cultural_spaces WHERE conservation_status = ?', 
            ['operational']
        );
        return rows;
    }

    async findByIdWithCapacity(id) {
        const [rows] = await db.execute(
            'SELECT id, name, max_capacity, conservation_status FROM cultural_spaces WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }
}

module.exports = new CulturalSpaceDAO();