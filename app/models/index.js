const sequelizeConfig = require('../config/sequelize.config.js');

let Sequelize = sequelizeConfig.Sequelize;
let sequelize = sequelizeConfig.sequelize;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require('./users.model.js')(sequelize, Sequelize);
db.users_accounts = require('./user_accounts.model.js')(sequelize, Sequelize);
db.schools = require('./schools.model.js')(sequelize, Sequelize);
db.school_years = require('./school_years.model.js')(sequelize, Sequelize);
db.learners = require('./learners.model.js')(sequelize, Sequelize);
db.learner_jhs_eligibility = require('./learner_jhs_eligibility.model.js')(sequelize, Sequelize);
db.grade_levels = require('./grade_levels.model.js')(sequelize, Sequelize);
db.teachers = require('./teachers.model.js')(sequelize, Sequelize);
db.learning_areas = require('./learning_areas.model.js')(sequelize, Sequelize);
db.learner_school_records = require('./learner_school_records.model.js')(sequelize, Sequelize);
db.learner_grades = require('./learner_grades.model.js')(sequelize, Sequelize);
db.academic_records = require('./academic_records.model.js')(sequelize, Sequelize);
db.remedial_classes = require('./remedial_classes.model.js')(sequelize, Sequelize);
db.grade_snapshots = require('./grade_snapshots.model.js')(sequelize, Sequelize);

// Associations
db.learners.hasOne(db.learner_jhs_eligibility, { foreignKey: 'learner_id' });
// db.learners.hasMany(db.academic_records, { foreignKey: 'learner_id' });

db.learner_jhs_eligibility.belongsTo(db.learners, { foreignKey: 'learner_id' });

db.academic_records.belongsTo(db.learners, { foreignKey: 'learner_id' });
// db.academic_records.hasMany(db.learner_school_records, { foreignKey: 'academic_record_id' });
db.academic_records.belongsTo(db.schools, { foreignKey: 'school_id' });

// db.learner_school_records.belongsTo(db.academic_records, { foreignKey: 'academic_record_id' });
db.learner_school_records.belongsTo(db.school_years, { foreignKey: 'school_year_id' });
db.learner_school_records.belongsTo(db.grade_levels, { foreignKey: 'grade_level_id' });
db.learner_school_records.hasMany(db.learner_grades, { foreignKey: 'learner_school_record_id' });

db.learner_grades.belongsTo(db.learner_school_records, { foreignKey: 'learner_school_record_id' });
db.learner_grades.belongsTo(db.teachers, { foreignKey: 'teacher_id' });
db.learner_grades.belongsTo(db.learning_areas, { foreignKey: 'learning_area_id' });
db.learning_areas.hasMany(db.learner_grades, { foreignKey: 'learning_area_id' });

module.exports = db;
