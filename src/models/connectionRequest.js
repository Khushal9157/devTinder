const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "accepted", "interested", "rejected"],
            message: "Incorrect status type "
        }
    }
}, {
    timestamps: true
});

connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true }
);


connectionRequestSchema.pre("save", function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send request to yourself");
    }
});


const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;