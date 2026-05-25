module.exports = (sequelize, Sequelize) => {
    const Users_accounts = sequelize.define('user_accounts', {
        email_address: {
            type: Sequelize.STRING,
        },
        contact_number: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        accountType: {
            type: Sequelize.TINYINT,
        },
        isVerified: {
            type: Sequelize.TINYINT,
        },
        isActive: {
            type: Sequelize.TINYINT,
        },
        verification_code: {
            type: Sequelize.STRING,
        },
        uuid: {
            type: Sequelize.STRING,
        },
    }, { timestamps: true });

    return Users_accounts;
};
