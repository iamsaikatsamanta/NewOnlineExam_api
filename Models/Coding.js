const mongoose = require('mongoose');

const codingSchema = mongoose.Schema({
  question: String,
  tcInput1: String,
  tcInput2: String,
  tcOutput1: String,
  tcOutput2: String
});

module.exports = mongoose.model('Coding', codingSchema);
