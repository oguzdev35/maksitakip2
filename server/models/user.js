const mongoose = require('../database').mongoDb;

const UserSchema = new mongoose.Schema({
    name: {type: String},
    isAdmin: {type: Boolean}
});

module.exports = mongoose.model('User', UserSchema);