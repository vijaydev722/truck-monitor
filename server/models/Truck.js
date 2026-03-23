const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['In Transit', 'Idle', 'Maintenance'],
    default: 'Idle',
  },
  location: {
    type: String,
    default: 'Unknown',
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Truck', truckSchema);
