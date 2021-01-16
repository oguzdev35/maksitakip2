const Account = require('../models/account');
const User = require('../models/user');
const Customer = require('../models/customer');
const Personal = require('../models/personal.company');
const Dealer = require('../models/dealer.company');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;

const injectAccountOwner = (operation) => (owner_type) => async (req, res, next) => {

    if(operation == 'create'){

        req.owner_type = owner_type;
        req.body = {
            ...req.body,
            company: req.owner_type == 'company' ? true : false,
            customer: req.customer?._id,
            personal: req.personal_company?._id,
            dealer: req.dealer_company?._id
        }

    }

    next();
}


const create = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    const opts = { session, new: true };

    try {
        let [account] = await Account.create([req.body], opts);
        switch (req.owner_type) {
            case 'company':
                await User.findOneAndUpdate({admin:true}, {$push: {accounts: account._id}}, opts);
                break;
            case 'customer':
                await Customer.findByIdAndUpdate( req.customer._id, {$push: {accounts: account._id}}, opts);
                break;
            case 'personal':
                await Personal.findByIdAndUpdate( req.personal._id, {$push: {accounts: account._id}}, opts);
                break;
            case 'dealer':
                await Dealer.findByIdAndUpdate( req.dealer._id, {$push: {accounts: account._id}}, opts);
                break;
            default:
                break;
        };

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(account.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
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
    list,
    view,
    findById,
    remove,
    edit,
    injectAccountOwner
}