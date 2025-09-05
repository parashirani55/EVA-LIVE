// config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
  waitForConnections: true,
  connectionLimit: 50,   // safe limit for pool
  queueLimit: 0
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ MySQL connected to database:', process.env.DB_NAME);
});

module.exports = db;
