const User = require('../models/user');
const pick = require('lodash/pick');

const create = async (req, res) => {
    try {

        let user = await User.create(req.body);
        
        user = pick(user, ['id', 'name', 'username', 'email', 'createdAt']);

        return res.status(200).json(user);
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    create,
}