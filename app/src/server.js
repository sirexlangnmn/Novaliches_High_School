/*

http://patorjk.com/software/taag/#p=display&f=ANSI%20Regular&t=Server

███████ ███████ ██████  ██    ██ ███████ ██████
██      ██      ██   ██ ██    ██ ██      ██   ██
███████ █████   ██████  ██    ██ █████   ██████
     ██ ██      ██   ██  ██  ██  ██      ██   ██
███████ ███████ ██   ██   ████   ███████ ██   ██

dependencies: {
    compression     : https://www.npmjs.com/package/compression
    cors            : https://www.npmjs.com/package/cors
    dotenv          : https://www.npmjs.com/package/dotenv
    express         : https://www.npmjs.com/package/express
    socket.io       : https://www.npmjs.com/package/socket.io
    swagger         : https://www.npmjs.com/package/swagger-ui-express
    uuid            : https://www.npmjs.com/package/uuid
    yamljs          : https://www.npmjs.com/package/yamljs
    ejs             : https://www.npmjs.com/package/ejs
    mysql           : https://www.npmjs.com/package/mysql
    body-parser     : https://www.npmjs.com/package/body-parser
    bcrypt          : https://www.npmjs.com/package/bcrypt
    express-flash   : https://www.npmjs.com/package/express-flash
    express-session : https://www.npmjs.com/package/express-session
    method-override : https://www.npmjs.com/package/method-override
    nodemon         : https://www.npmjs.com/package/nodemon
    passport        : https://www.npmjs.com/package/passport
    passport-local  : https://www.npmjs.com/package/passport-local
    jsonwebtoken    : https://www.npmjs.com/package/jsonwebtoken
    pdfkit          : https://www.npmjs.com/package/pdfkit
}

*/

'use strict'; // https://www.w3schools.com/js/js_strict.asp

require('dotenv').config();

const { Server } = require('socket.io');
const http = require('http');
const https = require('https');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');
const app = express();
const cron = require('node-cron');

// let corsOptions = {
//     origin: "dev.allworldtrade.com"
// };

//app.use(cors(corsOptions));

app.use(
    cors({
        origin: [
            'https://allworldtrade.com',
            'https://www.allworldtrade.com',
            'https://dev.allworldtrade.com',
            'http://localhost:3000',
            'https://meet.allworldtrade.com',
            'https://meet2.allworldtrade.com',
        ],
    }),
);
//app.use(cors()); // Enable All CORS Requests for all origins

app.use(compression()); // Compress all HTTP responses using GZip

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

const session = require('express-session');
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict', //👈 new code
        },
    }),
);

let { lodashNonce } = require('../middleware/nonces');

// Set CSP with helmet
// const helmet = require("../middleware/helmet")
// app.use(helmet);

app.use(function (req, res, next) {
    // let location_hostname = req.hostname;
    // let host = '';
    // if (location_hostname === 'localhost') {
    //     host = 'http://' + location_hostname + ':' + 3000;
    // }
    // if (location_hostname === 'allworldtrade.com' || location_hostname.endsWith('.allworldtrade.com') || location_hostname === 'meet.allworldtrade.com' || location_hostname === 'meet2.allworldtrade.com') {
    //     host = 'https://' + location_hostname;
    // }

    const corsWhitelist = [
        'http://localhost:3000',
        'https://meet.allworldtrade.com',
        'https://meet2.allworldtrade.com',
        'https://allworldtrade.com',
        'https://www.allworldtrade.com',
        'https://dev.allworldtrade.com',
    ];

    //console.log('check: ', 'Content-Security-Policy-Report-Only', "font-src 'self' https://fonts.gstatic.com; img-src 'self'; script-src 'self' https://code.jquery.com/jquery-3.6.0.min.js https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.3.0/sweetalert2.min.js https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js https://unpkg.com/ionicons@5.2.3/dist/ionicons.js 'nonce-" + lodashNonce +"'; frame-ancestors 'self'; frame-src 'self'");
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }

    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    // res.setHeader('Content-Security-Policy', "frame-ancestors 'self'; frame-src 'self'");
    // res.setHeader(
    //     'Content-Security-Policy-Report-Only', "default-src 'self'; font-src 'self' https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2; img-src 'self'; script-src 'self' 'nonce-" + lodashNonce +"' ; style-src 'self' 'nonce-" + lodashNonce +"' https://fonts.googleapis.com; frame-ancestors 'self'; form-action 'self'; frame-src 'self'",
    // );

    res.setHeader('X-Frame-Options', 'sameorigin');

    next();
});

