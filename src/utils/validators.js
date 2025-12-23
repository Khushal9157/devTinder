const validator = require('validator');

const isValid = (user) => {
    if (!user.firstName || !user.lastName) {
        throw new Error("Enter a valid name ");
    }
    if (!validator.isStrongPassword(user.password)) {
        throw new Error("Enter a strong password");
    }
};

module.exports = isValid;