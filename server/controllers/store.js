const Store = require('../models/store');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let store = await Store.create(req.body);

        return res.status(200).json(store.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let stores = await Store.find({
            removed: false
        }).select('id name');

        return res.status(200).json(stores);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Depo ID numarası geçersizdir.'
        })
    }

    try {

        let store = await Store.findById(id);

        if(!store){
            return res.status(400).json({
                error: 'Depo bulunamadı.'
            })
        }

        if(store.removed){
            return res.status(400).json({
                error: 'Depo silinmiştir.'
            })
        }

        req.store = store;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.store.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let store = req.store

        store = extend(store,  store.filterForUpdate(req.body));

        await store.save();

        return res.status(200).json(store.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.store.putToTheBin();

        return res.status(200).json(req.store.filterProps());
        
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