const isHttps = false; // must be the same to client.js isHttps
const port = process.env.PORT; // must be the same to client.js signalingServerPort

let io, server, host;

if (isHttps) {
    const fs = require('fs');
    const options = {
        key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem'), 'utf-8'),
        cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem'), 'utf-8'),
    };
    server = https.createServer(options, app);
    io = new Server().listen(server);
    host = 'https://' + 'localhost' + ':' + port;
} else {
    server = http.createServer(app);
    io = new Server().listen(server);
    host = 'http://' + 'localhost' + ':' + port;
}

const api_key_secret = process.env.API_KEY_SECRET;

require('../routes/index.js')(app);
require('../routes/password.routes.js')(app);
require('../routes/upload.routes.js')(app);
require('../routes/email-marketing.routes.js')(app);
require('../routes/forgot-password.routes.js')(app);

const pdfService = require('../services/pdf-service');
const pdfServiceForTrader = require('../services/pdf-trader');

const Logger = require('./Logger');
const log = new Logger('server');

// Use all static files from the public folder
app.use(express.static(path.join(__dirname, '../../', 'public')));

// Api parse body data as json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // dati naka comment ito

// Remove trailing slashes in url handle bad requests
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        log.debug('Request Error', {
            header: req.headers,
            body: req.body,
            error: err.message,
        });
        return res.status(400).send({ status: 404, message: err.message }); // Bad request
    }
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        let query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});

// set the view engine to ejs
app.set('view engine', 'ejs');

// ======================================
// db sequelize sync process [start]
//=======================================
const db = require('../models');
const ecdc = require('../shared/ecdc.js');

db.sequelize
    .sync()
    .then(() => {
        console.log('Synced db.');
    })
    .catch((err) => {
        console.log('Failed to sync db: ' + err.message);
    });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

require('../routes/sequelize.route.js')(app);
require('../routes/encrypt.route.js')(app);

