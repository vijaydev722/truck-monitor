const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  registration_no: { type: String, required: true, unique: true },
  vin: { type: String },
  model: { type: String },
  year: { type: Number },
  status: { type: String, enum: ['active', 'maintenance', 'idle', 'docs_expired'], default: 'active' },

  compliance: {
    rc_details: {
      expiry: { type: Date },
      status: { type: String },
      doc_url: { type: String }
    },
    insurance: {
      policy_no: { type: String },
      expiry: { type: Date },
      provider: { type: String }
    },
    puc: {
      certificate_no: { type: String },
      expiry: { type: Date }
    },
    fitness: {
      fc_no: { type: String },
      expiry: { type: Date }
    },
    noc: {
      is_issued: { type: Boolean, default: false },
      state: { type: String }
    }
  },

  last_telemetry: {
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] } // [longitude, latitude]
    },
    speed: { type: Number, default: 0 },
    last_ping: { type: Date }
  },

  legal_owner: {
    name: { type: String },
    pan: { type: String },
    gstin: { type: String }
  },
  
  tax_slabs: {
    road_tax_paid_until: { type: Date },
    gst_category: { type: String }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for geo queries
truckSchema.index({ "last_telemetry.location": "2dsphere" });

module.exports = mongoose.model('Truck', truckSchema);
