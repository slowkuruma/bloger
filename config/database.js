const mongoose = require("mongoose");

const connectionString = "mongodb://localhost/Blogggers"

mongoose.connect(process.env.DATABASE_URL || connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${connectionString}`))
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'))
mongoose.connection.on('error', (err) => console.log('Mongoose error', err))