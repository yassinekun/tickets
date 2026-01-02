const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL);

async function syncMatches() {
    try {
        const dataPath = path.join(__dirname, '../../src/data/matches.json');
        console.log(`Reading matches from: ${dataPath}`);

        if (!fs.existsSync(dataPath)) {
            console.error('Matches JSON file not found!');
            return;
        }

        const matchesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`Syncing ${matchesData.length} matches to ${process.env.DATABASE_URL.split('@')[1]}...`);

        for (const match of matchesData) {
            await sql`
                INSERT INTO matches (id, home_team, away_team, match_date, match_time, stadium, city, group_name, phase, image)
                VALUES (${match.id}, ${match.homeTeam}, ${match.awayTeam}, ${match.date}, ${match.time}, ${match.stadium}, ${match.city}, ${match.group || null}, ${match.phase}, ${match.image || null})
                ON CONFLICT (id) DO UPDATE SET
                    home_team = EXCLUDED.home_team,
                    away_team = EXCLUDED.away_team,
                    match_date = EXCLUDED.match_date,
                    match_time = EXCLUDED.match_time,
                    stadium = EXCLUDED.stadium,
                    city = EXCLUDED.city,
                    group_name = EXCLUDED.group_name,
                    phase = EXCLUDED.phase,
                    image = EXCLUDED.image
            `;
        }

        console.log('Matches synced successfully!');
    } catch (err) {
        console.error('Error syncing matches:', err);
    }
}

syncMatches();
