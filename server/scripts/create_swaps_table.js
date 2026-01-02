const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in .env');
    console.error('Path checked:', path.join(__dirname, '../../.env'));
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
    try {
        console.log('Creating swaps table...');
        await sql`
            CREATE TABLE IF NOT EXISTS swaps (
                id SERIAL PRIMARY KEY,
                user_email TEXT NOT NULL,
                user_name TEXT,
                offering_match_id TEXT NOT NULL,
                looking_for_match_id TEXT NOT NULL,
                status TEXT DEFAULT 'Open',
                is_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('Table swaps created successfully.');

        // Add index on email for faster lookups
        // Using DO block to avoid error if index exists (CREATE INDEX IF NOT EXISTS is PG 9.5+)
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_swaps_email' AND n.nspname = 'public') THEN
                    CREATE INDEX idx_swaps_email ON swaps(user_email);
                END IF;
            END
            $$;
        `;

        console.log('Schema update complete.');
    } catch (error) {
        console.error('Error updating schema:', error);
    }
}

main();
