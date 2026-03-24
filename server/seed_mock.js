const mongoose = require('mongoose');
require('dotenv').config();

const Truck = require('./models/Truck');
const Driver = require('./models/Driver');
const Shipment = require('./models/Shipment');

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vijaykumar97dev_db_user:g4puNvlBa7tYnVb3@cluster.cwygnye.mongodb.net/?appName=CLUSTER';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB for fresh seeding');

    await Truck.deleteMany({});
    await Driver.deleteMany({});
    await Shipment.deleteMany({});

    // Create 1 Truck
    const truck = await Truck.create({
      registration_no: 'TRK-9001',
      vin: '1HTMM57S2026',
      model: 'Volvo FH16',
      year: 2024,
      status: 'active',
      compliance: {
        rc_details: { expiry: new Date('2035-05-20'), status: 'active' }
      },
      last_telemetry: {
        location: { type: 'Point', coordinates: [77.5946, 12.9716] },
        speed: 0
      }
    });

    // Create 1 Driver
    const driver = await Driver.create({
      personal_info: {
        full_name: 'Rajesh Kumar',
        phone: '0987654321' // Same as demo credentials if we didn't wipe Auth!
      },
      compliance: {
        license: { number: 'KA-01-2022-0005678', verified: true }
      },
      current_status: {
        state: 'idle',
        current_truck_id: truck._id,
        last_location: { type: 'Point', coordinates: [77.5946, 12.9716] }
      }
    });

    console.log('Mock Truck and Driver inserted.');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
