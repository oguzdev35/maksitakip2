const Account = require('../models/account');
const User = require('../models/user');
const Customer = require('../models/customer');
const Personal = require('../models/personal.company');
const Dealer = require('../models/dealer.company');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const injectAccountOwner = (operation) => (owner_type) => async (req, res, next) => {

    console.log(req.personal_company)

    if(operation == 'create' || operation == 'list_by_owner'){

        req.owner_type = owner_type;
        req.body = {
            ...req.body,
            company: req.owner_type == 'company' ? true : false,
            customer: req.customer?._id,
            personal: req.personal_company?._id,
            dealer: req.dealer_company?._id
        }

    }

    if(operation == 'list_by_category'){
        req.owner_type = owner_type;
    }

    next();
}


const create = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    const opts = { session, new: true };

    try {
        let [account] = await Account.create([req.body], opts);
        if(!account){
            new Error('Hesap oluşturulamadı.')
        }
        switch (req.owner_type) {
            case 'company':
                const user = await User.findOneAndUpdate({admin: req.body.company}, {$push: {accounts: account._id}}, opts);
                if(!user){
                    new Error('Hesap oluşturulamadı.')
                }
                break;
            case 'customer':
                const customer = await Customer.findByIdAndUpdate( req.body.customer, {$push: {accounts: account._id}}, opts);
                if(!customer){
                    new Error('Hesap oluşturulamadı.')
                }
                break;
            case 'personal':
                const personal = await Personal.findByIdAndUpdate( req.body.personal, {$push: {accounts: account._id}}, opts);
                if(!personal){
                    new Error('Hesap oluşturulamadı.')
                }
                break;
            case 'dealer':
                const dealer = await Dealer.findByIdAndUpdate( req.body.dealer, {$push: {accounts: account._id}}, opts);
                if(!dealer){
                    new Error('Hesap oluşturulamadı.')
                }
                break;
            default:
                break;
        };

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(account.filterProps());
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
            error: error.message
        })
    }
}

const listAll = async (req, res) => {
    try {

        let accounts = await Account.find({
            removed: false
        }).select('id name');

        return res.status(200).json(accounts);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const listByCategory = async (req, res) => {
    try {

        let query = {};

        switch (req.owner_type) {
            case 'company':
                query = {company: true};
                break;
            case 'personal':
                query = {personal: {$exists: true}}
                break;
            case 'dealer':
                query = {dealer: {$exists: true}}
                break;
            case 'customer':
                query = {customer: {$exists: true}}
                break;
            default:
                break;
        }

        let accounts = await Account.find({
            removed: false,
            ...query
        }).select('id name');

        return res.status(200).json(accounts);
        
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const listByOwner = async (req, res) => {
    try {

        let query = {};

        switch (req.owner_type) {
            case 'personal':
                query = {personal: req.body.personal}
                break;
            case 'dealer':
                query = {dealer: req.body.dealer}
                break;
            case 'customer':
                query = {customer: req.body.customer}
                break;
            default:
                break;
        }

        let accounts = await Account.find({
            removed: false,
            ...query
        }).select('id name');

        return res.status(200).json(accounts);
        
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Hesap ID numarası geçersizdir.'
        })
    }

    try {

        let account = await Account.findById(id);

        if(!account){
            return res.status(400).json({
                error: 'Hesap bulunamadı.'
            })
        }

        if(account.removed){
            return res.status(400).json({
                error: 'Hesap silinmiştir.'
            })
        }

        req.account = account;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.account.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let account = req.account

        account = extend(account,  account.filterForUpdate(req.body));

        await account.save();

        return res.status(200).json(account.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.account.putToTheBin();

        return res.status(200).json(req.account.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    create,
    listAll,
    view,
    findById,
    remove,
    edit,
    injectAccountOwner,
    listByCategory,
    listByOwner
}