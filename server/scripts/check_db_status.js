const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '../.env' }); // Adjusted path since script is in server/scripts

const sql = neon(process.env.DATABASE_URL);

async function checkTables() {
    try {
        console.log('Checking tables...');
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log('Tables found:', tables.map(t => t.table_name));

        const authUserCols = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'user' AND table_schema = 'neon_auth'
        `;
        console.log('neon_auth.user columns:', authUserCols.map(c => c.column_name));

    } catch (err) {
        console.error('Error checking DB:', err);
    }
}

checkTables();
