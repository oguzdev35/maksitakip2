const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Maksitakip WEB API Services');
});

module.exports = app;