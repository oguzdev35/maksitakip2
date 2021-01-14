const express = require('express');
const { getLocalExternalIP } = require('./utility/network');

const app = express();

module.exports = (port) => {

    if(!port){
        throw new Error('[Enviroment Exception] Port Number is required!')
    }

    app.get('/', (req, res) => {
        res.send('Maksitakip WEB API Services');
    });

    app.listen(port, () => {
        console.log(`${process.env.name} app listening at http://${getLocalExternalIP()}:${port}`)
    });

    
}