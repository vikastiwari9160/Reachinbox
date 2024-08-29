const { sendMail, listMessages } = require('../controllers/gmail');
const { google } = require('googleapis');
const { generate } = require('../controllers/openAi');

async function Gmail(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const messages = await listMessages(auth);

    if (!messages) {
        console.log("no new messages found!");
        return { restart: true };
    }

    messages?.forEach(async (message) => {
        const fullmsg = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full',
        });

        await gmail.users.messages.modify({
            userId: 'me',
            id: message.id,
            resource: {
                removeLabelIds: ['UNREAD'],
            },
        });

        const headers = fullmsg.data.payload.headers;
        const fromHeader = headers.find(header => header.name === 'From');
        const senderEmail = fromHeader ? fromHeader.value : '';
        const subjectHeader = headers.find(header => header.name === 'Subject');
        const subject = subjectHeader ? subjectHeader.value : '';

        let body = '';
        if (fullmsg.data.payload.parts) {
            const part = fullmsg.data.payload.parts.find(part => part.mimeType === 'text/plain');
            if (part) {
                body = Buffer.from(part.body.data, 'base64').toString('utf-8');
            }
        } else {
            body = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8');
        }

        // generating user responce
        // const ressend = generate(subject, body, "gmail", senderEmail);
        const ressend = {};

        let resSub = ressend.subject ? res.subject : 'Hello ReachInBox this side';
        let resbody = ressend.body ? res.body : '';

        // sending email to the user
        sendMail(auth, senderEmail, resSub, resbody);
        console.log("Mail send to senderEmail");
    })
}

module.exports = { Gmail };