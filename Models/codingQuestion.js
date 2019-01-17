const mongoose = require('mongoose');

var codingQuestionSchema = mongoose.Schema({
    question: {type: String, required: true},
    input: {type: Array, required: true},
    output: {type: Array, required: true}
});

module.exports = mongoose.model("CodingQuestion",codingQuestionSchema);