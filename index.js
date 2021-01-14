const app = require('./express');
const http = require('http');
const { getLocalExternalIP } = require('./utility/network');

const runServer = async (port) => http.Server(app).listen(port, async error => {
    if(error){
        throw new Error('[Server] ' + error.message);
    }

    if(!port){
        throw new Error('[Enviroment Exception] Port Number is required!')
    }
    
    console.log(`${process.env.name} app listening at http://${getLocalExternalIP()}:${port}`)

});


(async function main(){

   

    try {        
        const port =  process.env.PORT;
        await runServer(port);
    } catch (error) {
        console.error(error.message)
    }

})()

