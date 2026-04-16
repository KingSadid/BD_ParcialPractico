const mysql = require('mysql2/promise');
const config = require('../env/reservationsConfig');

const pool = mysql.createPool(config);

module.exports = pool;