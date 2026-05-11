const sequelizeConfig = require('../config/sequelize.config.js');

let Sequelize = sequelizeConfig.Sequelize;
let sequelize = sequelizeConfig.sequelize;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require('./users.model.js')(sequelize, Sequelize);
db.users_accounts = require('./user_accounts.model.js')(sequelize, Sequelize);
// db.user_sessions = require('./user_sessions.model.js')(sequelize, Sequelize);
// db.reset_tokens = require('./reset_tokens.model.js')(sequelize, Sequelize);
// db.user_download_histories = require('./user_download_histories.model.js')(sequelize, Sequelize);


module.exports = db;
