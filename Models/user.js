const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  refId: { type: String, required: true, unique: true},
  name: { type:String},
  dob: { type:String},
  img_url: { type:String},
  email: { type:String,required: true, unique: true},
  password: { type:String},
  formsubmited: {type: Boolean, default: false},
  appliedforexam: {type: Boolean, default: false}
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
