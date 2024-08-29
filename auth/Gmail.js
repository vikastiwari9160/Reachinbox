require('dotenv').config();
const { exec } = require('child_process');
const { getCode } = require('../services/express');
const { google } = require('googleapis');

const TOKEN_PATH = './tokens/token.json';

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify'
];

async function authorize() {
    const client_secret = process.env.client_secret;
    const client_id = process.env.client_id;
    const redirect_uris = process.env.redirect_uris;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } else {
        return await getAccessToken(oAuth2Client);
    }
}

async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        response_type: 'code',
    });

    exec(`start "" "${authUrl}"`);
    const code = await getCode();

    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    })
}

module.exports = { authorize };