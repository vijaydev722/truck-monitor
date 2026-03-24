const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Links to auth users if needed

  personal_info: {
    full_name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    emergency_contact: {
      name: { type: String },
      relation: { type: String },
      phone: { type: String }
    },
    address: { type: String }
  },
  
  tax_identity: {
    pan: { type: String },
    gstin: { type: String },
    aadhaar_no: { type: String }
  },

  compliance: {
    license: {
      number: { type: String, required: true, unique: true },
      type: { type: String },
      expiry: { type: Date },
      verified: { type: Boolean, default: false }
    },
    medical_fitness: {
      last_checkup: { type: Date },
      expiry: { type: Date },
      blood_group: { type: String }
    },
    police_verification: {
      status: { type: String, enum: ['cleared', 'pending', 'rejected'], default: 'pending' },
      verified_on: { type: Date },
      doc_url: { type: String }
    }
  },

  current_status: {
    state: { type: String, enum: ['idle', 'on_trip', 'off_duty', 'suspended'], default: 'idle' },
    current_truck_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    last_location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }
    },
    updated_at: { type: Date, default: Date.now }
  },

  createdAt: { type: Date, default: Date.now }
});

// Ensure retro compatibility with old code relying on `name`, `licenseNumber`, `phone`, `status`, `currentLocation`
driverSchema.virtual('name').get(function() { return this.personal_info.full_name; });
driverSchema.virtual('licenseNumber').get(function() { return this.compliance?.license?.number; });
driverSchema.virtual('phone_retro').get(function() { return this.personal_info.phone; });
driverSchema.virtual('status_retro').get(function() { return this.current_status.state; });

driverSchema.index({ "current_status.last_location": "2dsphere" });

module.exports = mongoose.model('Driver', driverSchema);
