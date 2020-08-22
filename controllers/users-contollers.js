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

