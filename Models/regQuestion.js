const mongoose = require('mongoose');

var regQSchema = mongoose.Schema({
    question: {type: String, required: true},
    option: {type: Array},
    type: {type: String},
    correct: {type: String, required: true}
});

module.exports = mongoose.model("RegQuestion",regQSchema);