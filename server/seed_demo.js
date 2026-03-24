const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');
const Driver = require('./models/Driver');
const Client = require('./models/Client');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://vijaykumar97dev_db_user:g4puNvlBa7tYnVb3@cluster.cwygnye.mongodb.net/?appName=CLUSTER');
    console.log('Connected to DB');

    // Admin
    const adminPhone = '1234567890';
    if (!(await Admin.findOne({ phone: adminPhone }))) {
      await Admin.create({ name: 'Demo Admin', phone: adminPhone, password: 'admin123' });
      console.log('Admin seeded');
    } else {
      console.log('Admin already exists');
    }

    // Driver
    const driverPhone = '0987654321';
    if (!(await Driver.findOne({ phone: driverPhone }))) {
      await Driver.create({ name: 'Demo Driver', phone: driverPhone, licenseNumber: 'DL-DEMO-123' });
      console.log('Driver seeded');
    } else {
      console.log('Driver already exists');
    }

    // User (Client)
    const userPhone = '5555555555';
    if (!(await Client.findOne({ phone: userPhone }))) {
      await Client.create({ name: 'Demo User', phone: userPhone });
      console.log('User seeded');
    } else {
      console.log('User already exists');
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
