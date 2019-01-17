const mongoose = require('mongoose');

var regQSchema = mongoose.Schema({
    question: {type: String, required: true},
    option: {type: Array, required: true},
    correct: {type: String, required: true}
});

module.exports = mongoose.model("RegQuestion",regQSchema);