const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
const twilio = require('twilio');

// Create the same database pool as in server.js
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || '3306', // Fixed: was 3310 in server.js
  password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aivoicecaller'
});

// JWT Verification Middleware (same as server.js)
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('Decoded JWT payload:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

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
  console.log('GET /api/campaigns - User ID:', req.user.id);
  
  try {
    const [campaigns] = await db.execute('SELECT * FROM campaigns WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    console.log(`Found ${campaigns.length} campaigns for user ${req.user.id}`);
    res.json(campaigns);
  } catch (err) {
    console.error('GET /api/campaigns error:', err.message, err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST create new campaign
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  console.log('POST /api/campaigns - User ID:', req.user.id);
  console.log('Request body:', req.body);
  console.log('File:', req.file);

  try {
    const { name, description, voice, script, service, customService, startTime } = req.body;
    const filePath = req.file ? req.file.filename : null;

    // Validate required fields
    if (!name || !voice || !startTime) {
      return res.status(400).json({ error: 'Name, voice, and start time are required' });
    }

    // Prepend personalized greeting to the script
    const greetingPrefix = "Hello {username}, I am EVA calling from {company}. ";
    const finalScript = script ? `${greetingPrefix}${script}` : greetingPrefix;

    const [result] = await db.execute(
      `INSERT INTO campaigns
      (user_id, name, description, voice, script, file_path, service, custom_service, start_time, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled', NOW())`,
      [req.user.id, name, description, voice, finalScript, filePath, service, customService, startTime]
    );

    console.log('Campaign created with ID:', result.insertId);
    res.json({ 
      id: result.insertId, 
      message: 'Campaign created successfully', 
      filePath 
    });
  } catch (err) {
    console.error('POST /api/campaigns error:', err.message, err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// PUT update campaign
router.put('/:id', authMiddleware, upload.single('file'), async (req, res) => {
  console.log('PUT /api/campaigns/:id - Campaign ID:', req.params.id, 'User ID:', req.user.id);

  try {
    const campaignId = req.params.id;
    const { name, description, voice, script, service, customService, startTime } = req.body;
    const filePath = req.file ? req.file.filename : null;

    // Verify campaign exists and belongs to user
    const [existing] = await db.execute('SELECT user_id FROM campaigns WHERE id = ? AND user_id = ?', [
      campaignId,
      req.user.id,
    ]);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Campaign not found or unauthorized' });
    }

    // Prepend personalized greeting to the script
    const greetingPrefix = "Hello {username}, I am EVA calling from {company}. ";
    const finalScript = script ? `${greetingPrefix}${script}` : greetingPrefix;

    // Update campaign
    await db.execute(
      `UPDATE campaigns SET
        name = ?, description = ?, voice = ?, script = ?, 
        file_path = COALESCE(?, file_path),
        service = ?, custom_service = ?, start_time = ?, 
        status = 'Scheduled', updated_at = NOW()
      WHERE id = ? AND user_id = ?`,
      [name, description, voice, finalScript, filePath, service, customService, startTime, campaignId, req.user.id]
    );

    res.json({ message: 'Campaign updated successfully' });
  } catch (err) {
    console.error('PUT /api/campaigns/:id error:', err.message, err.stack);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// GET CSV leads for a campaign
router.get('/:id/leads', authMiddleware, async (req, res) => {
  console.log('GET /api/campaigns/:id/leads - Campaign ID:', req.params.id);

  try {
    const campaignId = req.params.id;
    const [rows] = await db.execute('SELECT file_path FROM campaigns WHERE id = ? AND user_id = ?', [
      campaignId,
      req.user.id,
    ]);
    
    if (rows.length === 0 || !rows[0].file_path) {
      return res.status(404).json({ error: 'No leads file found for this campaign' });
    }

    const csvPath = path.join(uploadDir, rows[0].file_path);
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'Leads file not found on server' });
    }

    const leads = await readCSV(csvPath);
    res.json(leads);
  } catch (err) {
    console.error('Error reading CSV leads:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to read leads', details: err.message });
  }
});

// POST bulk call for all leads
router.post("/:id/call-bulk", authMiddleware, async (req, res) => {
  const campaignId = req.params.id;
  console.log('POST /api/campaigns/:id/call-bulk - Campaign ID:', campaignId);

  try {
    const [campaigns] = await db.execute(
      "SELECT file_path, script FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );

    if (campaigns.length === 0 || !campaigns[0].file_path) {
      return res.status(404).json({ error: "No leads CSV found for this campaign" });
    }

    const campaignFile = campaigns[0].file_path;
    const script = campaigns[0].script || "Hello {username}, I am EVA calling from {company}.";
    const companyName = req.user.company || "Our Company";

    const csvPath = path.join(uploadDir, campaignFile);
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: "Leads file not found on server" });
    }

    const leads = await readCSV(csvPath);
    if (!leads.length) {
      return res.status(404).json({ error: "CSV file is empty" });
    }

    // Verify CSV has 'name' and 'phone' columns
    if (!leads[0].hasOwnProperty("name") || !leads[0].hasOwnProperty("phone")) {
      return res.status(400).json({ error: "CSV file must contain 'name' and 'phone' columns" });
    }

    let successCount = 0;
    let errorCount = 0;

    for (const lead of leads) {
      try {
        const customer = lead.name || "Customer";
        const phone = lead.phone;
        
        if (!phone) {
          console.warn(`Skipping lead with missing phone number for ${customer}`);
          errorCount++;
          continue;
        }

        // Personalize the script
        const personalizedScript = script
          .replace(/\{username\}/g, customer)
          .replace(/\{company\}/g, companyName);

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
        await db.execute(
          "INSERT INTO calls (customer, phone, started_at, status, campaign, twilio_sid, ai_message, created_at) VALUES (?, ?, NOW(), ?, ?, ?, ?, NOW())",
          [customer, phone, "initiated", campaignId, call.sid, personalizedScript]
        );

        successCount++;
      } catch (leadError) {
        console.error(`Error processing lead ${lead.name}:`, leadError);
        errorCount++;
      }
    }

    res.json({ 
      success: true, 
      message: `Bulk call completed. ${successCount} calls initiated, ${errorCount} errors.`,
      successCount,
      errorCount
    });
  } catch (error) {
    console.error("Error starting campaign calls:", error.message, error.stack);
    res.status(500).json({ success: false, error: "Failed to start calls", details: error.message });
  }
});

// GET all calls for a campaign
router.get('/:id/calls', authMiddleware, async (req, res) => {
  console.log('GET /api/campaigns/:id/calls - Campaign ID:', req.params.id);

  try {
    // Verify campaign belongs to user first
    const [campaign] = await db.execute('SELECT id FROM campaigns WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id
    ]);

    if (campaign.length === 0) {
      return res.status(404).json({ error: 'Campaign not found or unauthorized' });
    }

    const [calls] = await db.execute('SELECT * FROM calls WHERE campaign = ? ORDER BY started_at DESC', [
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
  console.log('GET /api/campaigns/twiml/:campaignId - Campaign ID:', req.params.campaignId);

  try {
    const campaignId = req.params.campaignId;
    const customer = req.query.customer || 'Customer';
    
    const [rows] = await db.execute('SELECT script, user_id, file_path FROM campaigns WHERE id = ?', [campaignId]);
    if (rows.length === 0) {
      return res.status(404).send('Campaign not found');
    }

    // Fetch company name
    const [userRow] = await db.execute('SELECT company FROM users WHERE id = ? LIMIT 1', [rows[0].user_id]);
    const companyName = userRow?.[0]?.company || 'Our Company';

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
