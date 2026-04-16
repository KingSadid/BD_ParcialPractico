const db = require('../services/database/heritage.db').getPool();

class SpaceDAO {
    async create(space) {
        const { name, address, max_capacity, conservation_status, administrative_unit, description } = space;
        
        const query = `
            INSERT INTO cultural_spaces 
            (name, address, max_capacity, conservation_status, administrative_unit, description) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.execute(query, [
            name, address, max_capacity, conservation_status, administrative_unit, description
        ]);
        
        return { id: result.insertId, ...space };
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM cultural_spaces WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async findOperational() {
        const [rows] = await db.execute(
            'SELECT id, name, address, max_capacity, administrative_unit FROM cultural_spaces WHERE conservation_status = ?',
            ['operational']
        );
        return rows;
    }

    async validateAvailability(spaceId) {
        const [rows] = await db.execute(
            'SELECT max_capacity, conservation_status FROM cultural_spaces WHERE id = ?',
            [spaceId]
        );
        
        if (rows.length === 0) return { exists: false };
        
        return {
            exists: true,
            operational: rows[0].conservation_status === 'operational',
            max_capacity: rows[0].max_capacity,
            status: rows[0].conservation_status
        };
    }
}

module.exports = new SpaceDAO();