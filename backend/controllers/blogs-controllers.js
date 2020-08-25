const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");

const getBlogById = async (req, res, next) => {
    const blogId = req.params.bid;
    let blog;

    try {
        blog = await Blog.findById(blogId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong. Could not find blog",
            500
        );
        return next(error);
    }

    if (!blog) {
        const error = new HttpError(
            "Could not find a blog for the provided id",
            404
        );
        return next(error);
    }

    res.json({ blog: blog.toObject({ getters: true }) });
};

const getBlogsByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithBlogs;

    try {
        userWithBlogs = await User.findById(userId).populate("blogs");
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

const createBlog = async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input passed", 422));
    }
    const { title, description, creator } = req.body;
    const createdBlog = new Blog({
        title,
        description,
        creator,
    });

    let user;

    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError("Creating blog failed, try again later", 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError("Could not find user for provided id", 404);
        return next(error);
    }

    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdBlog.save({ session: sess });
        user.blogs.push(createdBlog);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Could not create blog failed, please try again.",
            500
        );
        return next(error);
    }

    res.status(201).json({ blog: createdBlog });
};

const updateBlog = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input passed", 422));
    }

    const { title, description } = req.body;
    const blogId = req.params.bid;

    let blog;
    try {
        blog = await Blog.findById(blogId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update blog",
            500
        );
        return next(error);
    }

    if (blog.creator.toString() !== req.userData.userId) {
        const error = new HttpError("You are not allowed to edit this blog", 401);
        return next(error);
    }

    blog.title = title;
    blog.description = description;

    try {
        await blog.save();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not update blog",
            500
        );
        return next(error);
    }

    res.status(200).json({ blog: blog.toObject({ getters: true }) });
};

const deleteBlog = async (req, res, next) => {
    const blogId = req.params.bid;
    let blog;
    try {
        blog = await Blog.findById(blogId).populate("creator");
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete blog",
            500
        );
        return next(error);
    }

    if (!blog) {
        const error = new HttpError("Could not find blog for this id", 404);
        return next(error);
    }

    if (blog.creator.id !== req.userData.userId) {
        const error = new HttpError(
            "You are not allowed to delete this blog",
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await blog.remove({ session: sess });
        blog.creator.blogs.pull(blog);
        await blog.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not delete blog",
            500
        );
        return next(error);
    }
    res.status(200).json({ message: "Deleted" });
};

exports.getBlogById = getBlogById;
exports.getBlogsByUserId = getBlogsByUserId;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
