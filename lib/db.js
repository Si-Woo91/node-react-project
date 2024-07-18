var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'reactboard'
});
db.connect();

module.exports = db;