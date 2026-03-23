const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  loadingPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'LoadingPlace', required: true },
  deliveryAddress: { type: String, required: true },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Shipment', shipmentSchema);
