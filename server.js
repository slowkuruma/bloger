const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")


require("dotenv").config()
require("./config/database")


app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 3000

app.listen(port, function () {
    console.log("Express Train... CHOO!!! CHOO!!!")
})