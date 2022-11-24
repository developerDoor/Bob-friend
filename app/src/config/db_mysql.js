import mysql from 'mysql2/promise';

const connection = mysql.createPool({
    host : process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    user : process.env.DB_MYSQL_USER,
    password : process.env.DB_MYSQL_PSWORD,
    database : process.env.DB_MYSQL_DATABASE,
    namedPlaceholders : true
})


export default connection;