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
        res.status(404).send("Errors");
        console.error("Error");
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
