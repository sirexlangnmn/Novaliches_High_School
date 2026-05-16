const db = require('../models');
const ecdc = require('../shared/ecdc.js');
const sequelizeConfig = require('../config/sequelize.config.js');

const Learning_areas = db.learning_areas;


exports.all = async (req, res) => {
    try {
        const areas = await Learning_areas.findAll({
            where: { status: 1 },
            attributes: ['id', 'name', 'code'],
        });
        res.send(areas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};