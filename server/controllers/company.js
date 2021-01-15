const User = require('../models/user');

const getAdmin = async (req, res, next) => {
    try {

        let admin = await User.findOne({admin: true});

        if(!admin){
            return res.status(400).json({
                error: 'Yönetici Hesabı bulunamadı'
            })
        }

        req.admin = admin;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const create = async (req, res) => {
    try {

        let admin = req.admin;

        admin.company_info = admin.filterForCompanyInfoInsertation(req.body);

        await admin.save();


        return res.status(200).json(admin.company_info);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}


const view = async (req, res) => {
    try {

        return res.status(200).json(req.admin.company_info);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const edit = async (req, res) => {
    try {

        let admin = req.admin

        admin.company_info = {
            ...admin.company_info,
            ...admin.filterForCompanyInfoInsertation(req.body)
        }

        await admin.save();

        return res.status(200).json(admin.company_info);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    create,
    view,
    edit,
    getAdmin
}