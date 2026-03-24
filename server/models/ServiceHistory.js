const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema({
  truck_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  service_type: { type: String },
  garage_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  cost: { type: Number },
  parts_replaced: [{ type: String }],
  completed_date: { type: Date },
  next_due_km: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceHistory', serviceHistorySchema);
