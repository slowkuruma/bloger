const express = require("express");
const { check } = require("express-validator");
const blogsControllers = require("../controllers/blogs-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:bid", blogsControllers.getBlogById);

router.get("/user/:uid", blogsControllers.getBlogsByUserId);

router.use(checkAuth);

router.post(
    "/",
    [check("title").not().isEmpty(), check("description").isLength({ min: 1 })],
    blogsControllers.createBlog
);

router.put(
    "/:bid",
    [check("title").not().isEmpty(), check("description").isLength({ min: 1 })],
    blogsControllers.updateBlog
);

router.delete("/:bid", blogsControllers.deleteBlog);

module.exports = router;
