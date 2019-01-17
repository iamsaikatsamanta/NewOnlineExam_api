const cripto=require('crypto'),
  Admin= require('../Models/admin'),
  bcrypt= require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  nodemailer= require('nodemailer'),
  sendgridtransport= require('nodemailer-sendgrid-transport'),
  config= require('../config/config');
const transpoter= nodemailer.createTransport(sendgridtransport({
  auth:{
    api_key : process.env.API_KEY
  }
}));

// exports.registerAdmin = (req,res,next) => {
//   bcrypt.hash('ranjan8211', 10 ).then(hash => {
//     const admin = new Admin({
//       userid: 'ranjan@admin.com',
//       name: 'Ranjan Das',
//       password: hash,
//       img_url: 'http://localhost:3000/images/admin/ranjan.jpg'
//     });
//     admin.save().then(result => {
//       res.status(201).json({
//         message: 'Admin Created'
//       });
//     }).catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
//   });
// };

exports.adminLogin = (req,res,next)=>{
  let fetchedAdmin;
  Admin.findOne({userid: req.body.username})
    .then(admin=>{
      if(!admin){
        return res.status(401).json({
          message: 'Authentication Failed'
        });
      }
      fetchedAdmin = admin;
      return bcrypt.compare(req.body.password, admin.password);
    })
    .then(result =>{
      if(!result) {
        return res.status(401).json({
          message: 'Authentication Failed'
        });
      }
      const token = jwt.sign({userid: fetchedAdmin.userid,
          name: fetchedAdmin.name,
          img_url: fetchedAdmin.img_url},
          config.JWT_SECRET_ADMIN.Secret,
        {expiresIn: '2h'}
      );
      res.status(200).json({
        adminToken: token
      });
    })
    .catch(Error =>{
      return res.status(401).json({
        message: 'Authentication Failed'
      });
    });
};

exports.resetPassword = (req,res,next)=>{
  console.log('Hi From Reset Password');
  cripto.randomBytes(32, (err,buffer)=> {
    if (err) {
      console.log(err);
      res.status(501).josn({
        message: 'Reset Password Failed'
      });
    }
    const token = buffer.toString('hex');
    Admin.findOne({userid: req.body.username})
      .then(admin=>{
        if (!admin){
          res.status(204).json({
            message: 'You Are Not a Registered Admin'
          });
        }
        admin.resetToken = token;
        admin.tokenExpr = Date.now()+360000;
        return admin.save();
      })
      .then(admin=>{
      transpoter.sendMail({
        to: admin.email,
        from: 'onlinexm@akcsit.in',
        subject: 'Password Reset',
        html:`
          <p>You Request For Password Reset</p>
          <p>Click This <a href="http://localhost:4200/reset-password/${token}/${admin._id}">http://lcoalhost:4200/reset-password/${token}</a>To Set a New Password</p>
        `
      }).catch(err => {
        res.status(500).json({
          message: 'Reset Link Sending Failed',
          err: err
        });
      });
      }).then(result=>{
        res.status(201).json({
          message: 'Password Reset Link has been Sent'
        });
    }).catch(err=>{
        console.log(err);
      })
    ;
  });
};

exports.setNewPassword = async (req,res,next)=> {
  console.log(req.body);
  const adminId= req.body.id;
  const token = req.body.token;
  let admin;
  Admin.findOne({resetToken: token, tokenExpr: {$gt: Date.now()}, _id: adminId})
    .then(adminData=>{
      admin = adminData;
      return bcrypt.hash(req.body.newPassword, 12);
    })
    .then(hashPassword =>{
       admin.password = hashPassword;
       admin.resetToken = undefined;
       admin.tokenExpr= undefined;
       admin.save();
    })
    .then(adminData=>{
      res.status(201).json({
        message: 'Password Reset Successful'
      });
    })
    .cache(err=>{
      res.status(500).json({
        message: 'Some Error Occurred'
      });
    });

};
