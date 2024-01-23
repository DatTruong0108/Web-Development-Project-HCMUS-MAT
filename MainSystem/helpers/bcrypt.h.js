const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;

async function hashPassword(password) {
    const passwordHashed = await bcrypt.hash(password, saltRounds);
    return passwordHashed;
}

async function check(password, passwordHashed) {
    const result = await bcrypt.compare(password, passwordHashed);
    return result;
}

module.exports = { hashPassword, check };

