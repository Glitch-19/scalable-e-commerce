const {Pool} = require('pg');
require('dotenv').config();

// ✅ Correct setup for pg-pool:
const pool = new Pool({
  host: process.env.PGHOST || 'auth_db',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'password123',
  database: process.env.PGDATABASE || 'auth_db',
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