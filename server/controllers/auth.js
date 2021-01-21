const User = require('../models/user');
const jwt = require('jsonwebtoken');


const signin = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;
    
        let user = await User.findOne({
            email
        });
    
        if(!user){
            return res.status(401).json({
                error: "Bu kullanıcı adına sahip kullanıcı bulunamadı."
            });
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Girdiğiniz kullanıcı şifresi yanlıştır."
            });
        }

        const token = jwt.sign( user.filterAuthProps(), process.env.JWT_SECRET);

        res.cookie("t", token, {
            expires: new Date(Date.now() + 9000000),
            path: '/',
            httpOnly: true
        });

        return res.status(200).json({
            token, user: user.filterProps()
        });
    
        
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }

   
}

const signout = async (req, res) => {
    try {
        res.clearCookie('t');
        return res.status(200).json({
            message: "Kullanıcı uygulamadan başarıyla çıkış yaptı."
        });
    } catch (error) {
        return res.status(400).json({
            error: 'Kullanıcı uygulamadan başarıyla çıkış yapamadı.'
        })
    }
}

const requireSignin = async (req, res, next) => {
        const token = req.headers?.authorization?.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
            if(error){
                return res.status(401).json('Bu servisi kullanmak için kullanıcı girişi yapmanız gerekiyor');
            }
            req.auth = decoded;
            next();
        });
        
}

const hasAuthorization = async (req, res, next) => {
    const authorized = req.user && req.auth && ((req.auth.admin) || (req.user._id == req.auth._id));
    if(!authorized){
        return res.status(401).json({
            error: "Kullanıcı yetkili değildir."
        });
    }

    next();
}


module.exports = {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}