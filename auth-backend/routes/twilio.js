// backend/routes/twilio.js
const express = require("express");
const twilio = require("twilio");
const OpenAI = require("openai");
const db = require("../config/db");

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;

// Public URL for Twilio callbacks
const BASE_URL = process.env.PUBLIC_URL || "https://your-ngrok-url.ngrok-free.app";

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

// ---------- 1️⃣ Initial Voice Route ----------
router.post("/voice", (req, res) => {
  const { campaignId, customer, first } = req.query;
  const twiml = new VoiceResponse();

  // Short intro pause
  twiml.pause({ length: 1 });

  // Prompt user to speak (press any key style)
  twiml.say(
    { voice: "alice" },
    first === "true"
      ? "Hi, this is Eva from Royal Aire. How are you today?"
      : "I'm still here. When you are ready, please speak after the beep."
  );

  // Beep simulation
  twiml.pause({ length: 1 });

  // Gather speech input
  const gather = twiml.gather({
    input: "speech",
    action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${customer}`,
    method: "POST",
    timeout: 5,
    speechTimeout: "auto"
  });

  gather.say({ voice: "alice" }, "Go ahead.");

  // Safety redirect if no speech detected
  twiml.redirect(`${BASE_URL}/twilio/voice?campaignId=${campaignId}&customer=${customer}&first=false`);

  res.type("text/xml");
  res.send(twiml.toString());
});

// ---------- 2️⃣ Response Route ----------
router.post("/response", async (req, res) => {
  const { SpeechResult, CallSid } = req.body;
  const { campaignId, customer } = req.query;

  console.log("👂 User said:", SpeechResult);

  let aiResponse = "Sorry, I didn’t get that. Can you repeat?";
  const userText = (SpeechResult || "").toLowerCase();

  const exitKeywords = ["bye", "goodbye", "thank you", "thanks"];
  const shouldHangup = exitKeywords.some(word => userText.includes(word));

  if (shouldHangup) {
    aiResponse = "Okay, thank you for your time. Have a great day!";
  } else if (SpeechResult) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Eva, an AI call assistant for Royal Aire. Keep answers short and conversational." },
          { role: "user", content: SpeechResult }
        ]
      });
      aiResponse = completion.choices[0].message.content?.trim() || aiResponse;
    } catch (err) {
      console.error("AI Error:", err.message);
    }
  }

  // Save transcript to DB
  db.query(
    `SELECT transcript FROM calls WHERE twilio_sid = ? LIMIT 1`,
    [CallSid],
    (err, results) => {
      if (!err && results.length > 0) {
        let transcript = [];
        try {
          transcript = JSON.parse(results[0].transcript || "[]");
        } catch (e) {}
        if (SpeechResult) transcript.push({ from: "User", text: SpeechResult });
        transcript.push({ from: "AI", text: aiResponse });

        db.query(
          `UPDATE calls SET transcript = ? WHERE twilio_sid = ?`,
          [JSON.stringify(transcript), CallSid],
          (err2) => { if (err2) console.error("Transcript Save Error:", err2); }
        );
      }
    }
  );

  const twiml = new VoiceResponse();

  if (shouldHangup) {
    twiml.say({ voice: "alice" }, aiResponse);
    twiml.hangup();
  } else {
    // Repeat gather for smooth conversation
    const gather = twiml.gather({
      input: "speech",
      action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${customer}`,
      method: "POST",
      timeout: 5,
      speechTimeout: "auto"
    });

    // AI speaks next
    gather.say({ voice: "alice" }, aiResponse);

    // Safety redirect in case gather fails
    twiml.redirect(`${BASE_URL}/twilio/voice?campaignId=${campaignId}&customer=${customer}&first=false`);
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// ---------- 3️⃣ Call Status Callback ----------
router.post("/status", (req, res) => {
  const { CallSid, CallStatus } = req.body;
  console.log("📞 Call Status Update:", CallSid, CallStatus);

  db.query(
    "UPDATE calls SET status = ? WHERE twilio_sid = ?",
    [CallStatus, CallSid],
    (err) => { if (err) console.error("Status Update Error:", err); }
  );

  res.sendStatus(200);
});

module.exports = router;
