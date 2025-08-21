const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// POST /api/register
router.post('/register', registerUser);

// POST /api/login
router.post('/login', loginUser);

// GET /api/user
router.get('/user', verifyToken, getUser);

module.exports = router;