const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const InventorySchema = new mongoose.Schema({
    info: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    store: {type: mongoose.Schema.ObjectId, ref: 'Store'},
    product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
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

InventorySchema.methods = {
    filterProps: function(){
        return pick(this, ['_id', 'info', 'price', 'amount', 'store', 'product', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['info', 'price', 'amount', 'store', 'product']);
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
  
InventorySchema.post('save', handleValidation);
InventorySchema.post('update', handleValidation);
InventorySchema.post('findOneAndUpdate', handleValidation);
InventorySchema.post('insertMany', handleValidation);

module.exports = mongoose.model('Inventory', InventorySchema);
