// routes/conversationCampaign.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const twilio = require('twilio');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const uploadDir = path.join(__dirname, '../uploads');

// Read CSV helper
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Bulk conversational calls
router.post('/:id/call-bulk', async (req, res) => {
  try {
    const campaignId = req.params.id;
    const [rows] = await db.execute('SELECT script, file_path FROM campaigns WHERE id=?', [campaignId]);
    if (!rows.length) return res.status(404).json({ error: "Campaign not found" });

    const campaign = rows[0];
    const leads = await readCSV(path.join(uploadDir, campaign.file_path));
    const results = [];

    for (const lead of leads) {
      const phone = lead.phone || lead.number;
      const customer = lead.customer || lead.name || null;
      if (!phone) continue;

      try {
        const call = await client.calls.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
          url: `${req.protocol}://${req.get('host')}/conversation/voice?campaign=${campaignId}&customer=${encodeURIComponent(customer || '')}&script=${encodeURIComponent(campaign.script)}`,
          statusCallback: `${req.protocol}://${req.get('host')}/conversation/status`,
          statusCallbackEvent: ["initiated", "ringing", "answered", "completed"]
        });

        await db.execute(
          `INSERT INTO calls (customer, phone, started_at, status, campaign, ai_message, transcript, twilio_sid)
           VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)`,
          [customer, phone, call.status, campaignId, campaign.script, '[]', call.sid]
        );

        results.push({ phone, sid: call.sid, status: call.status });
      } catch (err) {
        results.push({ phone, error: err.message });
      }
    }

    res.json({ message: "Bulk conversational calls started", results });
  } catch (err) {
    console.error("Bulk Conversation Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
