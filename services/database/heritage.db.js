const mysql = require('mysql2/promise');
const config = require('../../env/heritage.config');

class HeritageDatabase {
    constructor() {
        if (!HeritageDatabase.instance) {
            this.pool = mysql.createPool(config);
            HeritageDatabase.instance = this;
        }
        return HeritageDatabase.instance;
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

module.exports = new HeritageDatabase();