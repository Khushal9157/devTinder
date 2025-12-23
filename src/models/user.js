const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 40,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 40,
    },
    emailID: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Incorrect email ");
            }
        }
    },
    password: {
        type: String,
        validate(val) {
            if (!validator.isStrongPassword(val)) {
                throw new Error("Enter a strong password ");
            }
        }
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(val) {
            if (!["male", "female", "others"].includes(val)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "This is default about",
    },
    skills: {
        type: [String],
        validate(val) {
            if (val.length > 20) {
                throw new Error("Too many skills");
            }
        }
    },
    photoURL: {
        type: String,
        default: "https://e7.pngegg.com/pngimages/867/694/png-clipart-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue-text-thumbnail.png",
        validate(val) {
            if (!validator.isURL(val)) {
                throw new Error("Incorrect URL ");
            }
        }
    }
}, { timestamps: true }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ id: user._id }, "dev@Tinder", {
        expiresIn: "1d"
    });
    return token
}

userSchema.methods.isPasswordValid = async function (passwordInputByUser) {
    const user = this;
    const isMatch = await bcrypt.compare(passwordInputByUser, user.password);
    return isMatch;
}


module.exports = mongoose.model("User", userSchema);
