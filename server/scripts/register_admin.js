import https from 'https';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const authUrl = new URL(process.env.VITE_BETTER_AUTH_URL || '');

const data = JSON.stringify({
    email: 'admin@macantik.com',
    password: 'macadmin25',
    name: 'Admin User'
});

const options = {
    hostname: authUrl.hostname,
    path: `${authUrl.pathname}/sign-up/email`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Origin': 'http://localhost:5173'
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);
    });
});

req.on('error', (e) => {
    console.error('Error:', e);
});

req.write(data);
req.end();
