const User = require('../Models/user'),
      Marks= require('../Models/marks'),
      bcrypt = require('bcryptjs'),
      nodemailer= require('nodemailer'),
      sendgridtransport= require('nodemailer-sendgrid-transport'),
      jwt = require('jsonwebtoken') ;
      config = require('../config/config'),
      Common = require('../utils/response');
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
            course: req.body.course,
            year: req.body.year,
            lcoal: {
                email: req.body.email,
                password: hash
            },
            phoneno: req.body.phoneno,
            name: req.body.name,
            dob: req.body.dob,
            img_url: url + '/images/user/' + req.file.filename,
            method: 'Local'
        });
        user.save().then(result=> {
            const marks = new Marks({
                user: result.refId
            });
            marks.save();
            res.status(200).json(Common.generateResponse(0, result));
        }).then(result =>{
            transpoter.sendMail({
                to: user.email,
                from: 'onlinexm@akcsit.in',
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
    User.findOne({refId: req.body.refId})
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
            const token = jwt.sign({refId: fetcheduser.refId, name: fetcheduser.name, img_url: fetcheduser.img_url},
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
                    {expiresIn: '90'}
                ); 
                res.json(Common.generateResponse(0, token));
            })
            .catch(err => {
                return res.json(Common.generateResponse(100, err))    
              });
    } else {
        res.json({
            code: 20,
            message: 'You are Not Registered'
        });
    }
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
