const DealerCompany = require('../models/dealer.company');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let dealer_company = await DealerCompany.create(req.body);

        return res.status(200).json(dealer_company.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let dealer_companys = await DealerCompany.find({
            removed: false
        }).select('id name');

        return res.status(200).json(dealer_companys);
        
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

        let dealer_company = await DealerCompany.findById(id);

        if(!dealer_company){
            return res.status(400).json({
                error: 'Bayi bulunamadı.'
            })
        }

        if(dealer_company.removed){
            return res.status(400).json({
                error: 'Bayi silinmiştir.'
            })
        }

        req.dealer_company = dealer_company;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.dealer_company.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let dealer_company = req.dealer_company

        dealer_company = extend(dealer_company,  dealer_company.filterForUpdate(req.body));

        await dealer_company.save();

        return res.status(200).json(dealer_company.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.dealer_company.putToTheBin();

        return res.status(200).json(req.dealer_company.filterProps());
        
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