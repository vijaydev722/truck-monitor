const mongoose = require('mongoose');

const trafficFineSchema = new mongoose.Schema({
  truck_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  challan_number: { type: String, required: true },
  amount: { type: Number, required: true },
  violation_type: { type: String },
  status: { type: String, enum: ['unpaid', 'paid', 'pending', 'contested'], default: 'unpaid' },
  issued_date: { type: Date },
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrafficFine', trafficFineSchema);
