const Transaction = require('../models/transaction');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;
const Account = require('../models/account');

const injectBodyProps = type => async (req, res, next) => {
    req.body = {
        ...req.body,
        type: type,
        source: req.params.sourceAccountId,
        dest: req.params.destAccountId
    }

    req.meta = {
        query: {dest: undefined, source: undefined},
        initialBalance: {dest: undefined, source: undefined}
    }

    let accountSource = undefined;
    let accountDest = undefined;
    try {

        switch (type) {
            case 1:
                req.meta.query.dest = {
                    _id: req.params.destAccountId,
                    company: true
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                if(!accountDest){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                break;
            case 2:

                req.meta.query.source = {
                    _id: req.params.sourceAccountId,
                    company: true
                }

                accountSource = await Account.findOne(req.meta.query.source);

                if(!accountSource){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                req.meta.initialBalance.source = accountSource.balance;
                break;
            case 3:
                req.meta.query = {
                    dest: {
                        _id: req.params.destAccountId,
                        company: true
                    },
                    source: {
                        _id: req.params.sourceAccountId,
                        personal: req.params.personalId
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountDest){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountSource){
                    throw new Error('Bu kasa hesabı personele bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;
            case 4:
                req.meta.query = {
                    source: {
                        _id: req.params.sourceAccountId,
                        company: true
                    },
                    dest: {
                        _id: req.params.destAccountId,
                        personal: req.params.personalId
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountSource){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountDest){
                    throw new Error('Bu kasa hesabı personele bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;    
            default:
                break;
        }
        next();
        
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const create = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    let accountSource = undefined;
    let accountDest = undefined;

    const opts = { session, new: true };

    try {

        let [transaction] = await Transaction.create([req.body], opts);
        if(!transaction){
            throw new Error('İşlem oluşturulamadı.');
        }

        switch (req.body.type) {
            case 1:
                accountDest = await Account.findOneAndUpdate(req.meta.query.dest, {
                    $push: {transactions: transaction._id},
                    $inc: {balance: req.body.amount}
                }, opts);
                if(!accountDest || (req.meta.initialBalance.dest != accountDest.balance - req.body.amount)){
                    throw new Error('İşlem oluşturulamadı.')
                }
                break;
            case 2:
                accountSource = await Account.findOneAndUpdate(req.meta.query.source, {
                    $push: {transactions: transaction._id},
                    $inc: {balance: ((-1) * req.body.amount)}
                }, opts);
                if(!accountSource || (req.meta.initialBalance.source != accountSource.balance + req.body.amount)){
                    throw new Error('İşlem oluşturulamadı.')
                }
                break;

            case 3:
                accountSource = await Account.findOneAndUpdate(req.meta.query.source, {
                    $push: {transactions: transaction._id},
                    $inc: {balance: ((-1) * req.body.amount)}
                }, opts);
                if(!accountSource || (req.meta.initialBalance.source != accountSource.balance + req.body.amount)){
                    throw new Error('İşlem oluşturulamadı.')
                }
                accountDest = await Account.findOneAndUpdate(req.meta.query.dest, {
                    $push: {transactions: transaction._id},
                    $inc: {balance: req.body.amount}
                }, opts);
                if(!accountDest || (req.meta.initialBalance.dest != accountDest.balance - req.body.amount)){
                    throw new Error('İşlem oluşturulamadı.')
                }
                break;
            case 4:
                accountSource = await Account.findOneAndUpdate(req.meta.query.source, {
                    $push: {transactions: transaction._id},
                    $inc: {balance: ((-1) * req.body.amount)}
                }, opts);
                if(!accountSource || (req.meta.initialBalance.source != accountSource.balance + req.body.amount)){
                    throw new Error('İşlem oluşturulamadı.')
                }
                accountDest = await Account.findOneAndUpdate(req.meta.query.dest, {
                    $push: {transactions: transaction._id},
                    $inc: {balance: req.body.amount}
                }, opts);
                if(!accountDest || (req.meta.initialBalance.dest != accountDest.balance - req.body.amount)){
                    throw new Error('İşlem oluşturulamadı.')
                }
                break;
            
            default:
                break;
        };

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(transaction);
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
            error: error.message
        })
    }
}


module.exports = {
    create,
    injectBodyProps
}