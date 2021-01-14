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
                    username: yup.string().required('Kullanıcı Adı gereklidir.'),
                    email: yup.string().email('Eposta formatı uygun değildir.')
                        .required('Eposta adresi gereklidir.'),
                    password: yup.string().required('Şifre gereklidir.'),
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

const checkForAdminExistence = async (req, res, next) => {
    try {

        const admin = await User.findOne({
            isAdmin: true
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
            error: error.message
        })
    }
} 

const create = async (req, res) => {
    try {
        req.body.isAdmin = true;
        let user = await User.create(req.body);

        console.log(user)

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
    checkAdminProps,
    checkForAdminExistence
}