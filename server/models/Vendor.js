const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // maintenance, fuel, insurance
  gstin: { type: String },
  pan: { type: String },
  bank_details: {
    account_no: { type: String },
    ifsc: { type: String }
  },
  is_verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);
