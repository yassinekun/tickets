const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '../.env' });

const sql = neon(process.env.DATABASE_URL);

async function checkSchema() {
    try {
        console.log('Checking alerts table nullability...');
        const columns = await sql`
            SELECT column_name, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'alerts'
        `;
        console.log('Alerts columns nullability:', columns);

    } catch (err) {
        console.error('Error checking schema:', err);
    }
}

checkSchema();
