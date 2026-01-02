const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '../.env' });

const sql = neon(process.env.DATABASE_URL);

async function checkIds() {
    try {
        const matchesType = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'matches' AND column_name = 'id'
        `;
        console.log('Matches ID type:', matchesType);

        const userType = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user' AND table_schema = 'neon_auth' AND column_name = 'id'
        `;
        console.log('User ID type:', userType);

    } catch (err) {
        console.error(err);
    }
}

checkIds();
