const initializeMongoose = () => {
    const mongoose = require('mongoose');

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.Promise = global.Promise;

    mongoose.connection.on("error", () => {
        throw new Error(`unable to connect to database: ${process.env.MONGODB_CONN_URI}`)
    });
    
    mongoose.connection.on("open", () => {
        console.info(`MongoDb client connected to ${process.env.MONGODB_CONN_URI}`)
    })

    return mongoose;

}

const mongoDb = initializeMongoose();


module.exports = {
    mongoDb
}