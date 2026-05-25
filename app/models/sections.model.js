module.exports = (sequelize, Sequelize) => {
    const Sections = sequelize.define('sections', {
        name: {
            type: Sequelize.STRING,
        },
        grade_level_id: {
            type: Sequelize.INTEGER,
        },
        school_year_id: {
            type: Sequelize.INTEGER,
        },
        adviser_teacher_id: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    }, { timestamps: true });

    return Sections;
};
