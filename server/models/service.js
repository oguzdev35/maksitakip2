const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        default: 0
    },
    info: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        default: 0
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

ServiceSchema.methods = {
    filterProps: function(){
        return pick(this, ['_id', 'name', 'info', 'price', 'duration', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, [ 'name', 'price', 'duration', 'info']);
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
  
ServiceSchema.post('save', handleValidation);
ServiceSchema.post('update', handleValidation);
ServiceSchema.post('findOneAndUpdate', handleValidation);
ServiceSchema.post('insertMany', handleValidation);

module.exports = mongoose.model('Service', ServiceSchema);
