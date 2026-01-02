
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sql = neon(process.env.DATABASE_URL);

const stadiumToCity = {
    "Grand Stade de TANGER": "Tangier",
    "Stade MOHAMMED V": "Casablanca",
    "Complexe Sportif Prince MOULAY ABDELLAH": "Rabat",
    "Stade AL MADINA": "Berkane",
    "Grand Stade D’AGADIR": "Agadir",
    "Complexe Sportif de FES": "Fes",
    "Complexe Sportif Prince HÉRITIER MOULAY EL HASSAN": "Rabat",
    "Grand Stade de MARRAKECH": "Marrakech"
};

const dateMap = {
    "3 January 2026": "2026-01-03",
    "4 January 2026": "2026-01-04",
    "5 January 2026": "2026-01-05",
    "6 January 2026": "2026-01-06",
    "9 January 2026": "2026-01-09",
    "10 January 2026": "2026-01-10",
    "14 January 2026": "2026-01-14",
    "17 January 2026": "2026-01-17",
    "18 January 2026": "2026-01-18"
};

async function processKnockout() {
    const knockoutPath = path.join(__dirname, '../../src/data/knockout.md');
    if (!fs.existsSync(knockoutPath)) {
        console.error('knockout.md not found at', knockoutPath);
        return;
    }

    const content = fs.readFileSync(knockoutPath, 'utf8');
    // Split by sections starting with -
    const sections = content.split(/\n(?=-)/).filter(s => s.trim());
    const matches = [];

    for (const section of sections) {
        const lines = section.trim().split('\n').map(l => l.trim());
        if (lines.length < 5) continue;

        // Parse phase
        let phase = lines[0].startsWith('-') ? lines[0].substring(1) : lines[0];

        // Parse ID
        const idLine = lines.find(l => l.startsWith('id '));
        const id = idLine ? idLine.replace('id ', '') : '';

        // Match type line (e.g. Knockout Stage Round of Sixteen)
        const matchType = lines[2];

        // Date and Time
        const dateTimeLine = lines[3]; // Saturday 3 January 2026 - 17:00
        if (!dateTimeLine || !dateTimeLine.includes(' - ')) continue;
        const [dateStr, time] = dateTimeLine.split(' - ');
        const datePart = dateStr.split(' ').slice(1).join(' '); // 3 January 2026
        const date = dateMap[datePart] || datePart;

        // Stadium
        const stadium = lines[4];
        const city = stadiumToCity[stadium] || "Morocco";

        // Teams
        const teamsLine = lines[5]; // Senegal vs Sudan
        if (!teamsLine || !teamsLine.includes(' vs ')) continue;
        const [homeTeam, awayTeam] = teamsLine.split(' vs ');

        matches.push({
            id,
            homeTeam,
            awayTeam,
            date,
            time,
            stadium,
            city,
            phase,
            group: null,
            image: null
        });
    }

    console.log(`Parsed ${matches.length} matches.`);

    if (matches.length === 0) {
        console.error('No matches parsed. Check formatting of knockout.md');
        return;
    }

    // 1. Update matches.json
    fs.writeFileSync(path.join(__dirname, '../../src/data/matches.json'), JSON.stringify(matches, null, 4));
    console.log('Updated matches.json');

    // 2. Update database
    console.log('Updating database...');
    // Optional: clear existing knockout matches if they have different IDs? 
    // The user said "update and replace", so keeping it simple with upsert.
    for (const match of matches) {
        await sql`
            INSERT INTO matches (id, home_team, away_team, match_date, match_time, stadium, city, group_name, phase)
            VALUES (${match.id}, ${match.homeTeam}, ${match.awayTeam}, ${match.date}, ${match.time}, ${match.stadium}, ${match.city}, ${match.group}, ${match.phase})
            ON CONFLICT (id) DO UPDATE SET
                home_team = EXCLUDED.home_team,
                away_team = EXCLUDED.away_team,
                match_date = EXCLUDED.match_date,
                match_time = EXCLUDED.match_time,
                stadium = EXCLUDED.stadium,
                city = EXCLUDED.city,
                group_name = EXCLUDED.group_name,
                phase = EXCLUDED.phase
        `;
    }
    console.log('Database updated successfully!');
}

processKnockout().catch(console.error);
