const mongoose = require('mongoose');

const userInfoSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    address: {type: String},
    country: {type: String},
    state: {type: String},
    city: {type: String},
    zipcode: {type: Number},
    college: {type: String},
    course: { type:String},
    year: { type:String},
    phoneno: { type:String},
    dob: { type:String},
    parents: {type: String}

});

module.exports = mongoose.model('UserInfo', userInfoSchema);
