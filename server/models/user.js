const mongoose = require('../database').mongoDb;
const { encryptPassword, makeSalt } = require('../../utility/password');
const pick = require('lodash/pick');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Kullanıcı İsim ve Soyisim gereklidir.',
        trim: true
    },
    username: {
        type: String,
        trim: true,
        required: 'Kullanıcı adı gereklidir',
        index: {
            unique: 'Kullanıcı adı sistemimizde kayıtlıdır.',
            partialFilterExpression: {username: {$type: "string"}}
        }
    },
    email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, "Lütfen geçerli bir email adresi giriniz."],
        required: 'Email adresi gereklidir.',
        index: {
            unique: 'Bu email adresi sistemimizde kayıtlıdır.',
            partialFilterExpression: {email: {$type: "string"}}
        }
    },
    hashed_password: {
        type: String,
        required: "Kullanıcı şifresi gereklidir"
    },
    salt: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    company_info: {
        name: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        contact_person: {
            type: String,
            trim: true
        },
        phone1: {
            type: String,
            trim: true
        },
        phone2: {
            type: String,
            trim: true
        },
        fax: String,
        email: {
            type: String,
            trim: true,
            match: [/.+\@.+\..+/, "Lütfen geçerli bir email adresi giriniz."],
        },
        website: {
            type: String,
            trim: true
        },
        tax_office: {
            type: String,
            trim: true
        },
        company_title: {
            type: String,
            trim: true
        },
        tax_number: {
            type: String,
            trim: true
        },
        info: {
            type: String,
            trim: true
        }
    },
    admin: {
        type: Boolean,
        default: false
    },
    removed: {
        type: Boolean,
        default: false
    }
});

UserSchema
    .virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password, this.salt)
    })
    .get(function(){
        return this._password
    });

UserSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText, this.salt) === this.hashed_password;
    },
    encryptPassword: encryptPassword,
    makeSalt: makeSalt,
    updatePassword: function(newPassword){
        this._password = newPassword;
        this.password =newPassword;
        return;
    },
    filterProps: function(){
        return pick(this, ['id', 'name', 'username', 'email', 'createdAt', 'updatedAt']);
    },
    filterAuthProps: function(){
        return pick(this, ['id', 'name', 'username', 'email', 'createdAt', 'admin']);
    },
    filterForUpdate: function(obj){
        return pick(obj, ['name', 'username', 'email', 'password']);
    },
    filterForCompanyInfoInsertation: function(obj){
        return pick(obj, [ 'name', 'address', 'contact_person', 'phone1', 'phone2', 'fax', 'email', 'website', 'tax_office', 'company_title', 'tax_number', 'info'])
    },
    putToTheBin: async function(){
        this.removed = true;
        await this.save();
        return this;
    },
};

UserSchema.path('hashed_password').validate(function(v){
    if(this._password && this._password.length < 6){
        this.invalidate('password', 'Kullanıcı şifresi en az 6 karakterli olmalıdır.')
    }
    if(this.isNew && !this.password){
        this.invalidate('password', 'Kullanıcı şifresi gereklidir.')
    }
}, null);


const handleValidation = function(error, res, next) {
    switch (error.name) {
        case 'ValidationError':
            next(new Error(error.message));
            break;
        case 'MongoError':
            if(error.code == '11000'){
                if(error.keyValue.username){
                    next(new Error('Bu kullanıcı adı sistemimizde kayıtlıdır.'))
                } else if(error.keyValue.email){
                    next(new Error('Bu Eposta adresi sistemimizde kayıtlıdır.'));
                }
            }
            next();
            break;
        default:
            next();
            break;
    }
};
  
UserSchema.post('save', handleValidation);
UserSchema.post('update', handleValidation);
UserSchema.post('findOneAndUpdate', handleValidation);
UserSchema.post('insertMany', handleValidation);

module.exports = mongoose.model('User', UserSchema);