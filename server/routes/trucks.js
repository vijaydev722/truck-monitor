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
    plateNumber: req.body.plateNumber,
    status: req.body.status,
    location: req.body.location,
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
      truck.status = req.body.status;
    }
    if (req.body.location != null) {
      truck.location = req.body.location;
    }
    truck.lastUpdated = Date.now();

    const updatedTruck = await truck.save();
    res.json(updatedTruck);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
