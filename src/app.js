const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user');

app.use(express.json());
app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully!!!");
    }
    catch (err) {
        res.status(400).send("User not added " + err.message);
    }
});
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({});
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }

});
app.patch("/user/:userId", async (req, res) => {
    const data = req.body;
    try {
        const updatesAllowed = ["gender", "photoURL", "skills", "about"];

        if (!data.every((k) => updatesAllowed.includes(k))) {
            throw new Error("Update not allowed");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        res.send(updatedUser);
    }
    catch (err) {
        res.status(400).send("Something went wrong" + err.message);
    }

});

connectDB().
    then(() => {
        console.log("DB connected successfully");
        app.listen(7777, () => {
            console.log("Listening to port 7777...");
        });
    }).
    catch((err) => {
        console.error("DB connection failed");
    });
