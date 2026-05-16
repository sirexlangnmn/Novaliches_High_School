const controller = {};

controller.users_accounts = require('./users-accounts.controller.js');
controller.registration_v2 = require('./registration_v2.controller.js');
controller.class_records = require('./class_records.controller.js');
controller.learning_areas = require('./learning_areas.controller.js');

module.exports = controller;
