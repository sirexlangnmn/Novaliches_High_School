module.exports = (sequelize, Sequelize) => {
    const Schools = sequelize.define('schools', {
        school_name: {
            type: Sequelize.STRING,
        },
        school_code: {
            type: Sequelize.STRING,
        },
        district: {
            type: Sequelize.STRING,
        },
        division: {
            type: Sequelize.STRING,
        },
        region: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        school_type: {
            type: Sequelize.STRING,
        },
        principal_name: {
            type: Sequelize.STRING,
        },
        school_head_name: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    }, { timestamps: true });

    return Schools;
};
