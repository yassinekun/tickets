const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL);

async function verify() {
    try {
        const result = await sql`SELECT count(*) FROM matches WHERE id = '39'`;
        console.log('Match 39 check:', result);
    } catch (err) {
        console.error('Error:', err);
    }
}

verify();
