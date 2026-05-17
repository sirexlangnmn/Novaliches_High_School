module.exports = (sequelize, Sequelize) => {
    const LearnerGrades = sequelize.define('learner_grades', {
        learner_school_record_id: {
            type: Sequelize.INTEGER,
        },
        quarter_id: {
            type: Sequelize.TINYINT,
        },
        teacher_id: {
            type: Sequelize.INTEGER,
        },
        learning_area_id: {
            type: Sequelize.INTEGER,
        },
        writtenScores: {
            type: Sequelize.JSON,
        },
        writtenTotal: {
            type: Sequelize.DECIMAL(5, 2),
        },
        writtenPS: {
            type: Sequelize.DECIMAL(5, 2),
        },
        writtenWS: {
            type: Sequelize.DECIMAL(5, 2),
        },
        performanceScores: {
            type: Sequelize.JSON,
        },
        performanceTotal: {
            type: Sequelize.DECIMAL(5, 2),
        },
        performancePS: {
            type: Sequelize.DECIMAL(5, 2),
        },
        performanceWS: {
            type: Sequelize.DECIMAL(5, 2),
        },
        examScores: {
            type: Sequelize.JSON,
        },
        examTotal: {
            type: Sequelize.DECIMAL(5, 2),
        },
        examPS: {
            type: Sequelize.DECIMAL(5, 2),
        },
        examWS: {
            type: Sequelize.DECIMAL(5, 2),
        },
        initialGrade: {
            type: Sequelize.DECIMAL(5, 2),
        },
        termGrade: {
            type: Sequelize.DECIMAL(5, 2),
        },
        descriptor: {
            type: Sequelize.STRING,
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
