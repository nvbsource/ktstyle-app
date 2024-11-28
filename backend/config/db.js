const mysql = require('mysql2')
const db = mysql.createConnection({
  host: '103.56.160.196',
  user: 'root',
  port: 3307,
  password: 'GA7gJBCXs2Pbeev',
  database: 'quan_ly_quan_ao',
  charset: 'utf8mb4_general_ci',
})

db.connect((err) => {
  if (err) throw err
  console.log('Connected to database')
})

module.exports = db
