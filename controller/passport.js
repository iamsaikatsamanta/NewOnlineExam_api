const passport = require('passport'),
        JwtStrategy = require('passport-jwt'),
        GoogleStrategy = require('passport-google-plus-token'),
        facebookStrategy = require('passport-facebook-token'),
        User = require('../Models/user');


passport.use('googleLogin', new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(JSON.stringify(profile));
        const exuser = await User.findOne({ "google.id": profile.id });
        if (exuser) {
            return done(null,exuser,'Existing User')
        }
        return done(null,'User Already Exists');
    }catch (err) {
        done(err,false,err.message)
    }
}));

passport.use('googleRegistration', new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const exuser = await User.findOne({email: profile.emails[0].value });
        if (exuser) {
            return done(null,exuser,'Existing User')
        }
        const newUser = new User({
            method: 'Google',
            google: {
                id: profile.id,
            },
            email: profile.emails[0].value,
            refId: 'OE'+getRefId(),
            name: profile.name.givenName +' '+ profile.name.familyName,
            img_url: profile.photos[0].value
        });
        await newUser.save();
        done(null,newUser, 'New User');
    }catch (err) {
        done(err,false,err.message)
    }

}));

passport.use('facebookRegistration', new facebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    try {
        const exuser = await User.findOne({email: profile.emails[0].value });
        if (exuser) {
            return done(null,exuser,'Existing User')
        }
        const newUser = new User({
            method: 'Facebook',
            facebook: {
                id: profile.id,
            },
            email: profile.emails[0].value,
            refId: 'OE'+getRefId(),
            name: profile.name.givenName +' '+ profile.name.familyName,
            img_url: profile.photos[0].value
        });
        await newUser.save();
        done(null,newUser, 'New User');
    }catch (err) {
        done(err,false,err.message)
    }

}));

passport.use('facebookLogin', new facebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(JSON.stringify(profile));
        const exuser = await User.findOne({ "facebook.id": profile.id });
        if (exuser) {
            return done(null,exuser,'Existing User')
        }
        return done(null,'User Already Exists');
    }catch (err) {
        done(err,false,err.message)
    }
}));

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
