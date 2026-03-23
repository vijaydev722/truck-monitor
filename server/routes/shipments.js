const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('client')
      .populate('loadingPlace')
      .populate('truck')
      .populate('driver')
      .sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new shipment
router.post('/', async (req, res) => {
  const shipment = new Shipment(req.body);
  try {
    const newShipment = await shipment.save();
    res.status(201).json(newShipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a shipment
router.patch('/:id', async (req, res) => {
  req.body.updatedAt = Date.now();
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a shipment
router.delete('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json({ message: 'Shipment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
