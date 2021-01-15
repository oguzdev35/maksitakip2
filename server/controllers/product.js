const Product = require('../models/product');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let product = await Product.create(req.body);

        return res.status(200).json(product.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let products = await Product.find({
            removed: false
        }).select('id name categories')
        .populate(({
            path: 'categories',
            select: '_id name',
            options: {sort: {createdAt: -1}}
        }))

        return res.status(200).json(products);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Ürün ID numarası geçersizdir.'
        })
    }

    try {

        let product = undefined;

        if(req.method == 'GET'){
            product = await Product.findById(id)
                .populate(({
                    path: 'categories',
                    select: '_id name',
                    options: {sort: {createdAt: -1}}
                }));
        } else {
            product = await Product.findById(id);
        }

        if(!product){
            return res.status(400).json({
                error: 'Ürün bulunamadı.'
            })
        }

        if(product.removed){
            return res.status(400).json({
                error: 'Ürün silinmiştir.'
            })
        }

        req.product = product;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.product.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let product = req.product;

        product = extend(product,  product.filterForUpdate(req.body));

        await product.save();

        return res.status(200).json(product.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.product.putToTheBin();

        return res.status(200).json(req.product.filterProps());
        
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