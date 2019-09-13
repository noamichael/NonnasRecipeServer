const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const frontendHost = process.env.FRONTEND_HOST || '192.168.1.187:8080';

app.use(express.urlencoded()); //Parse URL-encoded bodies

app.get('/public-api/gateway', (req, res) => res.send({ active: true }));

app.use('/private-api/*', (req, res) => {
    return res.status(401).send('Unauthorized');
});

// Proxy our api routess
app.use('/', proxy(frontendHost));


/**
 * Get port from environment
 */
const port = process.env.PORT || '8282';

app.listen(port, () => {
    console.log(`Nonna's Recipe Gateway listening on ${port}`);
});