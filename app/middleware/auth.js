const db = require('../models');
const ecdc = require('../shared/ecdc');

module.exports = async (req, res, next) => {
    try {
        if (!req.session.user || !req.session.user.uuid) {
            return res.status(401).send({ message: 'Unauthorized. Please login first.' });
        }

        const decryptedUuid = ecdc.decryptUuid(req.session.user.uuid);
        if (!decryptedUuid) {
            return res.status(401).send({ message: 'Invalid session. Please login again.' });
        }

        const userAccount = await db.user_accounts.findOne({
            where: { uuid: decryptedUuid },
            attributes: ['id', 'email_address', 'accountType'],
        });

        if (!userAccount) {
            return res.status(401).send({ message: 'Account not found. Please login again.' });
        }

        req.user = {
            user_account_id: userAccount.id,
            email: userAccount.email_address,
            accountType: userAccount.accountType,
        };

        next();
    } catch (error) {
        res.status(500).send({ message: 'Authentication error: ' + error.message });
    }
};
