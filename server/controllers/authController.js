const Admin = require('../models/Admin');
const Driver = require('../models/Driver');
const Client = require('../models/Client');

exports.loginUser = async (req, res) => {
  const { role, phone, password, location } = req.body;

  if (!role || !phone) {
    return res.status(400).json({ error: 'Role and mobile number are required.' });
  }

  try {
    if (role === 'admin') {
      if (!password) return res.status(400).json({ error: 'Password is required for Admin login.' });
      const admin = await Admin.findOne({ phone });
      if (!admin || admin.password !== password) {
        return res.status(401).json({ error: 'Invalid admin credentials.' });
      }
      return res.json({ success: true, user: { id: admin._id, name: admin.name, role: 'admin', phone: admin.phone } });
    }

    if (role === 'driver') {
      if (!location) return res.status(400).json({ error: 'Location is mandatory for Driver login.' });
      let driver = await Driver.findOne({ 'personal_info.phone': phone });
      if (!driver) {
        return res.status(404).json({ error: 'Driver mobile number not found.' });
      }
      
      // Handle the case where location is string or array
      let coords = [0, 0];
      if (typeof location === 'string') {
        const parts = location.split(',');
        if (parts.length === 2) {
          coords = [parseFloat(parts[1]), parseFloat(parts[0])]; // [lng, lat] expected by GeoJSON
        }
      }

      // Update the driver's current location upon login
      driver.current_status.last_location = {
        type: 'Point',
        coordinates: coords
      };
      await driver.save();
      
      return res.json({ success: true, user: { id: driver._id, name: driver.personal_info.full_name, role: 'driver', phone: driver.personal_info.phone, location: driver.current_status.last_location } });
    }

    if (role === 'user') {
      let clientObj = await Client.findOne({ phone });
      if (!clientObj) {
        return res.status(404).json({ error: 'User mobile number not found.' });
      }
      return res.json({ success: true, user: { id: clientObj._id, name: clientObj.name, role: 'user', phone: clientObj.phone } });
    }

    return res.status(400).json({ error: 'Invalid role specified.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.seedAdmin = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' });
  try {
    const existing = await Admin.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Admin already exists' });
    const admin = new Admin({ phone, password });
    await admin.save();
    return res.json({ message: 'Admin seeded successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.signupUser = async (req, res) => {
  const { role, phone, password, name, licenseNumber } = req.body;

  if (!role || !phone || !name) {
    return res.status(400).json({ error: 'Role, phone, and name are required.' });
  }

  try {
    if (role === 'admin') {
      if (!password) return res.status(400).json({ error: 'Password is required for Admin signup.' });
      const existing = await Admin.findOne({ phone });
      if (existing) return res.status(400).json({ error: 'Admin with this phone already exists.' });
      
      const admin = new Admin({ name, phone, password });
      await admin.save();
      return res.status(201).json({ success: true, message: 'Admin created successfully.' });
    }

    if (role === 'driver') {
      if (!licenseNumber) return res.status(400).json({ error: 'License number is required for Driver signup.' });
      const existing = await Driver.findOne({ $or: [{ 'personal_info.phone': phone }, { 'compliance.license.number': licenseNumber }] });
      if (existing) return res.status(400).json({ error: 'Driver with this phone or license number already exists.' });

      const driver = new Driver({ 
        personal_info: { full_name: name, phone },
        compliance: { license: { number: licenseNumber, verified: false } }
      });
      await driver.save();
      return res.status(201).json({ success: true, message: 'Driver created successfully.' });
    }

    if (role === 'user') {
      const existing = await Client.findOne({ phone });
      if (existing) return res.status(400).json({ error: 'User with this phone already exists.' });

      const client = new Client({ name, phone });
      await client.save();
      return res.status(201).json({ success: true, message: 'User created successfully.' });
    }

    return res.status(400).json({ error: 'Invalid role specified.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
