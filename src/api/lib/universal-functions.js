const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {

    compareBcryptPassword: async (password, dbPassword) => {
        return bcrypt.compareSync(password, dbPassword);
    },

    encryptData: async (keyword) => {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(keyword, salt);
        return hash;
    },

    generate_otp: async () => {
        try {
            return Math.floor(1000 + Math.random() * 9000);
        } catch (err) {
            throw err;
        }
    },

}