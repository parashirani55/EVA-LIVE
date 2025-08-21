const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Call History API
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM calls WHERE status NOT IN ('Speaking', 'Listening') ORDER BY started_at DESC"
    );

    // 🔹 Parse transcript from string -> JSON array
    const parsedRows = rows.map(row => {
      let transcript = [];
      try {
        transcript = JSON.parse(row.transcript || "[]");
      } catch (e) {}
      return { ...row, transcript };
    });

    res.json(parsedRows);
  } catch (err) {
    console.error('Error fetching call history:', err);
    res.status(500).json({ message: 'Error fetching call history', error: err.message });
  }
});

module.exports = router;
