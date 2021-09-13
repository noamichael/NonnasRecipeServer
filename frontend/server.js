const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const helmet = require("helmet");

const app = express();
const api = process.env.PUBLIC_API || 'backend:6789';

// Set security headers (excluding content policy)
// since that breaks Angular's dyanimc styles
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist'), {
    // Make sure the index.html is always loaded to
    // avoid serving old angular dist files
    setHeaders: (res, path, stat) => {
        if (path.indexOf("index.html") > -1) {
            noCache(res);
        }
    }
}));

// Proxy our api routes
app.use('/api', doProxy(api, '/api'));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    noCache(res);
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

// Sets the Cache-Control header on the given request
function noCache(res) {
    res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
} 