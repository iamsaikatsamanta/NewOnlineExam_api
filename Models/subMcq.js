const mongoose = require('mongoose');

const subMCQSchema = mongoose.Schema({
  question: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  correct: String
});

module.exports = mongoose.model('Subjectmcq', subMCQSchema);
