const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '../.env' });

const sql = neon(process.env.DATABASE_URL);

async function checkSchema() {
    try {
        console.log('Checking tickets table columns...');
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'tickets'
        `;
        console.log('Tickets columns:', columns);

        console.log('Checking alerts table columns...');
        const alertCols = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'alerts'
        `;
        console.log('Alerts columns:', alertCols);

    } catch (err) {
        console.error('Error checking schema:', err);
    }
}

checkSchema();
