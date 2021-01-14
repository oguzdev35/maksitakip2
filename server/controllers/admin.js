const User = require('../models/user');
const pick = require('lodash/pick');
const yup = require('yup');

const checkAdminProps = operation => async (req, res, next) => {

    try {

        let schema = undefined;

        console.log(process.env)

        switch(operation){
            case 'create':
                schema = yup.object().shape({
                    name: yup.string().required('İsim gereklidir.'),
                    api_root_key: yup.string().required('API anahtarı gereklidir.').test(
                        'match',
                        'Yanlış API anahtarı girdiniz.',
                        function(){
                            return this.parent.api_root_key == process.env.API_ROOT_KEY;
                        }
                    )
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
        req.body.isAdmin = true;
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
    checkAdminProps
}