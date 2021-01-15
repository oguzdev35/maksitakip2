const Customer = require('../models/customer');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let customer = await Customer.create(req.body);

        return res.status(200).json(customer.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let customers = await Customer.find({
            removed: false
        }).select('id name');

        return res.status(200).json(customers);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Müşteri ID numarası geçersizdir.'
        })
    }

    try {

        let customer = await Customer.findById(id);

        if(!customer){
            return res.status(400).json({
                error: 'Müşteri bulunamadı.'
            })
        }

        if(customer.removed){
            return res.status(400).json({
                error: 'Müşteri silinmiştir.'
            })
        }

        req.customer = customer;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.customer.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let customer = req.customer

        customer = extend(customer,  customer.filterForUpdate(req.body));

        await customer.save();

        return res.status(200).json(customer.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.customer.putToTheBin();

        return res.status(200).json(req.customer.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    create,
    list,
    view,
    findById,
    remove,
    edit
}