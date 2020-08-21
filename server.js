const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")

const blogsRoutes = require("./routes/blogs-routes")
const usersRoutes = require("./routes/users-routes")

require("dotenv").config()
require("./config/database")


app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))






app.use("/blogs", blogsRoutes);
app.use("/users", usersRoutes);




const port = process.env.PORT || 3001

app.listen(port, function () {
    console.log(`Express Train... CHOO!!! CHOO!!! ${port}`)
})