const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  metadata: {
    truck_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  sensors: {
    speed: { type: Number },
    fuel_level: { type: Number },
    engine_temp: { type: Number },
    odometer: { type: Number }
  }
}, { timeseries: { timeField: "timestamp", metaField: "metadata" } });

// Create a 2dsphere index for location
telemetrySchema.index({ "location": "2dsphere" });

module.exports = mongoose.model('Telemetry', telemetrySchema);
