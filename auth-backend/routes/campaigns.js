// routes/campaign.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/db"); // MySQL pool
const authMiddleware = require("../middleware/authMiddleware");
const twilio = require("twilio");
const VoiceResponse = require("twilio").twiml.VoiceResponse;

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ===================== Setup ===================== //
const uploadDir = path.join(__dirname, "../Uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") cb(null, true);
    else cb(new Error("Only CSV files are allowed"));
  },
});

// Run query with logging
const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    console.log("🟡 SQL QUERY:", sql, "PARAMS:", params);
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("❌ SQL ERROR:", err.message);
        return reject(err);
      }
      console.log("✅ SQL RESULT:", results);
      resolve(results);
    });
  });

// Read CSV file with logging
const readCSV = (filePath) =>
  new Promise((resolve, reject) => {
    console.log("📂 Reading CSV:", filePath);
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("✅ CSV loaded:", results.length, "rows");
        resolve(results);
      })
      .on("error", (err) => {
        console.error("❌ CSV read error:", err.message);
        reject(err);
      });
  });

// ===================== Campaign Routes ===================== //

// GET all campaigns
router.get("/", authMiddleware, async (req, res) => {
  console.log("📡 GET /api/campaigns by user:", req.user.id);
  try {
    const campaigns = await query(
      "SELECT * FROM campaigns WHERE user_id = ?",
      [req.user.id]
    );
    res.json(campaigns);
  } catch (err) {
    console.error("❌ GET campaigns error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// POST create campaign
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  console.log("📡 POST /api/campaigns body:", req.body);
  try {
    const { name, description, voice, script, service, customService, startTime } =
      req.body;
    const filePath = req.file ? req.file.filename : null;

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

    console.log("✅ Campaign created:", result.insertId);
    res.json({ id: result.insertId, message: "Campaign created", filePath });
  } catch (err) {
    console.error("❌ POST campaign error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// PUT update campaign
router.put("/:id", authMiddleware, upload.single("file"), async (req, res) => {
  console.log("📡 PUT /api/campaigns/:id body:", req.body);
  try {
    const campaignId = req.params.id;
    const { name, description, voice, script, service, customService, startTime } =
      req.body;
    const filePath = req.file ? req.file.filename : null;

    const greetingPrefix = "Hello {username}, I am EVA calling from {company}. ";
    const finalScript = script ? `${greetingPrefix}${script}` : greetingPrefix;

    const [existing] = await query(
      "SELECT user_id FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );
    if (!existing) {
      console.warn("⚠️ Campaign not found:", campaignId);
      return res
        .status(404)
        .json({ error: "Campaign not found or unauthorized" });
    }

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

    console.log("✅ Campaign updated:", campaignId);
    res.json({ message: "Campaign updated" });
  } catch (err) {
    console.error("❌ PUT campaign error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET leads from CSV
router.get("/:id/leads", authMiddleware, async (req, res) => {
  console.log("📡 GET /api/campaigns/:id/leads");
  try {
    const campaignId = req.params.id;
    const rows = await query(
      "SELECT file_path FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );

    if (!rows.length || !rows[0].file_path) {
      console.warn("⚠️ No leads file for campaign:", campaignId);
      return res.status(404).json({ error: "No leads file found" });
    }

    const leads = await readCSV(path.join(uploadDir, rows[0].file_path));
    res.json(leads);
  } catch (err) {
    console.error("❌ GET leads error:", err);
    res.status(500).json({ error: "Failed to read leads", details: err.message });
  }
});

// ===================== Twilio Bulk Calls ===================== //
router.post("/:id/call-bulk", authMiddleware, async (req, res) => {
  const campaignId = req.params.id;
  console.log("📡 POST bulk call for campaign:", campaignId);

  try {
    const campaigns = await query(
      "SELECT file_path, script FROM campaigns WHERE id = ? AND user_id = ?",
      [campaignId, req.user.id]
    );

    if (!campaigns.length || !campaigns[0].file_path) {
      console.warn("⚠️ No CSV for campaign:", campaignId);
      return res.status(404).json({ error: "No leads CSV found" });
    }

    const { file_path: campaignFile, script } = campaigns[0];
    const companyName = req.user.company || "Our Company";

    const leads = await readCSV(path.join(uploadDir, campaignFile));
    if (!leads.length) {
      console.warn("⚠️ Empty CSV:", campaignId);
      return res.status(404).json({ error: "CSV file is empty" });
    }

    if (!("name" in leads[0]) || !("phone" in leads[0])) {
      console.error("❌ CSV missing name/phone columns");
      return res
        .status(400)
        .json({ error: "CSV must contain 'name' and 'phone' columns" });
    }

    for (const lead of leads) {
      const customer = lead.name || "Customer";
      const phone = lead.phone;
      if (!phone) {
        console.warn("⚠️ Skipping missing phone for", customer);
        continue;
      }

      const personalizedScript = (script || "").replace(
        "{username}",
        customer
      ).replace("{company}", companyName);

      const twimlUrl = `${process.env.PUBLIC_URL}/api/campaigns/twiml/${campaignId}?customer=${encodeURIComponent(
        customer
      )}&company=${encodeURIComponent(companyName)}`;

      console.log("📞 Calling:", phone, "→ TwiML URL:", twimlUrl);

      try {
        const call = await client.calls.create({
          url: twimlUrl,
          to: phone,
          from: process.env.TWILIO_PHONE_NUMBER,
          statusCallback: `${process.env.PUBLIC_URL}/twilio/status`,
          statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
          statusCallbackMethod: "POST",
        });

        console.log("✅ Twilio call SID:", call.sid);

        await query(
          "INSERT INTO calls (customer, phone, started_at, status, campaign, twilio_sid, ai_message) VALUES (?, ?, NOW(), ?, ?, ?, ?)",
          [customer, phone, "initiated", campaignId, call.sid, personalizedScript]
        );

        console.log("💾 Call saved:", customer, phone);
      } catch (err) {
        console.error("❌ Twilio error for", phone, ":", err.message);
      }
    }

    console.log("🎉 Bulk calls done:", campaignId);
    res.json({ success: true, message: "Calls initiated" });
  } catch (err) {
    console.error("❌ Bulk call error:", err);
    res.status(500).json({ error: "Failed to start calls", details: err.message });
  }
});

// GET calls for a campaign
router.get("/:id/calls", authMiddleware, async (req, res) => {
  console.log("📡 GET calls for campaign:", req.params.id);
  try {
    const calls = await query(
      "SELECT * FROM calls WHERE campaign = ? ORDER BY started_at DESC",
      [req.params.id]
    );
    res.json(calls);
  } catch (err) {
    console.error("❌ GET calls error:", err);
    res.status(500).json({ error: "Failed to fetch call logs" });
  }
});

// GET TwiML for Twilio
router.get("/twiml/:campaignId", async (req, res) => {
  console.log("📡 GET TwiML for campaign:", req.params.campaignId);
  try {
    const campaignId = req.params.campaignId;
    const customer = req.query.customer || "Customer";

    const rows = await query(
      "SELECT script, user_id FROM campaigns WHERE id = ?",
      [campaignId]
    );
    if (!rows.length) {
      console.warn("⚠️ Campaign not found:", campaignId);
      return res.status(404).send("Campaign not found");
    }

    const [userRow] = await query(
      "SELECT company FROM users WHERE id = ? LIMIT 1",
      [rows[0].user_id]
    );
    const companyName = userRow?.company || "Our Company";

    res.type("text/xml");
    const xml = `
      <Response>
        <Connect>
          <Stream url="${process.env.WS_SERVER_URL}/twilio/stream?campaignId=${campaignId}&customer=${encodeURIComponent(
      customer
    )}&company=${encodeURIComponent(companyName)}" />
        </Connect>
      </Response>
    `;
    console.log("✅ Sending TwiML XML:", xml);
    res.send(xml);
  } catch (err) {
    console.error("❌ TwiML error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
