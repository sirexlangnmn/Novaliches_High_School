module.exports = (sequelize, Sequelize) => {
    const LearnerGrades = sequelize.define('learner_grades', {
        learner_school_record_id: {
            type: Sequelize.INTEGER,
        },
        learning_area_id: {
            type: Sequelize.INTEGER,
        },
        q1: {
            type: Sequelize.DECIMAL(5, 2),
        },
        q2: {
            type: Sequelize.DECIMAL(5, 2),
        },
        q3: {
            type: Sequelize.DECIMAL(5, 2),
        },
        q4: {
            type: Sequelize.DECIMAL(5, 2),
        },
        final_rating: {
            type: Sequelize.DECIMAL(5, 2),
        },
        remarks: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return LearnerGrades;
};
