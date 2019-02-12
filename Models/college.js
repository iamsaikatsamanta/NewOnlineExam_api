const mongoose = require('mongoose');

const collegeSchema = mongoose.Schema({
  college_name: {type: String, require: true}
});

module.exports = mongoose.model('College', collegeSchema);