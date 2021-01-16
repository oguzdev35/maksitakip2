const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    info: {
        type: String,
        trim: true
    },
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    customer: {type: mongoose.Schema.ObjectId, ref: 'Customer'},
    personal: {type: mongoose.Schema.ObjectId, ref: 'PersonalCompany'},
    dealer: {type: mongoose.Schema.ObjectId, ref: 'DealerCompany'},
    transactions: [
        {type: mongoose.Schema.ObjectId, ref: 'Transaction'},
    ],
    company: {
        type: Boolean,
        default: false
    },
    updatedAt: Date,
    removed: {
        type: Boolean,
        default: false
    }
});

AccountSchema.methods = {
    filterProps: function(){
        return pick(this, ['_id', 'name', 'info', 'balance', 'personal', 'company', 'dealer', 'customer', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['name', 'info', 'balance', 'personal', 'company', 'dealer', 'customer']);
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
  
AccountSchema.post('save', handleValidation);
AccountSchema.post('update', handleValidation);
AccountSchema.post('findOneAndUpdate', handleValidation);
AccountSchema.post('insertMany', handleValidation);

module.exports = mongoose.model('Account', AccountSchema);
