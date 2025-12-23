const jwt = require('jsonwebtoken');
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid token ");
        }
        const decoded = await jwt.verify(token, "dev@Tinder");

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error("User Not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }

};
module.exports = userAuth;