const User = require('../models/user');
const pick = require('lodash/pick');
const yup = require('yup');


const checkUserProps = operation => async (req, res, next) => {
    try {

        let schema = undefined;


        switch(operation){
            case 'create':
                schema = yup.object().shape({
                    name: yup.string().required('İsim gereklidir.'),
                    username: yup.string().required('Kullanıcı Adı gereklidir.'),
                    email: yup.string().email('Eposta formatı uygun değildir.')
                        .required('Eposta adresi gereklidir.'),
                    password: yup.string().required('Şifre gereklidir.'),
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
    checkUserProps
}