
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL);

async function main() {
    try {
        console.log("Listing all tables...");
        const tables = await sql`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    `;
        console.log("Found tables:", tables);

        // Look for user table
        let userTableDecl = null;
        let schema = 'public';

        const authUser = tables.find(t => t.table_name === 'user' || t.table_name === 'users');
        if (authUser) {
            userTableDecl = authUser.table_name;
            schema = authUser.table_schema;
        } else {
            // Check neon_auth schema
            const neonUser = tables.find(t => t.table_schema === 'neon_auth' && (t.table_name === 'users' || t.table_name === 'user'));
            if (neonUser) {
                userTableDecl = neonUser.table_name;
                schema = neonUser.table_schema;
            }
        }

        if (!userTableDecl) {
            console.error("User table not found!");
            return;
        }

        console.log(`Targeting table: "${schema}"."${userTableDecl}"`);

        // Add columns
        await sql(`ALTER TABLE "${schema}"."${userTableDecl}" ADD COLUMN IF NOT EXISTS phone_number TEXT`);
        await sql(`ALTER TABLE "${schema}"."${userTableDecl}" ADD COLUMN IF NOT EXISTS whatsapp_available BOOLEAN DEFAULT false`);

        console.log("Columns added successfully.");
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
