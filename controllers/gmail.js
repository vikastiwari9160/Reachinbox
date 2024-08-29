const { google } = require('googleapis');

async function listMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults: 10,
    });

    return res.data.messages;
}

async function sendMail(auth, userEmail, subject, msg) {
    const gmail = google.gmail({ version: 'v1', auth });
    const email = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        'MIME-Version: 1.0\n',
        'Content-Transfer-Encoding: 7bit\n',
        `to: ${userEmail}\n`,
        `subject: ${subject}\n\n`,
        `${msg}`,
    ].join('');

    const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
        const res = await gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: encodedMessage,
            },
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { listMessages, sendMail };
