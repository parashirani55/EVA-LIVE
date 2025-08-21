const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/db'); // MySQL connection
const authMiddleware = require('../middleware/authMiddleware');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup for file uploads
const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') cb(null, true);
    else cb(new Error('Only CSV files are allowed'));
  },
});

// Helper to run MySQL queries as Promise
const query = (sql, params) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

// Helper to read CSV file
const readCSV = (filePath) =>
  new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });

// ===================== Campaign Routes ===================== //

// GET all campaigns for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const campaigns = await query('SELECT * FROM campaigns WHERE user_id = ?', [req.user.id]);
    res.json(campaigns);
  } catch (err) {
    console.error('GET /api/campaigns error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST create new campaign
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { name, description, voice, script, service, customService, startTime } = req.body;
    const filePath = req.file ? req.file.filename : null;

    const result = await query(
      `INSERT INTO campaigns
      (user_id, name, description, voice, script, file_path, service, custom_service, start_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
      [req.user.id, name, description, voice, script, filePath, service, customService, startTime]
    );

    res.json({ id: result.insertId, message: 'Campaign created', filePath });
  } catch (err) {
    console.error('POST /api/campaigns error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// GET CSV leads for a campaign
router.get('/:id/leads', authMiddleware, async (req, res) => {
  try {
    const campaignId = req.params.id;
    const rows = await query('SELECT file_path FROM campaigns WHERE id = ? AND user_id = ?', [
      campaignId,
      req.user.id,
    ]);
    if (!rows.length || !rows[0].file_path) return res.status(404).json({ error: 'No leads file found' });

    const leads = await readCSV(path.join(uploadDir, rows[0].file_path));
    res.json(leads);
  } catch (err) {
    console.error('Error reading CSV leads:', err);
    res.status(500).json({ error: 'Failed to read leads', details: err.message });
  }
});

// ===================== Twilio & Bulk Call Routes ===================== //

// GET TwiML response for Twilio call (Twilio requires GET)
router.get('/twiml/:campaignId', async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const rows = await query('SELECT script FROM campaigns WHERE id = ?', [campaignId]);
    if (!rows.length) return res.status(404).send('Campaign not found');

    res.type('text/xml');
    res.send(`
      <Response>
        <Connect>
          <Stream url="${process.env.WS_SERVER_URL}/twilio/stream?campaignId=${campaignId}" />
        </Connect>
      </Response>
    `);
  } catch (err) {
    console.error('GET /twiml error:', err);
    res.status(500).send('Server error');
  }
});

// POST bulk call for all leads
// POST bulk call for all leads
// POST bulk call for all leads
router.post("/:id/call-bulk", authMiddleware, async (req, res) => {
  const campaignId = req.params.id;

  try {
    const campaigns = await query(
      "SELECT file_path, name FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );

    if (!campaigns.length || !campaigns[0].file_path) {
      return res.status(404).json({ error: "No leads CSV found for this campaign" });
    }

    const campaignFile = campaigns[0].file_path;
    const leads = await readCSV(path.join(uploadDir, campaignFile));

    if (!leads.length) {
      return res.status(404).json({ error: "CSV file is empty" });
    }

    for (const lead of leads) {
      const customer = lead.name || "Customer";
      const phone = lead.phone;

      // Add first=true to trigger initial greeting
      const twimlUrl = `${process.env.PUBLIC_URL}/twilio/voice?campaignId=${campaignId}&customer=${encodeURIComponent(
        customer
      )}&first=true`;

      // Initiate Twilio call
      const call = await client.calls.create({
        url: twimlUrl,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER,
        statusCallback: `${process.env.PUBLIC_URL}/twilio/status`,
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        statusCallbackMethod: "POST",
      });

      // Save call in database
      await query(
        "INSERT INTO calls (customer, phone, started_at, status, campaign, twilio_sid) VALUES (?, ?, NOW(), ?, ?, ?)",
        [customer, phone, "initiated", campaignId, call.sid]
      );
    }

    res.json({ success: true, message: "Calls initiated with AI assistant" });
  } catch (error) {
    console.error("Error starting campaign calls:", error);
    res.status(500).json({ success: false, error: "Failed to start calls" });
  }
});






// GET all calls for a campaign
router.get('/:id/calls', authMiddleware, async (req, res) => {
  try {
    const calls = await query('SELECT * FROM calls WHERE campaign = ? ORDER BY started_at DESC', [
      req.params.id,
    ]);
    res.json(calls);
  } catch (err) {
    console.error('GET /:id/calls error:', err);
    res.status(500).json({ error: 'Failed to fetch call logs', details: err.message });
  }
});

module.exports = router;
