const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  truck_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  total_amount: { type: Number, required: true },
  tax_details: {
    base_amount: { type: Number },
    gst_amount: { type: Number },
    gst_rate: { type: Number },
    vendor_gstin: { type: String }
  },
  tds_deducted: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'reconciled', 'rejected'], default: 'pending' },
  loggedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
