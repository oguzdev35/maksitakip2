const User = require('../models/user');
const pick = require('lodash/pick');


const checkForAdminExistence = async (req, res, next) => {
    try {


        const admin = await User.findOne({
            admin: true
        });

        if(admin){
            return res.status(403).json({
                error: 'Daha Önce Yönetici Hesabı Oluşturulmuştur.'
            })
        } else {
           next();
        }
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
} 

const create = async (req, res) => {
    try {
        req.body.admin = true;
        let user = await User.create(req.body);

        user = pick(user, ['id', 'name', 'email', 'createdAt']);

        return res.status(200).json(user);
        
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {
    create,
    checkForAdminExistence
}