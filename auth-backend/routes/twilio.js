const express = require("express");
const twilio = require("twilio");
const OpenAI = require("openai");
const fetch = require("node-fetch");
const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;

const BASE_URL = process.env.PUBLIC_URL?.replace(/\/$/, "") || "http://localhost:5000";
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

console.log("Using BASE_URL:", BASE_URL);

// === Helpers ===
function convertToTwilioWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("pcm_s16le")
      .audioFrequency(16000)
      .audioChannels(1)
      .toFormat("wav")
      .on("end", () => {
        fs.unlink(inputPath, () => {});
        resolve(outputPath);
      })
      .on("error", reject)
      .save(outputPath);
  });
}

async function getElevenLabsAudio(text) {
  console.log("Generating ElevenLabs audio for text:", text);
  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_LABS_VOICE_KEY}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/wav",
          "xi-api-key": process.env.ELEVEN_LABS_API,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          output_format: "pcm_16000",
          voice_settings: { stability: 0.4, similarity_boost: 0.8 },
        }),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("ElevenLabs API error:", errText);
      throw new Error(`ElevenLabs error: ${resp.status}`);
    }

    const buffer = Buffer.from(await resp.arrayBuffer());
    const wavFile = `eleven-${Date.now()}.wav`;
    const wavPath = path.join(__dirname, "../public", wavFile);
    fs.writeFileSync(wavPath, buffer);

    const convertedPath = path.join(__dirname, "../public", `converted-${wavFile}`);
    await convertToTwilioWav(wavPath, convertedPath);

    const audioUrl = `${BASE_URL}/converted-${wavFile}`;
    console.log("ElevenLabs audio ready:", audioUrl);
    return audioUrl;
  } catch (error) {
    console.error("Error generating ElevenLabs audio:", error);
    return null;
  }
}

// Helper: Append transcript safely
async function appendTranscript(callSid, entry) {
  if (!callSid) return false;
  
  try {
    const [results] = await db.query(
      "SELECT transcript FROM calls WHERE twilio_sid = ? LIMIT 1",
      [callSid]
    );
    
    if (!results.length) {
      console.log("⚠️ No call row for", callSid);
      return false;
    }

    let transcript = [];
    try {
      transcript = results[0].transcript ? JSON.parse(results[0].transcript) : [];
    } catch (e) {
      console.error("Transcript parse error:", e);
      transcript = [];
    }

    transcript.push(entry);

    await db.query(
      "UPDATE calls SET transcript = ? WHERE twilio_sid = ?",
      [JSON.stringify(transcript), callSid]
    );
    
    console.log("✅ Transcript updated for", callSid);
    return true;
  } catch (error) {
    console.error("Error updating transcript:", error);
    return false;
  }
}

// === 1️⃣ Voice Route (FIXED) ===
router.post("/voice", async (req, res) => {
  const { campaignId, customer, company } = req.query;
  const { CallSid } = req.body;
  
  console.log("📞 /voice called with:", { campaignId, customer, CallSid, timestamp: new Date().toISOString() });

  // Set timeout to ensure response within 8 seconds
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error("⚠️ Voice route timeout - sending emergency response");
      const twiml = new VoiceResponse();
      twiml.say({ voice: "Polly.Joanna" }, "Hello, please hold while I connect you.");
      twiml.gather({
        input: "speech",
        action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(customer || '')}&company=${encodeURIComponent(company || '')}`,
        method: "POST",
        timeout: 5,
        speechTimeout: "auto",
      });
      res.type("text/xml").send(twiml.toString());
    }
  }, 8000);

  try {
    if (!campaignId || !customer) {
      throw new Error("Missing campaignId or customer");
    }

    // Quick database lookups with timeout
    const campaignPromise = db.query("SELECT script, user_id FROM campaigns WHERE id = ? LIMIT 1", [campaignId]);
    const [campaignResults] = await Promise.race([
      campaignPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Campaign query timeout")), 3000))
    ]);

    if (!campaignResults.length) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }

    const campaign = campaignResults[0];
    let companyName = company;

    if (!companyName) {
      try {
        const [userResults] = await Promise.race([
          db.query("SELECT company FROM users WHERE id = ? LIMIT 1", [campaign.user_id]),
          new Promise((_, reject) => setTimeout(() => reject(new Error("User query timeout")), 2000))
        ]);
        companyName = userResults[0]?.company || "Our Company";
      } catch (error) {
        console.warn("Failed to fetch company name:", error.message);
        companyName = "Our Company";
      }
    }

    const personalizedScript = (campaign.script || "Hello {username}, I am EVA from {company}.")
      .replace(/{username}/g, customer)
      .replace(/{company}/g, companyName);

    const welcomeText = `${personalizedScript} What would you like to discuss today?`;

    // Create TwiML response immediately
    const twiml = new VoiceResponse();
    twiml.say({ voice: "Polly.Joanna" }, welcomeText);
    twiml.gather({
      input: "speech",
      action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(customer)}&company=${encodeURIComponent(companyName)}`,
      method: "POST",
      timeout: 5,
      speechTimeout: "auto",
    });

    clearTimeout(timeout);
    
    // Send response immediately
    res.type("text/xml");
    res.send(twiml.toString());

    // Do background operations AFTER sending response
    setImmediate(async () => {
      try {
        // Generate ElevenLabs audio in background
        const audioUrl = await getElevenLabsAudio(welcomeText);
        
        // Update transcript in background
        await appendTranscript(CallSid, {
          from: "AI",
          text: welcomeText,
          audioUrl,
          timestamp: new Date().toISOString()
        });
        
        console.log("✅ Background operations completed for CallSid:", CallSid);
      } catch (bgError) {
        console.error("Background operation error:", bgError.message);
      }
    });

  } catch (err) {
    clearTimeout(timeout);
    console.error("Voice Route Error:", err.message);
    
    if (!res.headersSent) {
      const twiml = new VoiceResponse();
      twiml.say({ voice: "Polly.Joanna" }, "Sorry, there was an error. Please try again.");
      twiml.hangup();
      res.type("text/xml");
      res.send(twiml.toString());
    }
  }
});

