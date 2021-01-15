const ProductCategory = require('../models/product_category');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let product_category = await ProductCategory.create(req.body);

        return res.status(200).json(product_category.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let product_categories = await ProductCategory.find({
            removed: false
        }).select('id name');

        return res.status(200).json(product_categories);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Ürün Kategori ID numarası geçersizdir.'
        })
    }

    try {

        let product_category = await ProductCategory.findById(id);

        if(!product_category){
            return res.status(400).json({
                error: 'Ürün Kategorisi bulunamadı.'
            })
        }

        if(product_category.removed){
            return res.status(400).json({
                error: 'Ürün Kategorisi silinmiştir.'
            })
        }

        req.product_category = product_category;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.product_category.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let product_category = req.product_category

        product_category = extend(product_category,  product_category.filterForUpdate(req.body));

        await product_category.save();

        return res.status(200).json(product_category.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.product_category.putToTheBin();

        return res.status(200).json(req.product_category.filterProps());
        
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