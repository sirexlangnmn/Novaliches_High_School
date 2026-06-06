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


    const learningAreas = require('../controllers/learning_areas.controller.js');
    const classRecord = require('../controllers/class_records.controller.js');
    const form137 = require('../controllers/form-137.controller.js');

    app.post(['/api/get/learning-areas/all'], learningAreas.all);
    app.post(['/api/get/my-classes'], classRecord.getMyClasses);
    app.post(['/api/get/class-records/by-learning-area'], classRecord.getByLearningArea);
    app.post(['/api/save/class-record/grade-change'], classRecord.saveGradeChange);
    app.post(['/api/get/student/form-137-data'], form137.getForm137Data);

};
