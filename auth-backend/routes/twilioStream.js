const WebSocket = require('ws');
const fetch = require('node-fetch');
require('dotenv').config();

// Create WS server
function createTwilioStreamServer(server) {
  const wss = new WebSocket.Server({ server, path: '/twilio/stream' });

  wss.on('connection', async (ws, req) => {
    console.log('🔗 Twilio connected to /twilio/stream');

    // Step 1: Create a session with OpenAI Realtime
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "verse", // AI voice
      }),
    });

    const session = await r.json();
    const OPENAI_WS_URL = session.client_secret.value;

    // Step 2: Connect to OpenAI Realtime via WebSocket
    const aiSocket = new WebSocket(OPENAI_WS_URL, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    // Forward audio events Twilio -> OpenAI
    ws.on('message', (msg) => {
      if (aiSocket.readyState === WebSocket.OPEN) {
        aiSocket.send(msg);
      }
    });

    // Forward AI responses -> Twilio
    aiSocket.on('message', (msg) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      }
    });

    ws.on('close', () => {
      console.log('❌ Twilio stream closed');
      aiSocket.close();
    });

    aiSocket.on('close', () => {
      console.log('❌ OpenAI stream closed');
      ws.close();
    });
  });

  console.log('✅ Twilio Stream WebSocket server ready at /twilio/stream');
}

module.exports = createTwilioStreamServer;
