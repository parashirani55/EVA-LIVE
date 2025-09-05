const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/db'); // MySQL connection
const authMiddleware = require('../middleware/authMiddleware');
const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../Uploads');
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
    console.error('GET /api/campaigns error:', err.message, err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST create new campaign
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { name, description, voice, script, service, customService, startTime } = req.body;
    const filePath = req.file ? req.file.filename : null;

    // Prepend personalized greeting to the script
    const greetingPrefix = "Hello {username}, I am EVA calling from {company}. ";
    const finalScript = script ? `${greetingPrefix}${script}` : greetingPrefix;

    const result = await query(
      `INSERT INTO campaigns
      (user_id, name, description, voice, script, file_path, service, custom_service, start_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
      [req.user.id, name, description, voice, finalScript, filePath, service, customService, startTime]
    );

    res.json({ id: result.insertId, message: 'Campaign created', filePath });
  } catch (err) {
    console.error('POST /api/campaigns error:', err.message, err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// PUT update campaign
router.put('/:id', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const campaignId = req.params.id;
    const { name, description, voice, script, service, customService, startTime } = req.body;
    const filePath = req.file ? req.file.filename : null;

    // Prepend personalized greeting to the script
    const greetingPrefix = "Hello {username}, I am EVA calling from {company}. ";
    const finalScript = script ? `${greetingPrefix}${script}` : greetingPrefix;

    // Verify campaign exists and belongs to user
    const [existing] = await query('SELECT user_id FROM campaigns WHERE id = ? AND user_id = ?', [
      campaignId,
      req.user.id,
    ]);
    if (!existing) return res.status(404).json({ error: 'Campaign not found or unauthorized' });

    // Update campaign
    await query(
      `UPDATE campaigns SET
        name = ?, description = ?, voice = ?, script = ?, file_path = COALESCE(?, file_path),
        service = ?, custom_service = ?, start_time = ?, status = 'Scheduled'
      WHERE id = ?`,
      [name, description, voice, finalScript, filePath, service, customService, startTime, campaignId]
    );

    res.json({ message: 'Campaign updated' });
  } catch (err) {
    console.error('PUT /api/campaigns/:id error:', err.message, err.stack);
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
    console.error('Error reading CSV leads:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to read leads', details: err.message });
  }
});

// ===================== Twilio & Bulk Call Routes ===================== //

// POST bulk call for all leads
// POST bulk call for all leads
router.post("/:id/call-bulk", authMiddleware, async (req, res) => {
  const campaignId = req.params.id;

  try {
    const campaigns = await query(
      "SELECT file_path, script FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );

    if (!campaigns.length || !campaigns[0].file_path) {
      return res.status(404).json({ error: "No leads CSV found for this campaign" });
    }

    const campaignFile = campaigns[0].file_path;
    const script = campaigns[0].script || "Hello {username}, I am EVA calling from {company}.";
    const companyName = req.user.company || "Our Company";

    const leads = await readCSV(path.join(uploadDir, campaignFile));
    if (!leads.length) return res.status(404).json({ error: "CSV file is empty" });

    // Verify CSV has 'name' and 'phone' columns
    if (!leads[0].hasOwnProperty("name") || !leads[0].hasOwnProperty("phone")) {
      return res.status(400).json({ error: "CSV file must contain 'name' and 'phone' columns" });
    }

    for (const lead of leads) {
      const customer = lead.name || "Customer";
      const phone = lead.phone;
      if (!phone) {
        console.warn(`Skipping lead with missing phone number for ${customer}`);
        continue;
      }

      // Personalize the script
      const personalizedScript = script
        .replace("{username}", customer)
        .replace("{company}", companyName);

      // Twilio voice URL with personalized greeting
      const twimlUrl = `${process.env.PUBLIC_URL}/twilio/voice?customer=${encodeURIComponent(
        customer
      )}&company=${encodeURIComponent(companyName)}&campaignId=${campaignId}`;

      console.log("Initiating call with TwiML URL:", twimlUrl);

      // Initiate Twilio call
      const call = await client.calls.create({
        url: twimlUrl,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER,
        statusCallback: `${process.env.PUBLIC_URL}/twilio/status`,
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        statusCallbackMethod: "POST",
      });

      // Save call in database with personalized script in ai_message
      await query(
        "INSERT INTO calls (customer, phone, started_at, status, campaign, twilio_sid, ai_message) VALUES (?, ?, NOW(), ?, ?, ?, ?)",
        [customer, phone, "initiated", campaignId, call.sid, personalizedScript]
      );
    }

    res.json({ success: true, message: "Calls initiated with personalized greetings" });
  } catch (error) {
    console.error("Error starting campaign calls:", error.message, error.stack);
    res.status(500).json({ success: false, error: "Failed to start calls", details: error.message });
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
    console.error('GET /:id/calls error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch call logs', details: err.message });
  }
});

// GET TwiML response for Twilio stream
router.get('/twiml/:campaignId', async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const customer = req.query.customer || 'Customer'; // Use query param if provided
    const rows = await query('SELECT script, user_id, file_path FROM campaigns WHERE id = ?', [campaignId]);
    if (!rows.length) return res.status(404).send('Campaign not found');

    // Fetch company name
    const [userRow] = await query('SELECT company FROM users WHERE id = ? LIMIT 1', [rows[0].user_id]);
    const companyName = userRow?.company || 'Our Company';

    res.type('text/xml');
    res.send(`
      <Response>
        <Connect>
          <Stream url="${process.env.WS_SERVER_URL}/twilio/stream?campaignId=${campaignId}&customer=${encodeURIComponent(customer)}&company=${encodeURIComponent(companyName)}" />
        </Connect>
      </Response>
    `);
  } catch (err) {
    console.error('GET /twiml error:', err.message, err.stack);
    res.status(500).send('Server error');
  }
});

module.exports = router;
