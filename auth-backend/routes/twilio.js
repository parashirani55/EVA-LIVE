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

console.log("✅ Using ffmpeg binary:", ffmpegPath);
console.log("✅ Using ffprobe binary:", ffprobePath);

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;

const BASE_URL =
  process.env.PUBLIC_URL && process.env.PUBLIC_URL.match(/^https?:\/\//)
    ? process.env.PUBLIC_URL.replace(/\/$/, "")
    : "https://3ea5f9fdbf93.ngrok-free.app";

console.log("Using BASE_URL:", BASE_URL);

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

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

  if (!resp.ok) throw new Error(await resp.text());

  const buffer = Buffer.from(await resp.arrayBuffer());
  const wavFile = `eleven-${Date.now()}.wav`;
  const wavPath = path.join(__dirname, "../public", wavFile);
  fs.writeFileSync(wavPath, buffer);

  const convertedPath = path.join(__dirname, "../public", `converted-${wavFile}`);
  await convertToTwilioWav(wavPath, convertedPath);

  return `${BASE_URL}/converted-${wavFile}`;
}

// Helper: Append transcript safely
async function appendTranscript(callSid, entry) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT transcript FROM calls WHERE twilio_sid = ? LIMIT 1",
      [callSid],
      (err, results) => {
        if (err) return reject(err);
        if (!results.length) {
          console.log("⚠️ No call row for", callSid);
          return resolve(false);
        }

        let transcript = [];
        try {
          transcript = results[0].transcript ? JSON.parse(results[0].transcript) : [];
        } catch (e) {
          console.error("Transcript parse error:", e);
        }

        transcript.push(entry);

        db.query(
          "UPDATE calls SET transcript = ? WHERE twilio_sid = ?",
          [JSON.stringify(transcript), callSid],
          (err2) => {
            if (err2) return reject(err2);
            console.log("✅ Transcript updated for", callSid);
            resolve(true);
          }
        );
      }
    );
  });
}

// --- 1️⃣ Voice Route ---
router.post("/voice", async (req, res) => {
  const { campaignId, customer, phone, company } = req.query;
  const { CallSid } = req.body;
  const twiml = new VoiceResponse();

  try {
    if (!campaignId || !customer) throw new Error("Missing campaignId or customer");

    // Fetch campaign
    const [campaign] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT script, user_id FROM campaigns WHERE id = ? LIMIT 1",
        [campaignId],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });
    if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);

    // Get company name if not provided
    let companyName = company;
    if (!companyName) {
      const [user] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT company FROM users WHERE id = ? LIMIT 1",
          [campaign.user_id],
          (err, results) => (err ? reject(err) : resolve(results))
        );
      });
      companyName = user?.company || "Our Company";
    }

    const personalizedScript = (campaign.script || "Hello {username}, I am EVA from {company}.")
      .replace(/{username}/g, customer)
      .replace(/{company}/g, companyName);

    const welcomeText = `${personalizedScript} What topic would you like to discuss today?`;
    const audioUrl = await getElevenLabsAudio(welcomeText);

    // ✅ Only update transcript if call row exists
    await appendTranscript(CallSid, { from: "AI", text: welcomeText });

    // Twilio response
    twiml.pause({ length: 1 });
    twiml.play(audioUrl);
    twiml.pause({ length: 1 });
    twiml.gather({
      input: "speech",
      action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(
        customer
      )}&company=${encodeURIComponent(companyName)}`,
      method: "POST",
      timeout: 5,
      speechTimeout: "auto",
    });
  } catch (err) {
    console.error("Voice Route Error:", err.message);
    twiml.say({ voice: "Polly.Joanna" }, "Sorry, there was an error starting the call.");
    twiml.hangup();
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// --- 2️⃣ Response Route ---
router.post("/response", async (req, res) => {
  const { SpeechResult, CallSid } = req.body;
  const { campaignId, customer, company } = req.query;
  const twiml = new VoiceResponse();

  try {
    if (!campaignId || !customer) throw new Error("Missing campaignId or customer");

    // Fetch campaign
    const [campaign] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT script, user_id FROM campaigns WHERE id = ? LIMIT 1",
        [campaignId],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);

    // Get company name
    let companyName = company;
    if (!companyName) {
      const [user] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT company FROM users WHERE id = ? LIMIT 1",
          [campaign.user_id],
          (err, results) => (err ? reject(err) : resolve(results))
        );
      });
      companyName = user?.company || "Our Company";
    }

    const personalizedScript = (campaign.script || "Hello {username}, I am EVA from {company}.")
      .replace(/{username}/g, customer)
      .replace(/{company}/g, companyName);

    const userText = SpeechResult || "";
    const exitKeywords = ["bye", "goodbye", "thank you", "thanks"];
    const shouldHangup = exitKeywords.some((w) => userText.toLowerCase().includes(w));

    let aiResponse = "Sorry, I didn’t get that. Can you repeat?";

    if (shouldHangup) {
      aiResponse = "Okay, thank you for your time. Have a great day!";
      const audioUrl = await getElevenLabsAudio(aiResponse);

      if (SpeechResult) {
        await appendTranscript(CallSid, { from: "User", text: SpeechResult, type: "topic" });
      }
      await appendTranscript(CallSid, { from: "AI", text: aiResponse });

      db.query(
        "UPDATE calls SET status = 'completed', ended_at = NOW() WHERE twilio_sid = ?",
        [CallSid]
      );

      twiml.play(audioUrl);
      twiml.hangup();
    } else if (SpeechResult) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Eva, AI assistant for ${companyName}. Call started with: "${personalizedScript}". User said: "${SpeechResult}". Reply briefly.`,
            },
            { role: "user", content: SpeechResult },
          ],
        });
        aiResponse = completion.choices[0].message.content?.trim() || aiResponse;
      } catch (err) {
        console.error("OpenAI Error:", err.message);
      }

      const gather = twiml.gather({
        input: "speech",
        action: `${BASE_URL}/twilio/response?campaignId=${campaignId}&customer=${encodeURIComponent(
          customer
        )}&company=${encodeURIComponent(companyName)}`,
        method: "POST",
        timeout: 5,
        speechTimeout: "auto",
      });

      const audioUrl = await getElevenLabsAudio(aiResponse);

      await appendTranscript(CallSid, { from: "User", text: SpeechResult, type: "topic" });
      await appendTranscript(CallSid, { from: "AI", text: aiResponse });

      gather.play(audioUrl);
      twiml.redirect(
        `${BASE_URL}/twilio/voice?campaignId=${campaignId}&customer=${encodeURIComponent(
          customer
        )}&company=${encodeURIComponent(companyName)}&first=false`
      );
    }
  } catch (err) {
    console.error("Response Route Error:", err.message);
    twiml.say({ voice: "Polly.Joanna" }, "Sorry, there was an error.");
    twiml.hangup();
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// --- 3️⃣ Status Route ---
router.post("/status", (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;
  console.log("📞 Twilio Status:", { CallSid, CallStatus, CallDuration });

  db.query(
    "UPDATE calls SET status = ?, duration = ? WHERE twilio_sid = ?",
    [CallStatus, CallDuration || null, CallSid],
    (err) => {
      if (err) console.error("Status Update Error:", err);
      else console.log(`✅ Call status updated for ${CallSid}`);
    }
  );

  res.sendStatus(200);
});

module.exports = router;
