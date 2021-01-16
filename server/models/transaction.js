const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

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
    destination: {type: mongoose.Schema.ObjectId, ref: 'Account'},
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
