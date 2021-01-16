const Transaction = require('../models/transaction');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const injectBodyProps = type => (req, res, next) => {
    req.body = {
        ...req.body,
        type: type
    }
    switch (type) {
        case 1:
            req.body.source = null;
            req.body.dest = req.params.destAccountId
            break;
        case 2:
            req.body.source = req.params.sourceAccountId;
            req.body.dest = null
            break;  
        default:
            break;
    }
    next();
}

const create = async (req, res) => {
    try {

        return res.status(200).json(req.body);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}


module.exports = {
    create,
    injectBodyProps
}