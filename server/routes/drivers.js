const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new driver
router.post('/', async (req, res) => {
  // Map flat properties from UI
  const payload = {
    personal_info: {
      full_name: req.body.name || req.body.personal_info?.full_name,
      phone: req.body.phone || req.body.personal_info?.phone
    },
    compliance: {
      license: {
        number: req.body.licenseNumber || req.body.compliance?.license?.number
      }
    },
    current_status: {
      state: req.body.status ? req.body.status.toLowerCase().replace('-', '_') : 'idle'
    }
  };

  const driver = new Driver(payload);
  try {
    const newDriver = await driver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a driver
router.patch('/:id', async (req, res) => {
  try {
    // Map retro fields to nested fields
    const updates = { ...req.body };
    if (updates.name) {
      updates['personal_info.full_name'] = updates.name;
      delete updates.name;
    }
    if (updates.phone) {
      updates['personal_info.phone'] = updates.phone;
      delete updates.phone;
    }
    if (updates.licenseNumber) {
      updates['compliance.license.number'] = updates.licenseNumber;
      delete updates.licenseNumber;
    }
    if (updates.status) {
      updates['current_status.state'] = updates.status.toLowerCase().replace('-', '_');
      delete updates.status;
    }

    const driver = await Driver.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
