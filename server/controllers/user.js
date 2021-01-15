const User = require('../models/user');
const pick = require('lodash/pick');
const mongoose = require('../database').mongoDb;

const create = async (req, res) => {
    try {

        let user = await User.create(req.body);

        return res.status(200).json(user.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const list = async (req, res) => {
    try {

        let users = await User.find({});

        return res.status(200).json(users);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const findById =  async (req, res, next, id) => {

    if( !mongoose.Types.ObjectId.isValid(id) ){
        return res.status(400).json({
            error: 'Kullanıcı ID numarası geçersizdir.'
        })
    }

    try {

        let user = await User.findById(id);

        req.user = user;

        next();
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const view = async (req, res) => {
    try {

        return res.status(200).json(req.user.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const remove = async (req, res) => {
    try {

        await req.user.putToTheBin();

        return res.status(200).json(req.user.filterProps());
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    create,
    list,
    view,
    findById,
    remove
}