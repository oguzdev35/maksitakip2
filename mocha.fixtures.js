const {mongoDb} = require('./server/database');
const redis = require('./test/utility/redis'); 

module.exports = {
    mochaGlobalSetup: async function() {
        console.log('Global Setup Initialized.');
        await mongoDb.connect(process.env.MONGODB_CONN_URI);
        console.log('Database connection is established.');
    },
    mochaGlobalTeardown: async function() {
        console.log('Global Teardown initialized.');
        await mongoDb.connection.db.dropDatabase();
        console.log('Database dropped.');
        await mongoDb.disconnect();
        console.log('MongoDb connection is closed.')
        await redis.disconnect();
        console.log('Redis connection is closed.')
    }
};