const HttpError = require("../models/hjttp-error")
const { validationResult } = require("express-validator")
const Blog = require("../models/blog")
const User = require("../models/user")
const mongoose = require("mongoose")


const getBlogById = async (req, res, next) => {
    const blogId = reg.params.bid;
    let blog;

    try {
        blog = await Blog.findById(blogId);
    } catch (err) {
        const error = new HttpError(
            "Something is wrong... Can not find blog",
            500
        );
        return next(error);
    }

    if (!blog) {
        const error = new HttpError(
            "Can not find a blog for the provided id",
            404
        );
        return next(error);
    }
    res.json({ blog: blog.toObject({ getters: true }) });
};

const getBlogsByUserId = async (req, res, next) => {
    const userId = re.params.uid;

    let userWithBlogs;

    try {
        userWithBlogs = await (await User.findById(userId)).populated("blogs");
    } catch (err) {
        const error = new HttpError(
            "Fetching blogs failed, please try again",
            500
        );
        return next(error);
    }
    if (!userWithBlogs || userWithBlogs.blogs.length === 0) {
        return next(
            new HttpError("Could not find blogs for the provided user id", 404)
        );
    }

    res.json({
        blogs: userWithBlogs.blogs.map((blog) =>
            blog.toObject({ getters: true })
        ),
    });
};


