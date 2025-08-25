const WebSocket = require('ws');
const fetch = require('node-fetch').default;
const db = require('../config/db');
require('dotenv').config();

function createTwilioStreamServer(server) {
  const wss = new WebSocket.Server({ server, path: '/twilio/stream' });

  wss.on('connection', async (ws, req) => {
    console.log('🔗 Twilio connected to /twilio/stream', req.url);

    let streamSid = null;

    try {
      // Extract campaignId, customer, and company from query
      const { campaignId, customer = 'Customer', company = 'Our Company' } = req.query;

      // Fetch campaign script
      const [campaign] = await new Promise((resolve, reject) => {
        db.query(
          'SELECT script FROM campaigns WHERE id = ? LIMIT 1',
          [campaignId],
          (err, results) => {
            console.log('Campaign query:', { err, results });
            err ? reject(err) : resolve(results);
          }
        );
      });

      if (!campaign) {
        throw new Error(`Campaign not found for ID: ${campaignId}`);
      }

      // Personalize script
      const scriptTemplate = campaign.script || 'Hello {username}, I am EVA calling from {company}.';
      const personalizedScript = scriptTemplate
        .replace(/{username}/g, customer)
        .replace(/{company}/g, company);

      // 1️⃣ Create ephemeral OpenAI Realtime session
      const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview',
          voice: 'alloy',
        }),
      });

      if (!r.ok) {
        const errorData = await r.json();
        console.error('OpenAI API error:', errorData);
        ws.send(JSON.stringify({ event: 'error', message: 'OpenAI session failed' }));
        ws.close(1000, 'OpenAI session failed');
        return;
      }

      const session = await r.json();
      const clientSecret = session.client_secret?.value;
      if (!clientSecret) {
        ws.send(JSON.stringify({ event: 'error', message: 'Invalid OpenAI session' }));
        ws.close(1000, 'Invalid OpenAI session');
        return;
      }

      // 2️⃣ Connect to OpenAI Realtime WebSocket
      const OPENAI_WS_URL = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview`;
      const aiSocket = new WebSocket(OPENAI_WS_URL, {
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          'OpenAI-Beta': 'realtime=v1',
        },
      });

      aiSocket.on('open', () => {
        console.log('✅ Connected to OpenAI WebSocket');
        // Configure conversation
        aiSocket.send(JSON.stringify({
          type: 'session.update',
          session: {
            model: 'gpt-4o-realtime-preview',
            voice: 'alloy',
            instructions: `You are Eva, an AI voice assistant for ${company}. Start the call by saying: "${personalizedScript} What topic would you like to discuss today?" Respond conversationally, keeping answers short and relevant to the user's topic.`,
            turn_detection: { type: 'server_vad', threshold: 0.5, silence_duration_ms: 200 },
          },
        }));
      });

      aiSocket.on('error', (err) => {
        console.error('❌ OpenAI WebSocket error:', err.message);
        ws.send(JSON.stringify({ event: 'error', message: 'OpenAI WebSocket failed' }));
        ws.close(1000, 'OpenAI WebSocket failed');
      });

      // 3️⃣ Twilio → OpenAI
      ws.on('message', (msg) => {
        let twilioMessage;
        try {
          twilioMessage = JSON.parse(msg.toString());
        } catch (err) {
          console.error('Invalid Twilio message:', err.message);
          return;
        }

        if (twilioMessage.event === 'start') {
          streamSid = twilioMessage.start.streamSid;
        }

        if (aiSocket.readyState === WebSocket.OPEN) {
          if (twilioMessage.event === 'media') {
            aiSocket.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: twilioMessage.media.payload,
            }));
          } else if (twilioMessage.event === 'stop') {
            aiSocket.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
            aiSocket.send(JSON.stringify({ type: 'response.create' }));
            // Keep socket open for response streaming
          }
        }
      });

      // 4️⃣ OpenAI → Twilio
      aiSocket.on('message', (msg) => {
        let openaiMsg;
        try {
          openaiMsg = JSON.parse(msg.toString());
        } catch (err) {
          console.error('Invalid OpenAI message:', err.message);
          return;
        }

        if (ws.readyState === WebSocket.OPEN) {
          if (openaiMsg.type === 'response.output_audio.delta') {
            ws.send(JSON.stringify({
              event: 'media',
              streamSid: streamSid || 'default',
              media: { payload: openaiMsg.delta },
            }));
          } else if (openaiMsg.type === 'response.completed') {
            ws.send(JSON.stringify({ event: 'stop', streamSid: streamSid || 'default' }));
          }
        }
      });

      ws.on('close', (code, reason) => {
        console.log(`❌ Twilio stream closed: ${code} ${reason}`);
        aiSocket.close();
      });

      aiSocket.on('close', (code, reason) => {
        console.log(`❌ OpenAI stream closed: ${code} ${reason}`);
        ws.close();
      });

      ws.on('error', (err) => console.error('❌ Twilio WebSocket error:', err.message));
    } catch (err) {
      console.error('WebSocket setup error:', err.message, err.stack);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: 'error', message: 'Server error' }));
        ws.close(1000, 'Server error');
      }
    }
  });

  console.log('✅ Twilio Stream WebSocket server ready at /twilio/stream');
}

module.exports = createTwilioStreamServer;