const express = require('express');

function getCode() {
    return new Promise((resolve, reject) => {
        const app = express();
        const PORT = 3000;

        app.get('/oauth2callback', (req, res) => {
            const code = req.query.code;
            res.send(`
                <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Close Window</title>
    </head>
    <body>
      <script>
        // This script closes the current browser window
        window.close();
      </script>
      <p>If the window did not close automatically, it might be due to browser restrictions.</p>
    </body>
    </html>
    `);
            server.close(() => {
                resolve(code);
            });
        });

        const server = app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

        server.on('error', (err) => {
            console.error('Server error:', err);
            reject(err);
        });
    });
}

module.exports = { getCode };
