const express = require('express');
const app = express();

module.exports = () => {

    app.get('/', (req, res) => {
        res.send('Maksitakip WEB API Services');
    });

    return app;
}