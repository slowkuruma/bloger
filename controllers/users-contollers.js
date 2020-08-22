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

    res.json({ users: users.map(user) => user.toObject({ getters: true }) });
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


}