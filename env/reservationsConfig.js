const reservationsConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_reservations',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = reservationsConfig;