module.exports = (sequelize, Sequelize) => {
    const LearningAreas = sequelize.define('learning_areas', {
        name: {
            type: Sequelize.STRING,
        },
        code: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    }, { timestamps: true });

    return LearningAreas;
};
