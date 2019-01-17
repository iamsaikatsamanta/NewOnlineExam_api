const mongoose = require('mongoose');

const marksSchema = mongoose.Schema({
    questionmarks: {type: Number, default: 0},
    codingmarks: {type: Number, default: 0},
    coding_lang: {type: String},
    total: {type: Number, default: 0},
    user: {type: String, required: true},
    submit_reg: {type: Boolean, default: false },
    submit_coding: { type: Boolean, default: false }
});
module.exports = mongoose.model('Marks', marksSchema);
