const mongoose = require('mongoose');

const userInfoSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    address: {type: String},
    country: {type: mongoose.Schema.Types.ObjectId, ref: 'country'},
    state: {type: mongoose.Schema.Types.ObjectId, ref: 'State'},
    city: {type: mongoose.Schema.Types.ObjectId, ref: 'city'},
    zipcode: {type: Number},
    college: {type: mongoose.Schema.Types.ObjectId, ref: 'College'},
    course: { type:String},
    year: { type:String},
    phoneno: { type:String},
    dob: { type:String},
    parents: {type: String},
    formsubmited: {type: Boolean, default: false},
    appliedforexam: {type: Boolean, default: false}
});

module.exports = mongoose.model('UserInfo', userInfoSchema);
