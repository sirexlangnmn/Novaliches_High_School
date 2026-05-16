module.exports = (sequelize, Sequelize) => {
    const Learners = sequelize.define('learners', {
        last_name: {
            type: Sequelize.STRING,
        },
        first_name: {
            type: Sequelize.STRING,
        },
        middle_name: {
            type: Sequelize.STRING,
        },
        name_extension: {
            type: Sequelize.STRING,
        },
        lrn: {
            type: Sequelize.STRING(12),
        },
        birthdate: {
            type: Sequelize.DATEONLY,
        },
        sex: {
            type: Sequelize.ENUM('Male', 'Female'),
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return Learners;
};
