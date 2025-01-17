const express = require('express');
const { loginUser, signupUser } = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/register', signupUser); // Make sure to use the correct case

// Login route
router.post('/login', loginUser);

module.exports = router;
