import { neon, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Configure Neon
neonConfig.fetchConnectionCache = true;
const sql = neon(process.env.DATABASE_URL!);

// Logging middleware to debug 404s and requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') console.log('Body:', req.body);
    next();
});

const requestHandler = async (req: express.Request, res: express.Response) => {
    try {
        const result = await sql`SELECT version()`;
        const { version } = result[0];
        res.json({ version });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database connection failed' });
    }
};

app.get('/', requestHandler);

// API Routes
app.get('/api/matches', async (req, res) => {
    try {
        const matches = await sql`SELECT * FROM matches ORDER BY match_date, match_time`;
        res.json(matches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

app.post('/api/alerts', async (req, res) => {
    try {
        const { match_id, alert_type, email } = req.body;

        // Always set to pending for admin activation as per user requirement
        const initialStatus = 'Pending';
        console.log(`ALERT CREATION - Assigned status: ${initialStatus}`);
        console.log(`ALERT CREATION - Assigned status: ${initialStatus}`);

        const result = await sql`
            INSERT INTO alerts (match_id, alert_type, email, status)
            VALUES (${match_id || null}, ${alert_type}, ${email}, ${initialStatus})
            RETURNING *
        `;
        res.json(result[0]);
    } catch (error) {
        console.error('SERVER ERROR - POST /api/alerts:', error);
        res.status(500).json({ error: 'Failed to create alert' });
    }
});

app.get('/api/users/:email/alerts', async (req, res) => {
    try {
        const { email } = req.params;
        const alerts = await sql`
            SELECT a.*, m.home_team, m.away_team 
            FROM alerts a
            LEFT JOIN matches m ON a.match_id = m.id
            WHERE LOWER(a.email) = LOWER(${email})
            ORDER BY a.created_at DESC
        `;
        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user alerts' });
    }
});

app.delete('/api/alerts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Handle both UUID and integer IDs if necessary
        await sql`DELETE FROM alerts WHERE id::text = ${id}`;
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete alert' });
    }
});

// Admin Activate/Deactivate Alert
app.post('/api/admin/alerts/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log(`Updating alert ${id} to status ${status}`);

        await sql`UPDATE alerts SET status = ${status} WHERE id::text = ${id}`;
        res.json({ success: true });
    } catch (error) {
        console.error('SERVER ERROR - POST /api/admin/alerts/:id/status:', error);
        res.status(500).json({
            error: 'Failed to update alert status',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// Verification Routes
app.post('/api/users/verify', async (req, res) => {
    try {
        const { user_id, email, name } = req.body;
        // Check if already exists
        const existing = await sql`SELECT * FROM seller_verifications WHERE user_id = ${user_id} AND status = 'pending'`;
        if (existing.length > 0) {
            return res.json({ message: 'Verification already pending', ...existing[0] });
        }

        const result = await sql`
            INSERT INTO seller_verifications (user_id, user_email, user_name)
            VALUES (${user_id}, ${email}, ${name})
            RETURNING *
        `;
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to request verification' });
    }
});

app.get('/api/admin/verifications', async (req, res) => {
    try {
        const result = await sql`SELECT * FROM seller_verifications ORDER BY created_at DESC`;
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch verifications' });
    }
});

app.post('/api/admin/verify', async (req, res) => {
    try {
        const { user_id, action } = req.body; // action: 'approve' | 'reject'

        if (action === 'approve') {
            await sql`UPDATE "neon_auth"."user" SET is_seller_verified = true WHERE id = ${user_id}::uuid`;
            await sql`UPDATE seller_verifications SET status = 'approved' WHERE user_id = ${user_id}`;
            res.json({ success: true, message: 'User verified' });
        } else {
            await sql`UPDATE "neon_auth"."user" SET is_seller_verified = false WHERE id = ${user_id}::uuid`;
            await sql`UPDATE seller_verifications SET status = 'rejected' WHERE user_id = ${user_id}`;
            res.json({ success: true, message: 'User verification rejected' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process verification' });
    }
});

app.get('/api/matches/:id/tickets', async (req, res) => {
    try {
        const { id } = req.params;
        const tickets = await sql`
            SELECT t.*, u.name as seller_name, u.is_seller_verified 
            FROM tickets t 
            LEFT JOIN "neon_auth"."user" u ON t.seller_id = u.id::text 
            WHERE t.match_id = ${id} AND (t.status = 'available' OR t.status = 'Active')
        `;
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

app.post('/api/tickets', async (req, res) => {
    try {
        const { matchId, sellerId, category, quantity } = req.body;
        const result = await sql`
            INSERT INTO tickets (match_id, seller_id, category, quantity, status)
            VALUES (${matchId}, ${sellerId}, ${category}, ${quantity}, 'available')
            RETURNING *
        `;
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

app.delete('/api/tickets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM tickets WHERE id = ${id}`;
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

app.get('/api/users/:email/tickets', async (req, res) => {
    try {
        const { email } = req.params;
        const tix = await sql`
             SELECT t.*, m.home_team, m.away_team, m.match_date 
             FROM tickets t
             JOIN matches m ON t.match_id = m.id
             WHERE t.seller_id = (SELECT id::text FROM "neon_auth"."user" WHERE email = ${email} LIMIT 1)
        `;
        res.json(tix);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user tickets' });
    }
});

app.get('/api/users/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await sql`
            SELECT id, name, email, is_seller_verified 
            FROM "neon_auth"."user" 
            WHERE LOWER(email) = LOWER(${email})
        `;
        if (result.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Swap Routes
app.get('/api/swaps', async (req, res) => {
    try {
        const result = await sql`
            SELECT s.*, 
                   u.is_seller_verified as verified,
                   m1.home_team as offering_home, m1.away_team as offering_away, m1.match_date as offering_date,
                   m2.home_team as looking_home, m2.away_team as looking_away, m2.match_date as looking_date
            FROM swaps s
            JOIN matches m1 ON s.offering_match_id = m1.id
            JOIN matches m2 ON s.looking_for_match_id = m2.id
            LEFT JOIN "neon_auth"."user" u ON LOWER(s.user_email) = LOWER(u.email)
            ORDER BY s.created_at DESC
        `;
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch swaps' });
    }
});

app.get('/api/users/:email/swaps', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await sql`
            SELECT s.*, 
                   u.is_seller_verified as verified,
                   m1.home_team as offering_home, m1.away_team as offering_away, m1.match_date as offering_date,
                   m2.home_team as looking_home, m2.away_team as looking_away, m2.match_date as looking_date
            FROM swaps s
            JOIN matches m1 ON s.offering_match_id = m1.id
            JOIN matches m2 ON s.looking_for_match_id = m2.id
            LEFT JOIN "neon_auth"."user" u ON LOWER(s.user_email) = LOWER(u.email)
            WHERE LOWER(s.user_email) = LOWER(${email})
            ORDER BY s.created_at DESC
        `;
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user swaps' });
    }
});

app.post('/api/swaps', async (req, res) => {
    try {
        const { user_email, user_name, offering_match_id, looking_for_match_id, is_verified } = req.body;
        const result = await sql`
            INSERT INTO swaps (user_email, user_name, offering_match_id, looking_for_match_id, is_verified)
            VALUES (${user_email}, ${user_name}, ${offering_match_id}, ${looking_for_match_id}, ${is_verified || false})
            RETURNING *
        `;
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create swap' });
    }
});

app.delete('/api/swaps/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM swaps WHERE id = ${id}`;
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete swap' });
    }
});

// Admin Alerts
app.get('/api/admin/alerts', async (req, res) => {
    try {
        const alerts = await sql`SELECT * FROM alerts ORDER BY created_at DESC LIMIT 50`;
        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

// Admin APIs
app.get('/api/admin/stats', async (req, res) => {
    try {
        const users = await sql`SELECT COUNT(*) FROM "neon_auth"."user"`;
        const matchesCount = await sql`SELECT COUNT(*) FROM matches`;
        const ticketsCount = await sql`SELECT COUNT(*) FROM tickets`;
        const alertsCount = await sql`SELECT COUNT(*) FROM alerts`;

        // Return explicit integer values to avoid frontend mapping issues
        res.json({
            users: parseInt(users[0].count) || 0,
            matches: parseInt(matchesCount[0].count) || 0,
            tickets: parseInt(ticketsCount[0].count) || 0,
            alerts: parseInt(alertsCount[0].count) || 0,
            sales: (parseInt(ticketsCount[0].count) * 45).toLocaleString() + ' EUR'
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        // Fetch users with verification status
        const users = await sql`
            SELECT id, name, email, "createdAt", role, is_seller_verified 
            FROM "neon_auth"."user" 
            ORDER BY "createdAt" DESC 
        `;
        res.json(users);
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
