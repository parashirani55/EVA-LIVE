const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/db"); // MySQL connection
const authMiddleware = require("../middleware/authMiddleware");
const twilio = require("twilio");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const axios = require("axios"); // ✅ Added import

// Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL_BACK || "http://135.237.127.43:5000";

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../Uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup for file uploads
const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") cb(null, true);
    else cb(new Error("Only CSV files are allowed"));
  },
});

// Helper to run MySQL queries as Promise
const query = (sql, params) =>
  new Promise((resolve, reject) => {
    console.log("[DB QUERY]", sql, params);
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("[DB ERROR]", err.message);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

// Helper to read CSV file
const readCSV = (filePath) =>
  new Promise((resolve, reject) => {
    console.log("[CSV READ]", filePath);
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("[CSV PARSED]", results.length, "records");
        resolve(results);
      })
      .on("error", (err) => {
        console.error("[CSV ERROR]", err.message);
        reject(err);
      });
  });

// ===================== Campaign Routes ===================== //

// GET all campaigns for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("[GET] Fetching campaigns for user", req.user.id);
    const campaigns = await query("SELECT * FROM campaigns WHERE user_id = ?", [
      req.user.id,
    ]);
    res.json(campaigns);
  } catch (err) {
    console.error("[ERROR] GET /api/campaigns:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// POST create new campaign
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    console.log("[POST] Creating campaign for user", req.user.id);
    const { name, description, voice, script, service, customService, startTime } =
      req.body;
    const filePath = req.file ? req.file.filename : null;

    // Prepend personalized greeting to the script
    const greetingPrefix = "Hello {username}, I am EVA calling from {company}. ";
    const finalScript = script ? `${greetingPrefix}${script}` : greetingPrefix;

    const result = await query(
      `INSERT INTO campaigns
      (user_id, name, description, voice, script, file_path, service, custom_service, start_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
      [
        req.user.id,
        name,
        description,
        voice,
        finalScript,
        filePath,
        service,
        customService,
        startTime,
      ]
    );

    console.log("[DB INSERT] New campaign created with ID", result.insertId);
    res.json({ id: result.insertId, message: "Campaign created", filePath });
  } catch (err) {
    console.error("[ERROR] POST /api/campaigns:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// PUT update campaign
router.put("/:id", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const campaignId = req.params.id;
    console.log("[PUT] Updating campaign", campaignId, "by user", req.user.id);

    const { name, description, voice, script, service, customService, startTime } =
      req.body;
    const filePath = req.file ? req.file.filename : null;

    const greetingPrefix = "Hello {username}, I am EVA calling from {company}. ";
    const finalScript = script ? `${greetingPrefix}${script}` : greetingPrefix;

    const [existing] = await query(
      "SELECT user_id FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );
    if (!existing)
      return res.status(404).json({ error: "Campaign not found or unauthorized" });

    await query(
      `UPDATE campaigns SET
        name = ?, description = ?, voice = ?, script = ?, file_path = COALESCE(?, file_path),
        service = ?, custom_service = ?, start_time = ?, status = 'Scheduled'
      WHERE id = ?`,
      [
        name,
        description,
        voice,
        finalScript,
        filePath,
        service,
        customService,
        startTime,
        campaignId,
      ]
    );

    console.log("[DB UPDATE] Campaign updated", campaignId);
    res.json({ message: "Campaign updated" });
  } catch (err) {
    console.error("[ERROR] PUT /api/campaigns/:id:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET CSV leads for a campaign
router.get("/:id/leads", authMiddleware, async (req, res) => {
  try {
    const campaignId = req.params.id;
    console.log("[GET] Leads for campaign", campaignId);

    const rows = await query(
      "SELECT file_path FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );
    if (!rows.length || !rows[0].file_path)
      return res.status(404).json({ error: "No leads file found" });

    const leads = await readCSV(path.join(uploadDir, rows[0].file_path));
    res.json(leads);
  } catch (err) {
    console.error("[ERROR] GET /:id/leads:", err.message);
    res.status(500).json({ error: "Failed to read leads", details: err.message });
  }
});

// ===================== Twilio & Bulk Call Routes ===================== //

// POST bulk call for all leads
router.post("/:id/call-bulk", authMiddleware, async (req, res) => {
  const campaignId = req.params.id;
  console.log("[POST] Bulk call started for campaign", campaignId);

  try {
    const campaigns = await query(
      "SELECT file_path, script FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );

    if (!campaigns.length || !campaigns[0].file_path) {
      return res
        .status(404)
        .json({ error: "No leads CSV found for this campaign" });
    }

    const campaignFile = campaigns[0].file_path;
    const script =
      campaigns[0].script || "Hello {username}, I am EVA calling from {company}.";
    const companyName = req.user.company || "Our Company";

    const leads = await readCSV(path.join(uploadDir, campaignFile));
    if (!leads.length) return res.status(404).json({ error: "CSV file is empty" });

    if (!leads[0].hasOwnProperty("name") || !leads[0].hasOwnProperty("phone")) {
      return res
        .status(400)
        .json({ error: "CSV file must contain 'name' and 'phone' columns" });
    }

    for (const lead of leads) {
      const customer = lead.name || "Customer";
      const phone = lead.phone;
      if (!phone) {
        console.warn("[SKIP] Missing phone number for", customer);
        continue;
      }

      const personalizedScript = script
        .replace("{username}", customer)
        .replace("{company}", companyName);

      const twimlUrl = `${process.env.PUBLIC_URL}/api/campaigns/twiml/${campaignId}?customer=${encodeURIComponent(
        customer
      )}&company=${encodeURIComponent(companyName)}`;

      console.log("[TWILIO CALL] Customer:", customer, "Phone:", phone);

      const call = await client.calls.create({
        url: twimlUrl,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER,
        statusCallback: `${process.env.PUBLIC_URL}/twilio/status`,
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        statusCallbackMethod: "POST",
      });

      console.log("[TWILIO RESPONSE] Call SID:", call.sid);

      await query(
        "INSERT INTO calls (customer, phone, started_at, status, campaign, twilio_sid, ai_message) VALUES (?, ?, NOW(), ?, ?, ?, ?)",
        [customer, phone, "initiated", campaignId, call.sid, personalizedScript]
      );
    }

    res.json({ success: true, message: "Calls initiated with personalized greetings" });
  } catch (error) {
    console.error("[ERROR] Bulk call failed:", error.message);
    res.status(500).json({ success: false, error: "Failed to start calls", details: error.message });
  }
});

// GET all calls for a campaign
router.get("/:id/calls", authMiddleware, async (req, res) => {
  try {
    console.log("[GET] Calls for campaign", req.params.id);
    const calls = await query(
      "SELECT * FROM calls WHERE campaign = ? ORDER BY started_at DESC",
      [req.params.id]
    );
    res.json(calls);
  } catch (err) {
    console.error("[ERROR] GET /:id/calls:", err.message);
    res.status(500).json({ error: "Failed to fetch call logs", details: err.message });
  }
});

// GET TwiML response for Twilio stream
router.get("/twiml/:campaignId", async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const customer = req.query.customer || "Customer";
    console.log("[GET] TwiML for campaign", campaignId, "customer", customer);

    const rows = await query(
      "SELECT script, user_id, file_path FROM campaigns WHERE id = ?",
      [campaignId]
    );
    if (!rows.length) return res.status(404).send("Campaign not found");

    const [userRow] = await query(
      "SELECT company FROM users WHERE id = ? LIMIT 1",
      [rows[0].user_id]
    );
    const companyName = userRow?.company || "Our Company";

    res.type("text/xml");
    res.send(`
      <Response>
        <Connect>
          <Stream url="${process.env.WS_SERVER_URL}/twilio/stream?campaignId=${campaignId}&customer=${encodeURIComponent(
      customer
    )}&company=${encodeURIComponent(companyName)}" />
        </Connect>
      </Response>
    `);
  } catch (err) {
    console.error("[ERROR] GET /twiml:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
