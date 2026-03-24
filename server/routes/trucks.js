const express = require('express');
const router = express.Router();
const Truck = require('../models/Truck');

// Get all trucks
router.get('/', async (req, res) => {
  try {
    const trucks = await Truck.find().sort({ lastUpdated: -1 });
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new truck
router.post('/', async (req, res) => {
  const truck = new Truck({
    registration_no: req.body.registration_no || req.body.plateNumber,
    vin: req.body.vin,
    model: req.body.model,
    year: req.body.year,
    status: req.body.status ? req.body.status.toLowerCase().replace(' ', '_') : 'idle',
    compliance: req.body.compliance,
    last_telemetry: req.body.last_telemetry || {
      location: { type: 'Point', coordinates: [0, 0] }
    },
    legal_owner: req.body.legal_owner,
    tax_slabs: req.body.tax_slabs
  });

  try {
    const newTruck = await truck.save();
    res.status(201).json(newTruck);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a truck
router.patch('/:id', async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    if (req.body.status != null) {
      truck.status = req.body.status.toLowerCase().replace(' ', '_');
      if (truck.status === 'in_transit') truck.status = 'active'; // Map old to new
    }
    
    // Support retro location strings if passed from old UI
    if (req.body.location != null) {
       // if we have a robust UI, we should parse it. For now let's skip.
    }
    
    truck.updatedAt = Date.now();

    const updatedTruck = await truck.save();
    res.json(updatedTruck);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
