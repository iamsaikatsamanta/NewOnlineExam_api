const User = require('../Models/user'),
      Common = require('../utils/response');

exports.getRegisteredCandidate = (req,res,next) =>{
    User.find()
        .then(users => {
            return res.json(Common.generateResponse(0, users))
        })
        .then(err=>{
            return res.json(Common.generateResponse(100, err))
        });
};
