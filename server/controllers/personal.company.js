const PersonalCompany = require('../models/personal.company');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let personal_company = await PersonalCompany.create(req.body);

        return res.status(200).json(personal_company.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let personal_companys = await PersonalCompany.find({
            removed: false
        }).select('id name');

        return res.status(200).json(personal_companys);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Personal ID numarası geçersizdir.'
        })
    }

    try {

        let personal_company = await PersonalCompany.findById(id);

        if(!personal_company){
            return res.status(400).json({
                error: 'Personel bulunamadı.'
            })
        }

        if(personal_company.removed){
            return res.status(400).json({
                error: 'Personel silinmiştir.'
            })
        }

        req.personal_company = personal_company;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.personal_company.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let personal_company = req.personal_company

        personal_company = extend(personal_company,  personal_company.filterForUpdate(req.body));

        await personal_company.save();

        return res.status(200).json(personal_company.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.personal_company.putToTheBin();

        return res.status(200).json(req.personal_company.filterProps());
        
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