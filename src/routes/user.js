const express = require('express');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userAuth = require('../middlewares/userAuth');

const USER_SAFE_DATA = "firstName lastName skills about age gender";
userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const recievedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({
            message: "Received connection requests",
            data: recievedRequests
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:
                [
                    { fromUserId: loggedInUser._id, status: "accepted" },
                    { toUserId: loggedInUser, status: "accepted" }
                ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            else {
                return row.fromUserId;
            }
        });
        res.json(data);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const requests = await ConnectionRequest.find({
            $or:
                [
                    { fromUserId: loggedInUser._id },
                    { toUserId: loggedInUser._id }
                ]
        }).select("fromUserId toUserId");

        const hideRequests = new Set();
        requests.forEach(r => {
            hideRequests.add(r.fromUserId);
            hideRequests.add(r.toUserId);
        });
        const users = await User.find({
            _id: { $nin: Array.from(hideRequests) }
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);
        res.json({ data: users });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = userRouter;