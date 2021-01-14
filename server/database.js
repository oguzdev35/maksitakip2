const InitializeMongoDb = () => {

    const { MongoClient } = require("mongodb");
    // Connection URI
    const uri = process.env.MONGODB_CONN_URI;
    // Create a new MongoClient
    const client = new MongoClient(uri, {
        useUnifiedTopology: true
    });

    const connect = async () => {
        await client.connect();

        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("[MongoDB] Connected to the database server successfully.");

        global.db = client.db(process.env.MONGODB_DB_NAME);
        global.db.users = global.db.collection('user');
    }

    const close = async () => {
        console.log("[MongoDB] Database connection is gracefully closed.");
        return await client.close();
    }

    return {
        client,
        connect,
        close
    }

};

const mongoDb = InitializeMongoDb();


module.exports = {
    mongoDb
}