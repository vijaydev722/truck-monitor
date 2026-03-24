const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Standardized login endpoint receiving role, phone, password, location
router.post('/login', authController.loginUser);

// Seed an initial admin if non-existent
router.post('/seed-admin', authController.seedAdmin);

// Signup endpoint
router.post('/signup', authController.signupUser);

module.exports = router;
