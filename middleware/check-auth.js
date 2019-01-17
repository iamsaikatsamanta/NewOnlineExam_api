const jwt = require('jsonwebtoken'),
      config = require('../config/config');

module.exports = (req,res,next) => {
    try{
        const token =req.headers.authorization.split(" ")[1];
        jwt.verify(token, config.JWT_SECRET_ADMIN.Secret);
        next();
    }catch(error){
        res.status(401).json({
            message: 'Authentication Failed'
        });
    }
   
};
