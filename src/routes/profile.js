const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/userAuth');
const updatesAllowed = require('../utils/updatesAllowed');


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!updatesAllowed(req.body)) {
            throw new Error("Invalid Edit request");
        }
        const loggedInUser = req.user;

        for (const k of Object.keys(req.body)) {
            loggedInUser[k] = req.body[k];
        }
        await loggedInUser.save();
        res.json({
            "message": `${loggedInUser.firstName}, your profile updated successfully !!!`,
            "data": loggedInUser
        })

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = profileRouter;