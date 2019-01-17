const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
  userid: { type: String, required: true, unique: true},
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  img_url: {type: String, required: true},
  resetToken: String,
  tokenExpr: Date
});

adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Admin', adminSchema);
