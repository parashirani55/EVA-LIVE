const express = require('express');
const router = express.Router();
const verifyToken = require('./middleware/authMiddleware');

router.get('/dashboard', verifyToken, (req, res) => {
  // Return dashboard data only if verified
  res.json({ data: 'Protected dashboard data', user: req.user });
});

module.exports = router;