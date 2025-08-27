const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Status Callback Route
router.post("/status", (req, res) => {
  // Ensure req.body exists
  const { CallStatus, CallSid, CallDuration } = req.body || {};

  if (!CallSid || !CallStatus) {
    console.error("❌ Missing CallSid or CallStatus in Twilio callback:", req.body);
    return res.sendStatus(400);
  }

  console.log("📞 Twilio Status Callback:", { CallSid, CallStatus, CallDuration });

  // Only update duration and ended_at for completed calls
  const query =
    CallStatus === "completed"
      ? "UPDATE calls SET status = ?, duration = ?, ended_at = NOW() WHERE twilio_sid = ?"
      : "UPDATE calls SET status = ?, ended_at = NOW() WHERE twilio_sid = ?";

  const params =
    CallStatus === "completed"
      ? [CallStatus, CallDuration || null, CallSid]
      : [CallStatus, CallSid];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Failed to update call status and duration:", err);
      return res.sendStatus(500);
    }
    console.log(
      `✅ Call status updated for CallSid: ${CallSid}, Status: ${CallStatus}, Duration: ${CallDuration || "N/A"}`
    );
    res.sendStatus(200);
  });
});

module.exports = router;