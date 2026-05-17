module.exports = (sequelize, Sequelize) => {
    const GradeSnapshots = sequelize.define('grade_snapshots', {
        learner_school_record_id: {
            type: Sequelize.INTEGER,
        },
        quarter_id: {
            type: Sequelize.INTEGER,
        },
        teacher_id: {
            type: Sequelize.INTEGER,
        },
        learning_area_id: {
            type: Sequelize.INTEGER,
        },
        field: {
            type: Sequelize.STRING,
        },
        previous_value: {
            type: Sequelize.JSON,
        },
        updated_value: {
            type: Sequelize.JSON,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return GradeSnapshots;
};
