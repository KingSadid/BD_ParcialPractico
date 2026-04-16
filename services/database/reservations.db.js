const mysql = require('mysql2/promise');
const config = require('../../env/reservations.config');

class ReservationsDatabase {
    constructor() {
        if (!ReservationsDatabase.instance) {
            this.pool = mysql.createPool(config);
            ReservationsDatabase.instance = this;
        }
        return ReservationsDatabase.instance;
    }

    getPool() {
        return this.pool;
    }

    async healthCheck() {
        try {
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            return { connected: true };
        } catch (error) {
            return { connected: false, error: error.message };
        }
    }
}

module.exports = new ReservationsDatabase();