const { server, listen } = require('./server/server');
const {mongoDb} = require('./server/database');

(async function main(){

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

