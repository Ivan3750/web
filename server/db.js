const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test_db',
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ Successfully connected to the database');
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
})();

module.exports = db;
