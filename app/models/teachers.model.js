module.exports = (sequelize, Sequelize) => {
    const Teachers = sequelize.define('teachers', {
        employee_id: {
            type: Sequelize.STRING,
        },
        first_name: {
            type: Sequelize.STRING,
        },
        last_name: {
            type: Sequelize.STRING,
        },
        middle_name: {
            type: Sequelize.STRING,
        },
        user_account_id: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    }, { timestamps: true });

    return Teachers;
};