// set port, listen for requests
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}.`);
// });

// =====================================
// db sequelize sync process [end]
//======================================



// ==============================
// Helpers / Utilities
// ==============================

function phTime() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(now);

    const get = (type) => parts.find((p) => p.type === type).value;

    const phTime = `${get('year')}-${get('month')}-${get('day')} ` + `${get('hour')}:${get('minute')}:${get('second')}`;

    return phTime;
}


const getUserUuidFromSession = (sessionUser) => {
    if (!sessionUser || !sessionUser.uuid) return null;
    return ecdc.decryptUuid(sessionUser.uuid);
};


const buildLoginViewData = () => ({
    ourGenerateNonce: lodashNonce,
});


const buildViewData = (sessionUser) => ({
    uuid: sessionUser.uuid,
    type: sessionUser.type,
    first_name: sessionUser.first_name,
    last_name: sessionUser.last_name,
    email: sessionUser.email_or_social_media,
    ourGenerateNonce: lodashNonce,
});


const renderLogin = (res) => {
    return res.render(
        path.join(__dirname, '../../', 'public/view/login/index'),
        { data: buildLoginViewData() }
    );
};





const VIEW_BASE_PATH = path.join(__dirname, '../../', 'public/view');

const renderPage = (res, page, data = {}) => {
    const viewPath = path.join(VIEW_BASE_PATH, page, 'index');

    return res.render(viewPath, { data });
};


// ==============================
// Business Logic
// ==============================

const isUserLoggedIn = async (sessionUser) => {
    const userUuid = getUserUuidFromSession(sessionUser);

    if (!userUuid) return false;

    const loginStatus = await checkUserLoginStatus(userUuid);

    console.log('isUserLoggedIn userUuid:', userUuid);
    console.log('isUserLoggedIn loginStatus:', loginStatus);

    return !!loginStatus;
};



// home
app.get(['/'], (req, res) => {
    if (req.session.user === undefined) {
        const sessionData = {
            uuid: '',
            type: '',
            first_name: '',
            last_name: '',
            email: '',
            country: '',
            state_or_province: '',
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/home/home'), {
            data: sessionData,
        });
    } else {
        const sessionData = {
            uuid: req.session.user.uuid,
            type: req.session.user.type,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            email: req.session.user.email_or_social_media,
            country: req.session.user.country,
            state_or_province: req.session.user.state_or_province,
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/home/home'), {
            data: sessionData,
        });
    }
});


app.get(['/class-record'], (req, res) => {
    if (req.session.user === undefined) {
        const sessionData = {
            uuid: '',
            type: '',
            first_name: '',
            last_name: '',
            email: '',
            country: '',
            state_or_province: '',
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/class-record/class-record'), {
            data: sessionData,
        });
    } else {
        const sessionData = {
            uuid: req.session.user.uuid,
            type: req.session.user.type,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            email: req.session.user.email_or_social_media,
            country: req.session.user.country,
            state_or_province: req.session.user.state_or_province,
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/class-record/class-record'), {
            data: sessionData,
        });
    }
});



app.get(['/form-137-ui'], (req, res) => {
    if (req.session.user === undefined) {
        const sessionData = {
            uuid: '',
            type: '',
            first_name: '',
            last_name: '',
            email: '',
            country: '',
            state_or_province: '',
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/form-137/form-137'), {
            data: sessionData,
        });
    } else {
        const sessionData = {
            uuid: req.session.user.uuid,
            type: req.session.user.type,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            email: req.session.user.email_or_social_media,
            country: req.session.user.country,
            state_or_province: req.session.user.state_or_province,
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/form-137/form-137'), {
            data: sessionData,
        });
    }
});



app.get(['/students'], (req, res) => {
    if (req.session.user === undefined) {
        const sessionData = {
            uuid: '',
            type: '',
            first_name: '',
            last_name: '',
            email: '',
            country: '',
            state_or_province: '',
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/students/students'), {
            data: sessionData,
        });
    } else {
        const sessionData = {
            uuid: req.session.user.uuid,
            type: req.session.user.type,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            email: req.session.user.email_or_social_media,
            country: req.session.user.country,
            state_or_province: req.session.user.state_or_province,
            ourGenerateNonce: lodashNonce,
        };

        res.render(path.join(__dirname, '../../', 'public/view/students/students'), {
            data: sessionData,
        });
    }
});


const { readFileSync, writeFile } = require('fs');
const { check } = require('express-validator');


app.get(['/login'], (req, res) => {
    const sessionData = {
        ourGenerateNonce: lodashNonce,
    };

    res.render(path.join(__dirname, '../../', 'public/view/login/index'), {
        data: sessionData,
    });
});


app.get('/logout', async function (req, res, next) {
    try {
        const Users_accounts = db.users_accounts;
        const User_sessions = db.user_sessions;

        const userUuid = req.session.user ? ecdc.decryptUuid(req.session.user.uuid) : null;
        const phTimeValue = phTime();
        if (userUuid && phTimeValue) {
            console.log('Logging out user with UUID:', userUuid);
            console.log('Logging out phTimeValue:', phTimeValue);
            // Wait for updates to finish
            await Users_accounts.update(
                { login_status: null },
                { where: { uuid: userUuid } }
            );

            await User_sessions.update(
                { logout_at: phTimeValue },
                { where: { user_id: userUuid, logout_at: null } }
            );
        }

        // Destroy session
        req.session.destroy(err => {
            if (err) return next(err);

            req.session = null;
            res.redirect('/login');
        });

    } catch (err) {
        next(err);
    }
});



// not match any of page before, so 404 not found
// app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../../', 'public/view/404.html'));
// });

server.listen(port, null, () => {
    log.debug(
        `%c

	███████╗██╗ ██████╗ ███╗   ██╗      ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
	██╔════╝██║██╔════╝ ████╗  ██║      ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
	███████╗██║██║  ███╗██╔██╗ ██║█████╗███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
	╚════██║██║██║   ██║██║╚██╗██║╚════╝╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
	███████║██║╚██████╔╝██║ ╚████║      ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
	╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝      ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝ started...

	`,
        'font-family:monospace',
    );

    // server settings
    log.debug('settings', {
        server: host,
        api_key_secret: api_key_secret,
    });
});
