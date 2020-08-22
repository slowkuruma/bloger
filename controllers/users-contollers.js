const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-passowrd");
    } catch (err) {
        const error = new HttpError("Fetching users failed, try again later", 500);
        return next(error);
    }

    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//signup 

const signup = async (req, res, next) => {
    const errors = validationResult(reg);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input, please check your data", 422));
    }
    const { name, email, password } = reg.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Signup failed. Please try again later", 500);
        return next(error)
    }

    if (existingUser) {
        const error = new HttpError(
            "User exists already, please login instead",
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12); //12 is num of salt rounds
    } catch (err) {
        const error = new HttpError("Could not create user. Please try again", 500);
        return next(error);
    }

    const createdUser = new user({
        name,
        email,
        image: "https://www.creativefreedom.co.uk/wp-content/uploads/2017/06/Twitter-featured.png",
        password: hashedPassword,
        blogs: [],

    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError("Signup failed, please try again", 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            "supersecret",
            { expiresIn: "1h" }
        );
    } catch (err) {
        const error = new HttpError("Signup failed, please try again", 500);
        return next(error);
    }
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};


