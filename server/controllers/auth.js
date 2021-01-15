const User = require('../models/user');
const pick = require('lodash/pick');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');


const signin = async (req, res) => {

    try {

        const {
            username, email,
            password
        } = req.body;
    
        let user = await User.findOne({
            $or: [{email}, {username}]
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

        const token = jwt.sign( user.filterProps(), process.env.JWT_SECRET);

        res.cookie("t", token, {
            expires: new Date(Date.now() + 9000000),
            path: '/',
            httpOnly: true
        });

        user = pick(user, ['_id', 'name', 'username', 'email', 'createdAt'])

        return res.status(200).json({
            token, user
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

const requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
});

const hasAuthorization = async (req, res) => {
    const authorized = req.user && req.auth && req.admin && req.user._id == req.auth._id;
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