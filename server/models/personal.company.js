const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const PersonalCompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
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

PersonalCompanySchema.methods = {
    filterProps: function(){
        return pick(this, ['id', 'name', 'title', 'info', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['name', 'title', 'info']);
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
  
PersonalCompanySchema.post('save', handleValidation);
PersonalCompanySchema.post('update', handleValidation);
PersonalCompanySchema.post('findOneAndUpdate', handleValidation);
PersonalCompanySchema.post('insertMany', handleValidation);

module.exports = mongoose.model('PersonalCompany', PersonalCompanySchema);
