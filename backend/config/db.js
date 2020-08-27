const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://project3:steve123@cluster0.lj871.azure.mongodb.net/blogs?retryWrites=true&w=majority';


mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${connectionString}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connected error ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
