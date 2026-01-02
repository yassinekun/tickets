
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function cleanup() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        console.log("Starting Group Stage cleanup...");

        // 1. Delete alerts referencing group matches
        await sql`DELETE FROM alerts WHERE match_id IN (SELECT id FROM matches WHERE phase = 'Group Stage' OR group_name IS NOT NULL)`;
        console.log("Alerts cleaned.");

        // 2. Delete swaps referencing group matches
        await sql`DELETE FROM swaps WHERE offering_match_id IN (SELECT id FROM matches WHERE phase = 'Group Stage' OR group_name IS NOT NULL) 
                  OR looking_for_match_id IN (SELECT id FROM matches WHERE phase = 'Group Stage' OR group_name IS NOT NULL)`;
        console.log("Swaps cleaned.");

        // 3. Delete tickets referencing group matches
        await sql`DELETE FROM tickets WHERE match_id IN (SELECT id FROM matches WHERE phase = 'Group Stage' OR group_name IS NOT NULL)`;
        console.log("Tickets cleaned.");

        // 4. Delete the matches themselves
        const result = await sql`DELETE FROM matches WHERE phase = 'Group Stage' OR group_name IS NOT NULL RETURNING id`;
        console.log(`Cleanup complete. Deleted ${result.length} matches.`);

    } catch (e) {
        console.error("Cleanup failed:", e);
    }
}

cleanup();
