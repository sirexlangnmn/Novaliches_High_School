module.exports = (sequelize, Sequelize) => {
    const LearnerSchoolRecords = sequelize.define('learner_school_records', {
        school_id: {
            type: Sequelize.INTEGER,
        },
        school_year_id: {
            type: Sequelize.INTEGER,
        },
        learner_id: {
            type: Sequelize.INTEGER,
        },
        grade_level_id: {
            type: Sequelize.TINYINT,
        },
        section_id: {
            type: Sequelize.TINYINT,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    }, { timestamps: true });

    return LearnerSchoolRecords;
};
