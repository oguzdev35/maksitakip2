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
app.use(cors());

// Api Routing
app.use('/', require('./routes/admin'));
app.use('/', require('./routes/user')); 
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/company'));
app.use('/', require('./routes/personal.company'));
app.use('/', require('./routes/dealer.company'));
app.use('/', require('./routes/product'));
app.use('/', require('./routes/product_category'));
app.use('/', require('./routes/store'));
app.use('/', require('./routes/inventory'));
app.use('/', require('./routes/service'));
app.use('/', require('./routes/customer'));
app.use('/', require('./routes/account'));

app.get('/', (req, res) => {
    res.send('Maksitakip WEB API Services');
});



module.exports = app;