import pg from 'pg';

const client = new pg.Pool({
    host : process.env.DB_POSTGRESQL_HOST,
    port : process.env.DB_POSTGRESQL_PORT,
    user : process.env.DB_POSTGRESQL_USER,
    password : process.env.DB_POSTGRESQL_PSWORD,
    database : process.env.DB_POSTGRESQL_DATABASE,
})

// client.connect(err => {
//     if (err) {
//         console.log('Failed to connect db ' + err)
//     } else {
//         console.log('Connect to db done!')
//     }
// })

export default client;