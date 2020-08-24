const express = require("express");
const path = require("path");
const logger = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

const blogsRoutes = require("./routes/blogs-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const app = express();


require("dotenv").config();
require("./config/database");

app.use(logger("dev"));
app.use(express.json());

app.use(favicon(path.join(_dirname, "build", "favicon.ico")));
app.use(express.static(path.join(_dirname, "build")));

app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requessted-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

app.use("api/blogs", blogsRoutes);
app.use("api/users", usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error has occured" });
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(_dirname, "build", "index.html"));
});


const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log(`Express Train... CHOO!!! CHOO!!! ${port}`);
});







