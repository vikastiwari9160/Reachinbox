require('dotenv').config();
const { OpenAI } = require('openai');
const { fs } = require('fs');

const openai = new OpenAI({ apiKey: process.env.apiKey });

async function generate(subject, body, from, senderEmail) {
    const completion = await openai.chat.completions.create({
        model: "davinci-002",
        messages: [
            {
                role: "user",
                content: `create responce for \n ${subject} \n ${body} \n only in json format include subject, body and label according to the message from labels "Interested, Not Interested, More information needed"`,
            },
        ],
    });
    const res = JSON.stringify(completion.choices[0].message);

    // storing the interested and other labels with user id in data
    const data = `${senderEmail}+" "+${from}+" "+${res?.label}`;
    fs.appendFile('../Data/Userlist.txt', data, (err) => {
        if (err) throw err;
    });
    return res;
}

module.exports = { generate };