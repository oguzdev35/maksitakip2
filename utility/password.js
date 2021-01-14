const crypto = require('crypto');

function encryptPassword(password, salt){
    if(!password) return '';
    try {
        return crypto
            .createHmac('sha1', salt)
            .update(password)
            .digest('hex')
    } catch (err) {
        return ''
    }
}

function makeSalt(){
    return Math.round((new Date().valueOf() * Math.random())) + '';
}

module.exports = {
    encryptPassword,
    makeSalt
}