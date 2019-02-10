const jwt = require('jsonwebtoken'),
      config = require('../config/config');

module.exports = (req,res,next) => {
  // const token =req.query.user_authorization.split("_")[1];
  // const data = jwt.verify(token, "The Hydrogen One Smartphone will come with an A3D Multi-dimensional surround sound and Red also says that it is a module, cinema-capable media which will be letting you add a power pack for increasing battery life and also expand phone’s memory or even attach a camera module with changeable mounts and these will be available in 2019. It also has a Holographic 4-View (H4V) recoding front and back with 3D experience and it also creates a depth map and adds two additional views (4V) in real time. There are a durable carbon fiber and functionally designed side controls on the device.");
  //   console.log(data);
  try{
    const token =req.headers.authorization.split(" ")[1];
    jwt.verify(token, config.JWT_SECRET_USER.Secret, (err,decode)=> {
      req.userId = decode.refId;
      req.user = decode;
    });
    next();
  }catch(error){
    res.status(401).json({
      message: 'User Authentication Failed'
    });
  }

};
