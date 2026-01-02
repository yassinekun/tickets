const fs = require('fs');
const path = require('path');

try {
    const jsonPath = 'c:/Users/Dell/Desktop/Projects/cantik/src/data/matches.json';
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const matches = JSON.parse(rawData);

    const sql = matches.map(m => {
        const escape = str => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
        return `INSERT INTO matches (id, home_team, away_team, match_date, match_time, stadium, city, group_name, phase, image) VALUES (${escape(m.id)}, ${escape(m.homeTeam)}, ${escape(m.awayTeam)}, ${escape(m.date)}, ${escape(m.time)}, ${escape(m.stadium)}, ${escape(m.city)}, ${escape(m.group)}, ${escape(m.phase)}, ${escape(m.image)}) ON CONFLICT (id) DO NOTHING;`;
    });

    fs.writeFileSync('c:/Users/Dell/Desktop/Projects/cantik/matches_insert.sql', sql.join('\n'));
    console.log('SQL generated successfully');
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
