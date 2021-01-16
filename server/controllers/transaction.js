const Transaction = require('../models/transaction');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        return res.status(200).json('Hello');
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}


module.exports = {
    create
}