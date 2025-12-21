const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user');

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Virat",
        lastName: "Kohli",
        emailID: "2023ucp1678@mnit.ac.in",
        password: "Khush@123",
    }
    const user = new User(userObj);
    await user.save();
    res.send("User added successfully!!!");
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
