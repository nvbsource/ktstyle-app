const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '02052019Bao@',
  database: 'quan_ly_quan_ao',
  charset: 'utf8mb4_general_ci'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

module.exports = db;
