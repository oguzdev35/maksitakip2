const Service = require('../models/service');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let service = await Service.create(req.body);

        return res.status(200).json(service.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let services = await Service.find({
            removed: false
        }).select('id name');

        return res.status(200).json(services);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Servis ID numarası geçersizdir.'
        })
    }

    try {

        let service = await Service.findById(id);

        if(!service){
            return res.status(400).json({
                error: 'Serivs bulunamadı.'
            })
        }

        if(service.removed){
            return res.status(400).json({
                error: 'Servis silinmiştir.'
            })
        }

        req.service = service;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.service.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let service = req.service

        service = extend(service,  service.filterForUpdate(req.body));

        await service.save();

        return res.status(200).json(service.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.service.putToTheBin();

        return res.status(200).json(req.service.filterProps());
        
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