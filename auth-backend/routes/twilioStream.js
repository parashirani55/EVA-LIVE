const WebSocket = require("ws");
const fetch = require("node-fetch").default;
const db = require("../config/db");
const url = require("url");
require("dotenv").config();

function createTwilioStreamServer(server) {
  const wss = new WebSocket.Server({ server, path: "/twilio/stream" });

  wss.on("connection", async (ws, req) => {
    console.log("🔗 Twilio connected to /twilio/stream", req.url);

    let streamSid = null;

    try {
      // Parse query params
      const queryParams = url.parse(req.url, true).query;
      const { campaignId, customer = "Customer", company = "Our Company" } = queryParams;

      console.log("WebSocket query params:", { campaignId, customer, company });

      // Fetch campaign script
      const [campaign] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT script FROM campaigns WHERE id = ? LIMIT 1",
          [campaignId],
          (err, results) => (err ? reject(err) : resolve(results))
        );
      });

      if (!campaign) throw new Error(`Campaign not found for ID: ${campaignId}`);

      const scriptTemplate = campaign.script || "Hello {username}, I am EVA calling from {company}.";
      const personalizedScript = scriptTemplate
        .replace(/{username}/g, customer)
        .replace(/{company}/g, company);

      // Create OpenAI Realtime session
      const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "gpt-4o-realtime-preview" }),
      });

      if (!r.ok) {
        const errorData = await r.json();
        console.error("OpenAI API error:", errorData);
        ws.send(JSON.stringify({ event: "error", message: "OpenAI session failed" }));
        ws.close(1000, "OpenAI session failed");
        return;
      }

      const session = await r.json();
      const clientSecret = session.client_secret?.value;
      if (!clientSecret) {
        ws.send(JSON.stringify({ event: "error", message: "Invalid OpenAI session" }));
        ws.close(1000, "Invalid OpenAI session");
        return;
      }

      // Connect to OpenAI Realtime WebSocket
      const OPENAI_WS_URL = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview`;
      const aiSocket = new WebSocket(OPENAI_WS_URL, {
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          "OpenAI-Beta": "realtime=v1",
        },
      });

      aiSocket.on("open", () => {
        console.log("✅ Connected to OpenAI WebSocket");
        aiSocket.send(
          JSON.stringify({
            type: "session.update",
            session: {
              model: "gpt-4o-realtime-preview",
              instructions: `You are Eva, an AI voice assistant for ${company}. Start the call by saying: "${personalizedScript} What topic would you like to discuss today?" Respond conversationally, keeping answers short and relevant to the user's topic.`,
              turn_detection: { type: "server_vad", threshold: 0.5, silence_duration_ms: 200 },
            },
          })
        );
      });

      aiSocket.on("error", (err) => {
        console.error("❌ OpenAI WebSocket error:", err.message);
        ws.send(JSON.stringify({ event: "error", message: "OpenAI WebSocket failed" }));
        ws.close(1000, "OpenAI WebSocket failed");
      });

      // Twilio → OpenAI
      ws.on("message", async (msg) => {
        let twilioMessage;
        try {
          twilioMessage = JSON.parse(msg.toString());
        } catch (err) {
          console.error("Invalid Twilio message:", err.message);
          return;
        }

        if (twilioMessage.event === "start") {
          streamSid = twilioMessage.start.streamSid;
          console.log("Twilio stream started:", streamSid);

          // Create new call record if not exists
          // ✅ Only append to existing call, no insert
db.query(
  "SELECT transcript FROM calls WHERE twilio_sid = ? LIMIT 1",
  [streamSid],
  (err, results) => {
    if (err) return console.error("Call lookup error:", err);

    if (results.length > 0) {
      let existingTranscript = [];
      try {
        existingTranscript = results[0].transcript
          ? JSON.parse(results[0].transcript)
          : [];
      } catch (e) {
        console.error("Transcript parse error:", e);
      }

      existingTranscript.push({
        from: "AI",
        text: `Call started for ${customer} in campaign ${campaignId}.`,
      });

      db.query(
        "UPDATE calls SET transcript = ? WHERE twilio_sid = ?",
        [JSON.stringify(existingTranscript), streamSid],
        (err) => {
          if (err) console.error("Transcript update error:", err);
          else console.log("✅ Transcript appended for existing CallSid:", streamSid);
        }
      );
    } else {
      console.log("⚠️ No existing call row found for streamSid:", streamSid);
    }
  }
);

        }

        // Append user speech to transcript
        if (twilioMessage.event === "speech" && twilioMessage.speech?.transcript) {
          const userText = twilioMessage.speech.transcript;

          db.query(
            "SELECT transcript FROM calls WHERE twilio_sid = ? LIMIT 1",
            [streamSid],
            (err, results) => {
              if (err) return console.error(err);
              const existingTranscript = results[0]?.transcript
                ? JSON.parse(results[0].transcript)
                : [];
              existingTranscript.push({ from: "User", text: userText, type: "topic" });
              db.query(
                "UPDATE calls SET transcript = ? WHERE twilio_sid = ?",
                [JSON.stringify(existingTranscript), streamSid],
                (err) => { if (err) console.error("Transcript save error:", err); }
              );
            }
          );
        }

        // Forward Twilio audio to OpenAI
        if (aiSocket.readyState === WebSocket.OPEN && twilioMessage.event === "media") {
          aiSocket.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: twilioMessage.media.payload,
            })
          );
        } else if (aiSocket.readyState === WebSocket.OPEN && twilioMessage.event === "stop") {
          aiSocket.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
          aiSocket.send(JSON.stringify({ type: "response.create" }));
        }
      });

      // OpenAI → ElevenLabs → Twilio & save AI transcript
      aiSocket.on("message", async (msg) => {
        let openaiMsg;
        try {
          openaiMsg = JSON.parse(msg.toString());
        } catch (err) {
          console.error("Invalid OpenAI message:", err.message);
          return;
        }

        if (openaiMsg.type === "response.output_text.delta" && openaiMsg.delta) {
          const aiText = openaiMsg.delta;

          // Save AI message
          db.query(
            "SELECT transcript FROM calls WHERE twilio_sid = ? LIMIT 1",
            [streamSid],
            (err, results) => {
              if (err) return console.error(err);
              const existingTranscript = results[0]?.transcript
                ? JSON.parse(results[0].transcript)
                : [];
              existingTranscript.push({ from: "AI", text: aiText });
              db.query(
                "UPDATE calls SET transcript = ? WHERE twilio_sid = ?",
                [JSON.stringify(existingTranscript), streamSid],
                (err) => { if (err) console.error("Transcript save error:", err); }
              );
            }
          );

          // Send TTS audio to Twilio
          try {
            const response = await fetch(
              `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_LABS_VOICE_KEY}/stream`,
              {
                method: "POST",
                headers: {
                  Accept: "audio/wav",
                  "xi-api-key": process.env.ELEVEN_LABS_API,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  text: aiText,
                  model_id: "eleven_monolingual_v1",
                  output_format: "ulaw_8000",
                  voice_settings: { stability: 0.4, similarity_boost: 0.8 },
                }),
              }
            );
            if (!response.ok) return console.error("ElevenLabs API error:", await response.text());

            const audioBuffer = await response.buffer();
            const base64Audio = audioBuffer.toString("base64");

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  event: "media",
                  streamSid: streamSid || "default",
                  media: { payload: base64Audio },
                })
              );
            }
          } catch (err) {
            console.error("❌ ElevenLabs TTS error:", err.message);
          }
        }

        if (openaiMsg.type === "response.completed") {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "stop", streamSid: streamSid || "default" }));
          }
        }
      });

      ws.on("close", (code, reason) => {
        console.log(`❌ Twilio stream closed: ${code} ${reason}`);
        aiSocket.close();
      });

      aiSocket.on("close", (code, reason) => {
        console.log(`❌ OpenAI stream closed: ${code} ${reason}`);
        ws.close();
      });

      ws.on("error", (err) => console.error("❌ Twilio WebSocket error:", err.message));
    } catch (err) {
      console.error("WebSocket setup error:", err.message, err.stack);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: "error", message: "Server error" }));
        ws.close(1000, "Server error");
      }
    }
  });

  console.log("✅ Twilio Stream WebSocket server ready at /twilio/stream");
}

module.exports = createTwilioStreamServer;
