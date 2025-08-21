const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Status Callback Route
router.post("/status", (req, res) => {
  // Ensure req.body exists
  const { CallStatus, CallSid } = req.body || {};

  if (!CallSid || !CallStatus) {
    console.error("❌ Missing CallSid or CallStatus in Twilio callback:", req.body);
    return res.sendStatus(400);
  }

  console.log("📞 Twilio Status Callback:", CallStatus, CallSid);

  db.query(
    "UPDATE calls SET status = ?, ended_at = NOW() WHERE twilio_sid = ?",
    [CallStatus, CallSid],
    (err, results) => {
      if (err) {
        console.error("❌ Failed to update call status:", err);
        return res.sendStatus(500);
      }
      console.log("✅ Call status updated successfully for CallSid:", CallSid);
      res.sendStatus(200);
    }
  );
});

module.exports = router;
