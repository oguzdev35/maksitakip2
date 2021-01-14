const app = require('./express');
const http = require('http');
const { getLocalExternalIP } = require('./utility/network');
const databases = require('./database');



const runServer = async (port) => {

    const server = http.Server(app);

    server.listen(port, async error => {
        if(error){
            throw new Error('[Server] ' + error.message);
        }
    
        if(!port){
            throw new Error('[Enviroment Exception] Port Number is required!')
        }
        
        console.log(`${process.env.name} app listening at http://${getLocalExternalIP()}:${port}`)
    
    });

    return server;

}

(async function main(){

    let server = undefined;
    let mongoDb = databases.mongoDb();

    try {        
        const port =  process.env.PORT;
        const server = await runServer(port);

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

