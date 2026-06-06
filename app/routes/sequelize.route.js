module.exports = (app) => {
    const { check, validationResult } = require('express-validator');

    const controllers = require('../controllers');
    const middleware = require('../middleware');

    const usersAccountsController = controllers.users_accounts;


    app.get(['/api/v2/get/number-of-visitor-members'], usersAccountsController.numberOfVisitorMembers);
    app.get(['/api/v2/get/traders-data'], usersAccountsController.tradersData);
    app.post(['/api/v2/post/check-if-trader-is-active'], usersAccountsController.checkIfTraderIsActive);

};
