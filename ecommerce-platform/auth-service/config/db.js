const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'auth_db',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

pool.connect((err, client, release) => {
    if(err){
        console.error(`failed to connect to the database:${err}`);
    }else{
        console.log("🟢 Connected to the database successfully");
        release();
    }
});

module.exports = pool;