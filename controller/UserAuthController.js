const User = require('../Models/user'),
      Marks= require('../Models/marks'),
      bcrypt = require('bcryptjs'),
      nodemailer= require('nodemailer'),
      sendgridtransport= require('nodemailer-sendgrid-transport'),
      jwt = require('jsonwebtoken') ;
      config = require('../config/config');
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
            email: req.body.email,
            phoneno: req.body.phoneno,
            name: req.body.name,
            dob: req.body.dob,
            password: hash,
            img_url: url + '/images/user/' + req.file.filename
        });
        user.save().then(result=> {
            const marks = new Marks({
                user: result.refId
            });
            marks.save();
            res.status(200).json({
                message: 'Registration Successful'
            });
        }).then(result =>{
            transpoter.sendMail({
                to: user.email,
                from: 'onlinexm@akcsit.in',
                subject: 'Registration Successful',
                html:'<h1>You have Successfully Registered</h1>'
            });
        }).catch(error =>{
            console.log(error);
            res.status(500).json({
                error: error
            });
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
