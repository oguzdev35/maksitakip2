const app = require('./express');
const http = require('http');
const { getLocalExternalIP } = require('./utility/network');

const server = http.Server(app);

const listen = async (port) => await server.listen(port, async error => {
    if(error){
        throw new Error('[Server] ' + error.message);
    }

    if(!port){
        throw new Error('[Enviroment Exception] Port Number is required!')
    }
    
    console.log(`${process.env.name} app listening at http://${getLocalExternalIP()}:${port}`)

});

module.exports = {
    server, listen
}