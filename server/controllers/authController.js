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
      let driver = await Driver.findOne({ phone });
      if (!driver) {
        return res.status(404).json({ error: 'Driver mobile number not found.' });
      }
      // Update the driver's current location upon login
      driver.currentLocation = location;
      await driver.save();
      return res.json({ success: true, user: { id: driver._id, name: driver.name, role: 'driver', phone: driver.phone, location: driver.currentLocation } });
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
