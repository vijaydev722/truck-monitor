const mongoose = require('mongoose');

const loadingPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoadingPlace', loadingPlaceSchema);
