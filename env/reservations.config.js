const reservationsConfig = {
    host: process.env.DB_RESERVATIONS_HOST || 'localhost',
    user: process.env.DB_RESERVATIONS_USER || 'root',
    password: process.env.DB_RESERVATIONS_PASSWORD || 'root',
    database: 'db_reservations',
    port: parseInt(process.env.DB_RESERVATIONS_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone: '+00:00'
};

module.exports = reservationsConfig;