const Transaction = require('../models/transaction');
const extend = require('lodash/extend');
const mongoose = require('../database').mongoDb;
const Account = require('../models/account');

const injectBodyProps = type => async (req, res, next) => {
    req.body = {
        ...req.body,
        type: type
    }

    let accountSource = undefined;
    let accountDest = undefined;
    try {

        switch (type) {
            case 1:
                req.body.source = null;
                req.body.dest = req.params.destAccountId
                accountDest = await Account.findOne({
                    _id: req.params.destAccountId,
                    company: true
                });
                if(!accountDest){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }
                break;
            case 2:
                req.body.source = req.params.sourceAccountId;
                req.body.dest = null

                accountSource = await Account.findOne({
                    _id: req.params.sourceAccountId,
                    company: true
                });
                if(!accountSource){
                    throw new Error('Bu kasa hesabı şirkete bağlı değildir.')
                }

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