const { server, listen } = require('./server');
const databases = require('./database');

(async function main(){

    let mongoDb = databases.mongoDb();

    try {        
        const port =  process.env.PORT;
        await listen(port);
        await mongoDb.connect();
        process.on('SIGINT', () => {
            console.info('SIGINT signal received: closing HTTP server')
            server.close(() => {
                console.info('HTTP server closed.')
            });
        });
    } catch (error) {
        await mongoDb.close();
        server && server.close(() => {
            console.info('HTTP server closed.')
        });
        console.error(error.message)
    }
    
})()

