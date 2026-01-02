const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL);

async function checkConstraint() {
    try {
        console.log('Fetching constraints for table "alerts"...');
        const result = await sql`
            SELECT
                conname AS constraint_name,
                pg_get_constraintdef(c.oid) AS constraint_definition
            FROM
                pg_constraint c
            JOIN
                pg_namespace n ON n.oid = c.connamespace
            WHERE
                contype = 'c'
                AND conrelid = 'public.alerts'::regclass;
        `;
        console.log('Constraints:', JSON.stringify(result, null, 2));

        const data = await sql`SELECT DISTINCT status FROM alerts`;
        console.log('Existing status values:', data);

    } catch (err) {
        console.error('Error fetching constraint info:', err);
    }
}

checkConstraint();
