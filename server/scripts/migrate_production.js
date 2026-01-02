const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

/**
 * Migration script to copy matches data from development to production.
 * Source (Dev): ep-divine-mountain-ag4h0rfi
 * Target (Prod): ep-holy-bush-ag2obcqc (from .env)
 */

const devUrl = 'postgresql://neondb_owner:npg_1KXqD7ovjULI@ep-divine-mountain-ag4h0rfi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const prodUrl = process.env.DATABASE_URL;

async function migrateMatches() {
    console.log('--- PRODUCTION MIGRATION (CASCADE CLEANUP) ---');
    console.log('Target (Production):', prodUrl.split('@')[1]);
    console.log('Source (Development):', devUrl.split('@')[1]);

    const sqlDev = neon(devUrl);
    const sqlProd = neon(prodUrl);

    try {
        console.log('Step 1: Cascading cleanup in production...');
        // Order matters for FK constraints
        console.log(' - Cleaning tickets...');
        await sqlProd`DELETE FROM tickets`;
        console.log(' - Cleaning alerts...');
        await sqlProd`DELETE FROM alerts`;
        console.log(' - Cleaning swaps...');
        await sqlProd`DELETE FROM swaps`;
        console.log(' - Cleaning matches...');
        await sqlProd`DELETE FROM matches`;
        console.log('Production database cleaned.');

        console.log('Step 2: Fetching matches from development database...');
        const matches = await sqlDev`SELECT * FROM matches`;
        console.log(`Found ${matches.length} matches in development.`);

        if (matches.length === 0) {
            console.log('No matches found in development. Aborting.');
            return;
        }

        console.log('Step 3: Inserting matches into production...');
        for (const match of matches) {
            await sqlProd`
                INSERT INTO matches (id, home_team, away_team, match_date, match_time, stadium, city, group_name, phase, image)
                VALUES (${match.id}, ${match.home_team}, ${match.away_team}, ${match.match_date}, ${match.match_time}, ${match.stadium}, ${match.city}, ${match.group_name}, ${match.phase}, ${match.image})
            `;
        }

        console.log('--- MIGRATION COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('--- MIGRATION FAILED ---');
        console.error('Error details:', err.message);
    }
}

migrateMatches();
