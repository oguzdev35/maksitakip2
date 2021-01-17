const {mongoDb} = require('./server/database');

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
        console.log('Database connection is closed.')
    }
};