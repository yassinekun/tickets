const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL);

async function checkConstraint() {
    try {
        console.log('Fetching constraints for table "seller_verifications"...');
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
                AND conrelid = 'public.seller_verifications'::regclass;
        `;
        console.log('Constraints:', JSON.stringify(result, null, 2));

    } catch (err) {
        console.error('Error fetching constraint info:', err);
    }
}

checkConstraint();
