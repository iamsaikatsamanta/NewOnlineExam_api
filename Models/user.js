const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
  refId: { type: String, required: true, unique: true},
  course: { type:String},
  year: { type:String},
  phoneno: { type:String},
  name: { type:String},
  dob: { type:String},
  img_url: { type:String},
  email: { type:String,required: true, unique: true},
  method: {type: String, enum: ['Local', 'Google', 'Facebook'], required: true},
  lcoal: {
    password: { type:String}
  },
  google: {
    id: {type: String}
  },
  facebook: {
    id: {type: String}
  }
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
