const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Active Calls API
router.get('/', async (req, res) => {
  try {
    db.query(
      "SELECT * FROM calls WHERE status IN ('Speaking', 'Listening') ORDER BY started_at DESC",
      (err, rows) => {
        if (err) {
          console.error('Error fetching active calls:', err);
          return res.status(500).json({ message: 'Error fetching active calls', error: err.message });
        }

        // Parse transcript into JSON array
        const parsedRows = rows.map(row => {
          let transcript = [];
          try {
            transcript = JSON.parse(row.transcript || "[]");
          } catch (e) {}
          return { ...row, transcript };
        });

        res.json(parsedRows);
      }
    );
  } catch (err) {
    console.error('Error fetching active calls:', err);
    res.status(500).json({ message: 'Error fetching active calls', error: err.message });
  }
});

module.exports = router;
