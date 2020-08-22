const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const favicon = require("serve-favicon");

const blogsRoutes = require("./routes/blogs-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

require("dotenv").config();
require("./config/database");

app.use(logger("dev"));
app.use(express.json());

app.use(favicon(path.join(_dirname, "build", "favicon.ico")));
app.use(express.static(path.join(_dirname, "build")));


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








const port = process.env.PORT || 3001

app.listen(port, function () {
    console.log(`Express Train... CHOO!!! CHOO!!! ${port}`)
})