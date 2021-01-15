const mongoose = require('../database').mongoDb;
const { encryptPassword, makeSalt } = require('../../utility/password');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Kullanıcı İsim ve Soyisim gereklidir.'
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
    isAdmin: {
        type: Boolean,
        default: false
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
    }
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
    console.log(error.keyValue)
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