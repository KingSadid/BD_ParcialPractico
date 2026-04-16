const heritageConfig = {
    host: process.env.DB_HERITAGE_HOST || 'localhost',
    user: process.env.DB_HERITAGE_USER || 'root',
    password: process.env.DB_HERITAGE_PASSWORD || 'root',
    database: 'db_heritage',
    port: parseInt(process.env.DB_HERITAGE_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone: '+00:00'
};

module.exports = heritageConfig;