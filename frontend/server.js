const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');

const app = express();
const publicAPI = process.env.PUBLIC_API || 'localhost:6789';
const privateAPI = process.env.PRIVATE_API || 'localhost:7890';

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy our api routes
app.use('/public-api', doProxy(publicAPI, '/public-api'));
app.use('/private-api', doProxy(privateAPI, '/private-api'));

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