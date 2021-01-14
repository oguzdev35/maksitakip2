const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const app = express();

app.use(morgan('common'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(compression());
app.use(cors())


app.get('/', (req, res) => {
    res.send('Maksitakip WEB API Services');
});

module.exports = app;