const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
  legal_name: { type: String, required: true },
  gstin: { type: String, required: true, unique: true },
  pan: { type: String, required: true },
  registered_address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  billing_contact: {
    name: { type: String },
    email: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);
