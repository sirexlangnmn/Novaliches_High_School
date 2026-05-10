module.exports = (app) => {
    // no longer used
    //const traderRegistrationValidation = require('../middleware/trader-registration-validation.js');

    // no longer used
    // const session = require('express-session');
    // app.use(
    //     session({
    //         secret: process.env.SESSION_SECRET,
    //         resave: false,
    //         saveUninitialized: true,
    //         cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
    //     }),
    // );

    const middleware = require('../middleware');


    // const users = require('../controllers/users.controller.js');

    // app.post(['/api/get/user'], users.find);

};