// === 2️⃣ Response Route (FIXED) ===
router.post("/response", async (req, res) => {
  const { SpeechResult, CallSid } = req.body;
  const { campaignId, customer, company } = req.query;
  
  console.log("📞 /response called with:", { SpeechResult, CallSid, timestamp: new Date().toISOString() });

  // Set timeout to ensure response within 8 seconds
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error("⚠️ Response route timeout - sending emergency response");
      const twiml = new VoiceResponse();
      twiml.say({ voice: "Polly.Joanna" }, "Please continue.");
      twiml.gather({
        input: "speech",
        action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(customer || '')}&company=${encodeURIComponent(company || '')}`,
        method: "POST",
        timeout: 5,
        speechTimeout: "auto",
      });
      res.type("text/xml").send(twiml.toString());
    }
  }, 8000);

  try {
    if (!campaignId || !customer) {
      throw new Error("Missing campaignId or customer");
    }

    const userText = SpeechResult || "";
    const exitKeywords = ["bye", "goodbye", "thank you", "thanks", "end call"];
    const shouldHangup = exitKeywords.some((w) => userText.toLowerCase().includes(w));

    const twiml = new VoiceResponse();

    if (shouldHangup) {
      const goodbyeText = "Thank you for your time. Have a great day!";
      twiml.say({ voice: "Polly.Joanna" }, goodbyeText);
      twiml.hangup();

      clearTimeout(timeout);
      res.type("text/xml");
      res.send(twiml.toString());

      // Background operations for hangup
      setImmediate(async () => {
        try {
          if (SpeechResult) {
            await appendTranscript(CallSid, {
              from: "User",
              text: SpeechResult,
              type: "response",
              timestamp: new Date().toISOString()
            });
          }
          await appendTranscript(CallSid, {
            from: "AI",
            text: goodbyeText,
            timestamp: new Date().toISOString()
          });
          await db.query("UPDATE calls SET status = 'completed', ended_at = NOW() WHERE twilio_sid = ?", [CallSid]);
        } catch (bgError) {
          console.error("Hangup background error:", bgError);
        }
      });

    } else {
      // Continue conversation
      twiml.gather({
        input: "speech",
        action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(customer)}&company=${encodeURIComponent(company)}`,
        method: "POST",
        timeout: 5,
        speechTimeout: "auto",
      }).say({ voice: "Polly.Joanna" }, "I'm listening. Please continue.");

      clearTimeout(timeout);
      res.type("text/xml");
      res.send(twiml.toString());

      // Background AI processing
      if (SpeechResult) {
        setImmediate(async () => {
          try {
            // Record user input
            await appendTranscript(CallSid, {
              from: "User",
              text: SpeechResult,
              type: "response",
              timestamp: new Date().toISOString()
            });

            // Get campaign info for AI context
            const [campaignResults] = await db.query("SELECT script, user_id FROM campaigns WHERE id = ? LIMIT 1", [campaignId]);
            if (!campaignResults.length) return;

            const campaign = campaignResults[0];
            const [userResults] = await db.query("SELECT company FROM users WHERE id = ? LIMIT 1", [campaign.user_id]);
            const companyName = userResults[0]?.company || company || "Our Company";

            // Generate AI response
            const completion = await Promise.race([
              openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: `You are Eva, AI assistant for ${companyName}. Keep responses brief and conversational. User said: "${SpeechResult}". Respond helpfully.`
                  },
                  { role: "user", content: SpeechResult }
                ],
                max_tokens: 150
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error("OpenAI timeout")), 5000))
            ]);

            const aiText = completion.choices[0].message.content?.trim() || "I understand. Tell me more.";
            
            // Generate audio and update transcript
            const audioUrl = await getElevenLabsAudio(aiText);
            await appendTranscript(CallSid, {
              from: "AI",
              text: aiText,
              audioUrl,
              timestamp: new Date().toISOString()
            });

            console.log("✅ AI response processed for CallSid:", CallSid);
          } catch (bgError) {
            console.error("Background AI processing error:", bgError.message);
          }
        });
      }
    }

  } catch (err) {
    clearTimeout(timeout);
    console.error("Response Route Error:", err.message);
    
    if (!res.headersSent) {
      const twiml = new VoiceResponse();
      twiml.say({ voice: "Polly.Joanna" }, "Sorry, I didn't catch that. Could you repeat?");
      twiml.gather({
        input: "speech",
        action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(customer || '')}&company=${encodeURIComponent(company || '')}`,
        method: "POST",
        timeout: 5,
        speechTimeout: "auto",
      });
      res.type("text/xml");
      res.send(twiml.toString());
    }
  }
});

// === 3️⃣ Status Route (FIXED) ===
router.post("/status", (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;
  console.log("📞 Status Update:", { CallSid, CallStatus, CallDuration, timestamp: new Date().toISOString() });

  // Respond immediately
  res.sendStatus(200);

  // Background database update
  setImmediate(async () => {
    try {
      await db.query(
        "UPDATE calls SET status = ?, duration = ? WHERE twilio_sid = ?",
        [CallStatus, CallDuration || null, CallSid]
      );
      console.log(`✅ Call status updated for ${CallSid}: ${CallStatus}`);
    } catch (error) {
      console.error("Status update error:", error.message);
    }
  });
});

module.exports = router;
