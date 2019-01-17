
var mongoConfig = {
    link: process.env.MONGO_CON
};


var JWT_SECRET_ADMIN = {"Secret": "hCRHsicQa2dtvnWQfUcufnNV5d7nvBUH7Lz7ibyWWnCubVK9KxRYPVIr3Yl1Khvy4Lw3UIz93l29E0Uzo5pXjWlquDFrzYnnF1qTTKrk75F8teh5hrDDvEGHTjxISfB1"};
var JWT_SECRET_USER = {"Secret": "5d4oceyetKcWZHlMruB8TAoE7IEZEi0XPW4sCIJzbR2mF6mSPNEBKyvuEI4uPI5P0VYulagriEpb5ZgmIG86JCwOGcrp8RfZWW5bDJbRsHopBGZ6bppyrddcu2ZlkvGv"};

module.exports = { mongoConfig: mongoConfig, JWT_SECRET_ADMIN: JWT_SECRET_ADMIN, JWT_SECRET_USER: JWT_SECRET_USER} ;
