
// require statements
const mongoose = require('mongoose')

// database connection
const connectionString = 'mongodb://localhost/Blogggers';

mongoose.connect(process.env.MONGODB_URI || connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${connectionString}`))
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'))
mongoose.connection.on('error', (err) => console.log('Mongoose error', err))

