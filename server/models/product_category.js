const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const ProductCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    info: {
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

ProductCategorySchema.methods = {
    filterProps: function(){
        return pick(this, ['id', 'name', 'info', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['name', 'name', 'info']);
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
  
ProductCategorySchema.post('save', handleValidation);
ProductCategorySchema.post('update', handleValidation);
ProductCategorySchema.post('findOneAndUpdate', handleValidation);
ProductCategorySchema.post('insertMany', handleValidation);

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);
