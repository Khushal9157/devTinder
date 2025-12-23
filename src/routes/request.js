const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const userAuth = require('../middlewares/userAuth');
const User = require('../models/user');
const { Connection } = require('mongoose');

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const userId = req.params.userId;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status ");
        }

        const toUser = await User.findById(userId);
        if (!toUser) {
            throw new Error("User does not exist");
        }
        const fromUserId = req.user._id;
        const toUserId = toUser._id;
        const oldRequest = await ConnectionRequest.findOne({
            $or:
                [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
        });

        if (oldRequest) {
            throw new Error("Request already exists ");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await connectionRequest.save();
        res.json({
            message: `${req.user.firstName} ${status} ${toUser.firstName}`,
            data: connectionRequest
        })

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

requestRouter.post('/request/review/:status/:id', userAuth, async (req, res) => {
    try {
        const { status, id } = req.params;
        const statusAllowed = ["accepted", "rejected"];
        if (!statusAllowed.includes(status)) {
            return res.status(400).send("status not allowed");
        }
        const fromUserId = id;
        const toUserId = req.user._id;
        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId,
            toUserId,
            status: "interested"
        });
        if (!connectionRequest) {
            throw new Error("No request to accept or reject with this person");
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.send("Request status updated successfully!!");
    } catch (err) {
        res.status(400).send("Heyy Error : " + err.message);
    }
});

module.exports = requestRouter;