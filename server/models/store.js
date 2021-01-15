const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    info: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
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

StoreSchema.methods = {
    filterProps: function(){
        return pick(this, ['_id', 'name', 'info', 'address', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['name', 'info', 'address']);
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
  
StoreSchema.post('save', handleValidation);
StoreSchema.post('update', handleValidation);
StoreSchema.post('findOneAndUpdate', handleValidation);
StoreSchema.post('insertMany', handleValidation);

module.exports = mongoose.model('Store', StoreSchema);
