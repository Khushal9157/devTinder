const authAdmin = (req, res, next) => {
    const token = "a";
    if (token === "a") {
        next();
    }
    else {
        res.status(401).send("Unauthorized request");
    }
};

const authUser = (req, res, next) => {
    const token = "a";
    if (token === "a") {
        next();
    }
    else {
        res.status(401).send("Unauthorized request");
    }
};

module.exports = {
    authAdmin, authUser
};