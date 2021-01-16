const Transaction = require('../models/transaction');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;
const Account = require('../models/account');
const User = require('../models/user');
const Customer = require('../models/customer');

const transfer = async (req, transaction, opts, session) => {

    let accountSource = undefined;
    let accountDest = undefined;

    if(req.body.type != 1){
        accountSource = await Account.findOneAndUpdate(req.meta.query.source, {
            $push: {transactions: transaction._id},
            $inc: {balance: ((-1) * req.body.amount)}
        }, opts);
        if(!accountSource || (req.meta.initialBalance.source != accountSource.balance + req.body.amount)){
            throw new Error('İşlem oluşturulamadı.')
        }
    }

    if(req.body.type != 2){

        accountDest = await Account.findOneAndUpdate(req.meta.query.dest, {
            $push: {transactions: transaction._id},
            $inc: {balance: req.body.amount}
        }, opts);
        if(!accountDest || (req.meta.initialBalance.dest != accountDest.balance - req.body.amount)){
            throw new Error('İşlem oluşturulamadı.')
        }
    }


 
    if(req.body.type == 10){
        const customer = await Customer.findOne({
            _id: req.meta.query.source.customer
        }).session(session);

        await customer.services.selled.push({
            service: req.body.serviceId,
            startDate: req.body.startDate,
            duration: req.body.duration
        });

        await customer.save();

        console.log(JSON.stringify(customer, null, 4));
    }

    if(req.body.type == 9){
        const customer = await Customer.findOne({
            _id: req.meta.query.source.customer
        }).session(session);

        await customer.services.bought.push({
            service: req.body.serviceId,
            startDate: req.body.startDate,
            duration: req.body.duration
        });

        await customer.save();

        console.log(JSON.stringify(customer, null, 4));
    }

}

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
            case 5:
                req.meta.query = {
                    dest: {
                        _id: req.params.destAccountId,
                        company: true
                    },
                    source: {
                        _id: req.params.sourceAccountId,
                        dealer: req.params.dealerId
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountDest){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountSource){
                    throw new Error('Bu kasa hesabı bayiye bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;
            case 6:
                req.meta.query = {
                    source: {
                        _id: req.params.sourceAccountId,
                        company: true
                    },
                    dest: {
                        _id: req.params.destAccountId,
                        dealer: req.params.dealerId
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountSource){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountDest){
                    throw new Error('Bu kasa hesabı bayiye bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;     
            case 7:
                req.meta.query = {
                    source: {
                        _id: req.params.sourceAccountId,
                        personal: req.params.personalId
                    },
                    dest: {
                        _id: req.params.destAccountId,
                        dealer: req.params.dealerId
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountDest){
                    throw new Error('Bu kasa hesabı bayiye bağlı değildir.')
                }
                if(!accountSource){
                    throw new Error('Bu kasa hesabı personele bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;
            case 8:
                req.meta.query = {
                    dest: {
                        _id: req.params.destAccountId,
                        personal: req.params.personalId
                    },
                    source: {
                        _id: req.params.sourceAccountId,
                        dealer: req.params.dealerId
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountSource){
                    throw new Error('Bu kasa hesabı bayiye bağlı değildir.')
                }
                if(!accountDest){
                    throw new Error('Bu kasa hesabı personele bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;   
            case 9:
                req.meta.query = {
                    dest: {
                        _id: req.params.sourceAccountId,
                        customer: req.params.customerId
                    },
                    source: {
                        _id: req.params.destAccountId,
                        company: true
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountDest){
                    throw new Error('Bu kasa hesabı müşteriye bağlı değildir.')
                }
                if(!accountSource){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;
            case 10:
                req.meta.query = {
                    source: {
                        _id: req.params.destAccountId,
                        customer: req.params.customerId
                    },
                    dest: {
                        _id: req.params.sourceAccountId,
                        company: true
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountSource){
                    throw new Error('Bu kasa hesabı müşteriye bağlı değildir.')
                }
                if(!accountDest){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;   
            case 11:
                req.meta.query = {
                    source: {
                        _id: req.params.sourceAccountId,
                        customer: req.params.customerId
                    },
                    dest: {
                        _id: req.params.destAccountId,
                        company: true
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountDest){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountSource){
                    throw new Error('Bu kasa hesabı müşteriye bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;
            case 12:
                req.meta.query = {
                    dest: {
                        _id: req.params.destAccountId,
                        customer: req.params.customerId
                    },
                    source: {
                        _id: req.params.sourceAccountId,
                        company: true
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountSource){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountDest){
                    throw new Error('Bu kasa hesabı müşteriye bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;   
            case 13:
                req.meta.query = {
                    source: {
                        _id: req.params.sourceAccountId,
                        customer: req.params.customerId
                    },
                    dest: {
                        _id: req.params.destAccountId,
                        company: true
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountDest){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountSource){
                    throw new Error('Bu kasa hesabı müşteriye bağlı değildir.')
                }
                req.meta.initialBalance.dest = accountDest.balance;
                req.meta.initialBalance.source = accountSource.balance;
                break;
            case 14:
                req.meta.query = {
                    dest: {
                        _id: req.params.destAccountId,
                        customer: req.params.customerId
                    },
                    source: {
                        _id: req.params.sourceAccountId,
                        company: true
                    }
                }
                accountDest = await Account.findOne(req.meta.query.dest);
                accountSource = await Account.findOne(req.meta.query.source);
                if(!accountSource){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                if(!accountDest){
                    throw new Error('Bu kasa hesabı müşteriye bağlı değildir.')
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

    const opts = { session, new: true };

    try {

        let [transaction] = await Transaction.create([req.body], opts);
        if(!transaction){
            throw new Error('İşlem oluşturulamadı.');
        }

        await transfer(req, transaction, opts, session);

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