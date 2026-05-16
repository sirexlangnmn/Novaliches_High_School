module.exports = (sequelize, Sequelize) => {
    const SchoolYears = sequelize.define('school_years', {
        year: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return SchoolYears;
};
