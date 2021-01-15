const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const DealerCompanySchema = new mongoose.Schema({
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


DealerCompanySchema.methods = {
    filterProps: function(){
        return pick(this, ['id', 'name', 'info', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['name', 'info']);
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
  
DealerCompanySchema.post('save', handleValidation);
DealerCompanySchema.post('update', handleValidation);
DealerCompanySchema.post('findOneAndUpdate', handleValidation);
DealerCompanySchema.post('insertMany', handleValidation);

module.exports = mongoose.model('DealerCompany', DealerCompanySchema);
