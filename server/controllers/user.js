const User = require('../models/user');
const faker = require('faker');
const pick = require('lodash/pick');
const yup = require('yup');

const asAdmin = (req, res, next) => {
    req.body.isAdmin = true;
    next();
};

const checkUserProps = operation => async (req, res, next) => {

    try {

        let schema = undefined;

        switch(operation){
            case 'create':
                schema = yup.object().shape({
                    name: yup.string().required('İsim gereklidir.')
                });

                await schema.validate(req.body)

            default:
                break;
        }

        next();
        
    } catch (error) {
        res.status(409).json({
            error: error.message
        })
    }
    
}

const create = async (req, res) => {
    try {

        const user = await User.create(req.body);

        res.status(200).json(pick(user, ['_id', 'name']));
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    create,
    asAdmin,
    checkUserProps
}