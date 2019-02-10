const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'country'},
  state: {type: String, required: true},
});

module.exports = mongoose.model('State', stateSchema);