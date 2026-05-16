module.exports = (sequelize, Sequelize) => {
    const LearnerSchoolRecords = sequelize.define('learner_school_records', {
        academic_record_id: {
            type: Sequelize.INTEGER,
        },
        school_year_id: {
            type: Sequelize.INTEGER,
        },
        quarter: {
            type: Sequelize.TINYINT,
        },
        grade_level_id: {
            type: Sequelize.INTEGER,
        },
        section: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return LearnerSchoolRecords;
};
