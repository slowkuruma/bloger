const express = require("express");
const { check } = require("express-validator");
const blogsControllers = require("../controllers/blogs-controllers");


const router = express.Router();

router.get("/:tid", blogsControllers.getBlogById);

router.get("/user/:uid", blogsControllers.getBlogsByUserId);



router.post(
    "/",
    [check("title").not().isEmpty(), check("description").isLength({ min: 1 })],
    blogsControllers.createBlog
);

router.put(
    "/:tid",
    [check("title").not().isEmpty(), check("description").isLength({ min: 1 })],
    blogsControllers.updateBlog
);

router.delete("/:tid", blogsControllers.deleteBlog);

module.exports = router;