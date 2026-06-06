module.exports = (sequelize, Sequelize) => {
    const GradeLevels = sequelize.define('grade_levels', {
        name: {
            type: Sequelize.STRING,
        },
        code: {
            type: Sequelize.STRING,
        },
        order_sequence: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    }, { timestamps: true });

    return GradeLevels;
};
