const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
 
    country: {type: String, required: true},
});

module.exports = mongoose.model('country', countrySchema);