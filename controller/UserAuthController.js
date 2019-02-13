const User = require('../Models/user'),
      Marks= require('../Models/marks'),
      bcrypt = require('bcryptjs'),
      nodemailer= require('nodemailer'),
      sendgridtransport= require('nodemailer-sendgrid-transport'),
      jwt = require('jsonwebtoken') ;
      config = require('../config/config'),
      Common = require('../utils/response'),
      UserInfo = require('../Models/UserInfo');
const transpoter= nodemailer.createTransport(sendgridtransport({
    auth:{
        api_key: process.env.API_KEY
    }
}));

exports.userRegister = (req,res, next) =>{
    const url = req.protocol + '://' + req.get('host');
    bcrypt.hash(req.body.password ,10).then(hash =>{
        const user =new User({
            refId: 'OE'+ getRefId(),
            email: req.body.email,
            password: hash,
            name: req.body.name,
        });
        user.save().then(result=> {
            const marks = new Marks({
                user: result.refId
            });54
            marks.save();
            const userInfo = new UserInfo({
                userid: result._id
            });
            userInfo.save();
            res.status(200).json(Common.generateResponse(0, result));
        }).then(result =>{
            transpoter.sendMail({
                to: user.email,
                from: 'saikat@akcsit.in',
                subject: 'Registration Successful',
                html:'<h1>You have Successfully Registered</h1>'
            });
        }).catch(error =>{
            console.log(error);
            res.status(500).json(Common.generateResponse());
        });
    });
};

exports.userLogin = (req,res,next) => {
    let fetcheduser;
    User.findOne({
        $or :[
            {refId: req.body.refId},
            {email: req.body.refId}
        ]
    })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            fetcheduser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result=>{
            if(!result){
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            const token = jwt.sign({userid: fetcheduser._id , refId:fetcheduser.refId, name: fetcheduser.name, img_url: fetcheduser.img_url},
                config.JWT_SECRET_USER.Secret,
                {expiresIn: '20m'}
            );
            res.status(200).json({
                token: token
            });
        })
        .catch(err =>{
            return res.status(401).json({
                message: 'Auth Failed'
            });
        });
};

exports.googleRegistration =(req, res) => {
    console.log(req.authInfo);
    if (req.authInfo ==='New User') {
       return res.json(Common.generateResponse(0, req.user));
    } else if (req.authInfo ==='Existing User') {
        return res.json(Common.generateResponse(5))
    }
};

exports.googleLogin =(req, res) => {
    console.log(req.authInfo);
    if (req.authInfo ==='Existing User') {
        User.findOne({email: req.user.email})
            .then(resp => {
                const token = jwt.sign({refId: resp.refId, name: resp.name, img_url: resp.img_url},
                    config.JWT_SECRET_USER.Secret,
                    {expiresIn: '90m'}
                ); 
                res.json(Common.generateResponse(0, token));
            })
            .catch(err => {
                return res.json(Common.generateResponse(100, err))    
              });
    } else {
        res.json({
            code: 20,
            message: 'You are Not Registered Via Google'
        });
    }
};
exports.facebookRegistration =(req, res) => {
    console.log(req.authInfo);
    if (req.authInfo ==='New User') {
        return res.json(Common.generateResponse(0, req.user));
    } else if (req.authInfo ==='Existing User') {
        return res.json(Common.generateResponse(5))
    }
};

exports.facebookLogin = (req,res,next)=> {
    if (req.authInfo ==='Existing User') {
        User.findOne({email: req.user.email})
            .then(resp => {
                const token = jwt.sign({refId: resp.refId, name: resp.name, img_url: resp.img_url},
                    config.JWT_SECRET_USER.Secret,
                    {expiresIn: '5h'}
                );
                res.json(Common.generateResponse(0, token));
            })
            .catch(err => {
                return res.json(Common.generateResponse(100, err))
            });
    } else {
        res.json({
            code: 20,
            message: 'You are Not Registered Via Facebook'
        });
    }
};
exports.examLogin = (req,res) => {
    User.findOne({refId: req.body.refId})
        .then(user => {
            if (!user) {
                return res.json(Common.generateResponse(2));
            }
            if (user.dob === req.body.password) {
                const token = jwt.sign({refId: user.refId, name: user.name, img_url: user.img_url},
                    config.JWT_SECRET_USER.Secret,
                    {expiresIn: '2h'}
                );
                res.status(200).json(Common.generateResponse(0,token));
            } else {
                return res.json(Common.generateResponse(2));
            }
        })
};
exports.getUser = (req,res) => {
  User.findOne({refId: req.params.refId})
      .select(['name', 'refId','img_url','email'])
      .then(user=> {
          if (user) {
              return res.json(Common.generateResponse(0, user))
          }
          return res.json(Common.generateResponse(3))
      })
      .catch(err=> {
          return res.json(Common.generateResponse(100, err))
      })
};

exports.filForm =(req,res) => {
    const info = new UserInfo({
        userid: req.user.userid,
        address: req.body.add,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        zipcode: req.body.zipcode,
        college: req.body.college,
        course: req.body.course,
        year: req.body.year,
        phoneno: req.body.phoneno,
        dob: req.body.dob,
        parents: req.body.parents
    });
    User.findOneAndUpdate({_id: req.user.userid}, {
        img_url:  req.body.img_url, 
        dob: req.body.dob.split('-').join(''),
        formsubmited: true
    })
    .then(user => {
        if(user) {
           return info.save();
        } else {
            return res.json(Common.generateResponse(100));
        }
    })
    .then(user => {
        if(user) {
            return res.json(Common.generateResponse(0, user));
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err=> {
        return res.json(Common.generateResponse(100, err));
    });
};
exports.updateUserInfo =(req,res) => {
    UserInfo.findOneAndUpdate({userid: req.user.userid}, req.body)
    .then(user => {
        if(user) {
            return res.json(Common.generateResponse(0, user));
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err=> {
        return res.json(Common.generateResponse(100, err));
    });
};

exports.getUserInfo =(req,res) => {
    console.log(req.user);
    User.findOne({_id: req.user.userid})
        .select('-password')
        .then(user=> {
            if(user) {
                return res.json(Common.generateResponse(0, user));
            }
            return res.json(Common.generateResponse(3));
        })
        .catch(err=> {
            return res.json(Common.generateResponse(100, err));
        });
};
exports.resetPassword = (req, res) => {
    let fetcheduser;
    User.findOne({refId: req.userId})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            fetcheduser = user;
            return bcrypt.compare(req.body.old, user.password);
        })
        .then(result=>{
            if(!result){
                return res.json(Common.generateResponse(2, 'Old Password Do Not Match'));
            }
            bcrypt.hash(req.body.new ,10).then(hash =>{
                fetcheduser.password = hash;
                return fetcheduser.save();     
            });
        })
        .then(resp=> {
            res.json(Common.generateResponse(0, 'Password Reset Successful'));
        })
        .catch(err =>{
            return res.status(401).json({
                message: 'Auth Failed'
            });
        });
};

function getRefId(){
    var d = new Date();
    var date = d.getFullYear().toString();
    if(d.getMonth()+1<10){
        date += '0'+(d.getMonth()+1);
    }else{
        date += (d.getMonth()+1);
    }
    if(d.getDate()<10){
        date += '0'+d.getDate();
    }else {
        date += d.getDate();
    }
    var refId = Math.floor(1000 + Math.random() * 9000);
    return date+refId
}
