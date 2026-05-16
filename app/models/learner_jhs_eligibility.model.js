module.exports = (sequelize, Sequelize) => {
    const LearnerJhsEligibility = sequelize.define('learner_jhs_eligibility', {
        learner_id: {
            type: Sequelize.INTEGER,
        },
        general_average: {
            type: Sequelize.DECIMAL(5, 2),
        },
        citation: {
            type: Sequelize.STRING,
        },
        elementary_school: {
            type: Sequelize.STRING,
        },
        school_id: {
            type: Sequelize.STRING,
        },
        school_address: {
            type: Sequelize.STRING,
        },
        pept_rating: {
            type: Sequelize.DECIMAL(5, 2),
        },
        als_rating: {
            type: Sequelize.DECIMAL(5, 2),
        },
        exam_date: {
            type: Sequelize.DATEONLY,
        },
        testing_center: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return LearnerJhsEligibility;
};
