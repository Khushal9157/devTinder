const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/userAuth');

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
    try {
        const isValid = require("./utils/validators");

        isValid(req.body);

        const { firstName, lastName, emailID, password } = req.body;

        const passHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailID,
            password: passHash
        });

        await user.save();
        res.send("User added successfully!!!");
    }
    catch (err) {
        res.status(400).send("User not added " + err.message);
    }
});
app.post("/login", async (req, res) => {
    try {
        const { emailID, password } = req.body;

        if (!validator.isEmail(emailID)) {
            throw new Error("Invalid Credentials ");
        }

        const user = await User.findOne({ emailID });
        if (!user) {
            throw new Error("Invalid Credentials ");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = await jwt.sign({ id: user._id }, "dev@Tinder", {
                expiresIn: "1d"
            });
            res.cookie("token", token, {
                expires: new Date(Date.now() + 12 * 3600000)
            });
            res.send("Login successfully");
        }
        else {
            throw new Error("Invalid Credentials ");
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
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
