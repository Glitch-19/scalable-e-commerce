const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    user: process.env.PGUSER || 'postgres',       
    host: process.env.PGHOST || 'auth_db',        
    database: process.env.PGDATABASE || 'auth_db',
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'password123',
    port: process.env.PGPORT || 5432,
});

const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,          
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

async function initializeDatabase() {
    try {
        console.log('⏳ Connecting to database to create tables...');
        await pool.query(createUsersTableQuery);
        console.log('✅ Users table created successfully!');
    } catch (error) {
        console.error('❌ Error creating table:', error);
    } finally {
        await pool.end();
    }
}

initializeDatabase();