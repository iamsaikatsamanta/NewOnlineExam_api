const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'state'},
  city: {type: String, required: true},
});

module.exports = mongoose.model('city', citySchema);