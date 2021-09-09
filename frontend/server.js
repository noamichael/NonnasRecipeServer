const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const helmet = require("helmet");

const app = express();
const api = process.env.PUBLIC_API || 'backend:6789';

app.use(helmet());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy our api routes
app.use('/api', doProxy(api, '/api'));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment
 */
const port = process.env.PORT || '8080';

app.listen(port, () => {
    console.log(`Nonna's Recipe Frontend listening on ${port}`);
});

function doProxy(proxyHost, replace) {
    return proxy(proxyHost, {
        proxyReqPathResolver: (req) => {
            return req.url.replace(replace, '');
        }
    });
}