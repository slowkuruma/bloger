const express = require("express")
const app = express()
const path = require("path")


require("dotenv").config()
require("./config/database")


app.use(express.urlencoded({ extended: false }))

const port = 3000

app.listen(port, function () {
    console.log("Express Train... CHOO!!! CHOO!!! Port ${ port }")
})