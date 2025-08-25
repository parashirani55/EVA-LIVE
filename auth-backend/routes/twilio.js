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
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

// ---------- 1️⃣ Initial Voice Route ----------
router.post("/voice", async (req, res) => {
  const { campaignId, customer, first, company } = req.query;
  console.log("Voice route query:", { campaignId, customer, first, company });
  const twiml = new VoiceResponse();

  try {
    // Validate query parameters
    if (!campaignId || !customer) {
      throw new Error("Missing campaignId or customer in query parameters");
    }

    // Fetch campaign script and user company from DB
    const [campaign] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT script, user_id FROM campaigns WHERE id = ? LIMIT 1",
        [campaignId],
        (err, results) => {
          console.log("Campaign query:", { err, results });
          err ? reject(err) : resolve(results);
        }
      );
    });

    if (!campaign) {
      throw new Error(`Campaign not found for ID: ${campaignId}`);
    }

    // Fetch company name (use query param if provided, else DB)
    let companyName = company;
    if (!companyName) {
      const [userRow] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT company FROM users WHERE id = ? LIMIT 1",
          [campaign.user_id],
          (err, results) => {
            console.log("User query:", { err, results });
            err ? reject(err) : resolve(results);
          }
        );
      });
      companyName = userRow?.company || "Our Company";
    }

    // Personalize script
    const scriptTemplate = campaign.script || "Hello {username}, I am EVA calling from {company}.";
    const personalizedScript = scriptTemplate
      .replace(/{username}/g, customer || "Customer")
      .replace(/{company}/g, companyName);

    twiml.pause({ length: 1 });
    twiml.say({ voice: "alice" }, personalizedScript);
    twiml.say({ voice: "alice" }, "What topic would you like to discuss today?");
    twiml.pause({ length: 1 });

    // Gather user speech
    const gather = twiml.gather({
      input: "speech",
      action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(customer)}&company=${encodeURIComponent(companyName)}`,
      method: "POST",
      timeout: 5,
      speechTimeout: "auto",
    });

    // Redirect safety if no speech
    twiml.redirect(
      `${BASE_URL}/twilio/voice?campaignId=${campaignId}&customer=${encodeURIComponent(customer)}&company=${encodeURIComponent(companyName)}&first=false`
    );
  } catch (err) {
    console.error("Voice Route Error:", err.message, err.stack);
    twiml.say({ voice: "alice" }, "Sorry, there was an error starting the call. Please try again.");
    twiml.hangup();
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// ---------- 2️⃣ Response Route ----------
router.post("/response", async (req, res) => {
  const { SpeechResult, CallSid } = req.body;
  const { campaignId, customer, company } = req.query;
  console.log("Response route:", { SpeechResult, CallSid, campaignId, customer, company });
  const twiml = new VoiceResponse();

  let aiResponse = "Sorry, I didn’t get that. Can you repeat the topic?";

  try {
    // Validate inputs
    if (!campaignId || !customer) {
      throw new Error("Missing campaignId or customer in query parameters");
    }

    // Fetch campaign and user company
    const [campaign] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT script, user_id FROM campaigns WHERE id = ? LIMIT 1",
        [campaignId],
        (err, results) => {
          console.log("Campaign query in response:", { err, results });
          err ? reject(err) : resolve(results);
        }
      );
    });
    if (!campaign) throw new Error(`Campaign not found for ID: ${campaignId}`);

    let companyName = company;
    if (!companyName) {
      const [userRow] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT company FROM users WHERE id = ? LIMIT 1",
          [campaign.user_id],
          (err, results) => {
            console.log("User query in response:", { err, results });
            err ? reject(err) : resolve(results);
          }
        );
      });
      companyName = userRow?.company || "Our Company";
    }

    const personalizedScript = (campaign.script || "Hello {username}, I am EVA calling from {company}.")
      .replace(/{username}/g, customer || "Customer")
      .replace(/{company}/g, companyName);

    const exitKeywords = ["bye", "goodbye", "thank you", "thanks"];
    const userText = (SpeechResult || "").toLowerCase();
    const shouldHangup = exitKeywords.some((word) => userText.includes(word));

    if (shouldHangup) {
      aiResponse = "Okay, thank you for your time. Have a great day!";
      twiml.say({ voice: "alice" }, aiResponse);
      twiml.hangup();
    } else if (SpeechResult) {
      // OpenAI generates reply
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Eva, an AI assistant for ${companyName}. The call started with: "${personalizedScript}". The user provided a topic: "${SpeechResult}". Respond conversationally, addressing their topic and keeping the response relevant to the campaign script. Keep answers short and engaging.`,
            },
            { role: "user", content: SpeechResult },
          ],
        });
        aiResponse = completion.choices[0].message.content?.trim() || aiResponse;
      } catch (openaiErr) {
        console.error("OpenAI Error:", openaiErr.message, openaiErr.stack);
        throw new Error("Failed to get response from OpenAI");
      }

      // Repeat gather
      const gather = twiml.gather({
        input: "speech",
        action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(customer)}&company=${encodeURIComponent(companyName)}`,
        method: "POST",
        timeout: 5,
        speechTimeout: "auto",
      });
      gather.say({ voice: "alice" }, aiResponse);

      // Safety redirect
      twiml.redirect(
        `${BASE_URL}/twilio/voice?campaignId=${campaignId}&customer=${encodeURIComponent(customer)}&company=${encodeURIComponent(companyName)}&first=false`
      );
    }
  } catch (err) {
    console.error("Response Route Error:", err.message, err.stack);
    twiml.say({ voice: "alice" }, "Sorry, there was an error processing your response. Please try again.");
    twiml.hangup();
  }

  // Save transcript
  db.query(
    `SELECT transcript FROM calls WHERE twilio_sid = ? LIMIT 1`,
    [CallSid],
    (err, results) => {
      if (!err && results.length > 0) {
        let transcript = [];
        try {
          transcript = JSON.parse(results[0].transcript || "[]");
        } catch (e) {
          console.error("Transcript Parse Error:", e);
        }
        if (SpeechResult) transcript.push({ from: "User", text: SpeechResult, type: "topic" });
        transcript.push({ from: "AI", text: aiResponse });
        db.query(
          `UPDATE calls SET transcript = ? WHERE twilio_sid = ?`,
          [JSON.stringify(transcript), CallSid],
          (err2) => {
            if (err2) console.error("Transcript Save Error:", err2);
          }
        );
      }
    }
  );

  res.type("text/xml");
  res.send(twiml.toString());
});

// ---------- 3️⃣ Call Status Callback ----------
router.post("/status", (req, res) => {
  const { CallSid, CallStatus } = req.body;
  console.log("📞 Call Status Update:", { CallSid, CallStatus });

  db.query(
    "UPDATE calls SET status = ? WHERE twilio_sid = ?",
    [CallStatus, CallSid],
    (err) => {
      if (err) console.error("Status Update Error:", err);
    }
  );

  res.sendStatus(200);
});

module.exports = router;