const Inventory = require('../models/inventory');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let inventory = await Inventory.create(req.body);

        return res.status(200).json(inventory.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let inventories = await Inventory.find({
            removed: false
        }).select('id name product store')
        .populate((
            [
                {
                    path: 'store',
                    select: '_id name'
                },
                {
                    path: 'product',
                    select: '_id name'
                }
            ]))

        return res.status(200).json(inventories);
        
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

        let inventory = undefined;

        if(req.method == 'GET'){
            inventory = await Inventory.findById(id)
                .populate(([
                        {
                            path: 'store',
                            select: '_id name'
                        },
                        {
                            path: 'product',
                            select: '_id name'
                        }
                    ]))
        } else {
            inventory = await Inventory.findById(id);
        }

        if(!inventory){
            return res.status(400).json({
                error: 'Envanter bulunamadı.'
            })
        }

        if(inventory.removed){
            return res.status(400).json({
                error: 'Envanter silinmiştir.'
            })
        }

        req.inventory = inventory;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.inventory.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let inventory = req.inventory

        inventory = extend(inventory,  inventory.filterForUpdate(req.body));

        await inventory.save();

        return res.status(200).json(inventory.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.inventory.putToTheBin();

        return res.status(200).json(req.inventory.filterProps());
        
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