const { authorize } = require('./auth/Gmail');
const { Gmail } = require('./services/Gmail');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

async function startGmail(auth) {
    return await Gmail(auth);
}

async function main() {
    console.log("Select any one of the following services:\n 1.Gmail \n 2.Outlook \n any other key for exit");
    rl.on('line', async (input) => {
        if (input === '1') {
            let auth = await authorize();
            let res = startGmail(auth);
            if (res?.restart) main();
            else setInterval(() => {
                startGmail(auth);
            }, 5000);
        } else if (input === 2) {
            // outlook
        } else {
            rl.close();
        }
    });
}

main();