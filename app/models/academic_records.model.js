module.exports = (sequelize, Sequelize) => {
    const AcademicRecords = sequelize.define('academic_records', {
        learner_id: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return AcademicRecords;
};
