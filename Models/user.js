const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  refId: { type: String, required: true, unique: true},
  course: { type:String, required: true},
  year: { type:String, required: true},
  email: { type:String, required: true, unique: true},
  phoneno: { type:String, required: true},
  name: { type:String, required: true},
  dob: { type:String, required: true},
  password: { type:String, required: true},
  img_url: { type:String, required: true}
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
