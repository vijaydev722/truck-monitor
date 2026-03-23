const express = require('express');
const router = express.Router();
const LoadingPlace = require('../models/LoadingPlace');

// Get all loading places
router.get('/', async (req, res) => {
  try {
    const places = await LoadingPlace.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new loading place
router.post('/', async (req, res) => {
  const place = new LoadingPlace(req.body);
  try {
    const newPlace = await place.save();
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a loading place
router.patch('/:id', async (req, res) => {
  try {
    const place = await LoadingPlace.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!place) return res.status(404).json({ message: 'Loading place not found' });
    res.json(place);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a loading place
router.delete('/:id', async (req, res) => {
  try {
    const place = await LoadingPlace.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: 'Loading place not found' });
    res.json({ message: 'Loading place deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
