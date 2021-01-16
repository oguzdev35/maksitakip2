const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

/**
 * transfer: {
 *      1: transfer Money from external to Company
 *      2: transfer Money from Company from external
 *      3: transfer Money from Personal to Company
 *      4: transfer Money from Company from Personal
 *      5: transfer Money from Dealer to Company
 *      6: transfer Money from Company from Dealer
 *      7: transfer Money from Dealer to Personal
 *      8: transfer Money from Personal from Dealer
 *      9: transfer Service from Customer to Company
 *      10: transfer Service from Company from Customer
 *      11: transfer Product from Customer to Company
 *      12: transfer Product from Company from Customer
 *      13: transfer Money from Customer to Company
 *      14: transfer Money from Company from Customer
 * }
 */

const TransactionSchema = new mongoose.Schema({
    info: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    source: {type: mongoose.Schema.ObjectId, ref: 'Account'},
    dest: {type: mongoose.Schema.ObjectId, ref: 'Account'},
    service: {type: mongoose.Schema.ObjectId, ref: 'Service'},
    goods: {
        product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
        store: {type: mongoose.Schema.ObjectId, ref: 'Store'},
        amount: {
            type: Number,
            default: 0
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    removed: {
        type: Boolean,
        default: false
    }
});

TransactionSchema.methods = {
    filterProps: function(){
        return pick(this, ['_id', 'info', 'type', 'amount', 'source', 'destination', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, [ 'info', 'type', 'amount', 'source', 'destination']);
    },
    putToTheBin: async function(){
        this.removed = true;
        await this.save();
        return this;
    },
};


const handleValidation = function(error, res, next) {
    switch (error.name) {
        case 'ValidationError':
            next(new Error(error.message));
            break;
        default:
            next();
            break;
    }
};
  
TransactionSchema.post('save', handleValidation);
TransactionSchema.post('update', handleValidation);
TransactionSchema.post('findOneAndUpdate', handleValidation);
TransactionSchema.post('insertMany', handleValidation);

module.exports = mongoose.model('Transaction', TransactionSchema);
