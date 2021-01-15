const mongoose = require('../database').mongoDb;
const pick = require('lodash/pick');

const CustomerSchema = new mongoose.Schema({
    person: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    info: {
        type: String,
        trim: true
    },
    contact_person: {
        name: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            match: [/.+\@.+\..+/, "Lütfen geçerli bir email adresi giriniz."],
            index: {
                unique: 'Bu email adresi sistemimizde kayıtlıdır.',
                partialFilterExpression: {email: {$type: "string"}}
            }
        },
        citizenship: {
            type: String,
            trim: true
        },
        citizenship_no: {
            type: String,
            trim: true
        },
    } ,
    phones: [
        {
            type: String,
            trim: true
        },
    ],
    fax: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, "Lütfen geçerli bir email adresi giriniz."],
        index: {
            unique: 'Bu email adresi sistemimizde kayıtlıdır.',
            partialFilterExpression: {email: {$type: "string"}}
        }
    },
    address: {
        country: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        district: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
    },
    tax_info: {
        company_title: {
            type: String,
            trim: true
        },
        tax_office: {
            type: String,
            trim: true
        },
        tax_no: {
            type: String,
            trim: true
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

CustomerSchema.methods = {
    filterProps: function(){
        return pick(this, ['_id', 'person', 'name', 'contact_person', 'info', 'phones', 'fax', 'email', 'address', 'tax_info', 'createdAt', 'updatedAt']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['_id', 'person', 'name', 'contact_person', 'info', 'phones', 'fax', 'email', 'address', 'tax_info', 'createdAt']);
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
  
CustomerSchema.post('save', handleValidation);
CustomerSchema.post('update', handleValidation);
CustomerSchema.post('findOneAndUpdate', handleValidation);
CustomerSchema.post('insertMany', handleValidation);

module.exports = mongoose.model('Customer', CustomerSchema);
