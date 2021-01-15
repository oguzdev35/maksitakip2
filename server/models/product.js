const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const ProductSchema = new mongoose.Schema({
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
    categories: [
        {type: mongoose.Schema.ObjectId, ref: 'ProductCategory'},
    ],
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

ProductSchema.methods = {
    filterProps: function(){
        return pick(this, ['id', 'name', 'info', 'price', 'categories', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['name', 'name', 'price', 'categories', 'info']);
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
  
ProductSchema.post('save', handleValidation);
ProductSchema.post('update', handleValidation);
ProductSchema.post('findOneAndUpdate', handleValidation);
ProductSchema.post('insertMany', handleValidation);

module.exports = mongoose.model('Product', ProductSchema);
