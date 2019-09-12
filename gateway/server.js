const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-local')

const app = express();
const users = {
    mom: { username: 'mom' }
};
const frontendHost = process.env.FRONTEND_HOST || '192.168.1.187:8080';

app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(
    function (username, password, done) {
        if (username == 'mom' && password == 'test') {
            return done(null, users.mom);
        }
        return done(null, false);
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.username);
});

passport.deserializeUser(function (id, cb) {
    if (!users[id]) {
        return cb("Not found");
    }
    return cb(null, users[id]);
});

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

// Proxy our api routess
app.use('/', ensureAuthenticated, proxy(frontendHost));


/**
 * Get port from environment
 */
const port = process.env.PORT || '8282';

app.listen(port, () => {
    console.log(`Nonna's Recipe Gateway listening on ${port}`);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); } else { res.redirect('/login'); }
}
