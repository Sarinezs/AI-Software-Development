const mysql = require('mysql2/promise');
require('dotenv').config();

// การตั้งค่าการเชื่อมต่อ
const db = mysql.createPool({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: process.env.DB_port
});

module.exports = db;