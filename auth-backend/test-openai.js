const fetch = require('node-fetch').default; // Explicitly import fetch
require('dotenv').config();

fetch('https://api.openai.com/v1/realtime/sessions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o-realtime-preview', // Updated model
    voice: 'alloy', // Updated voice
  }),
})
  .then(async res => {
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(await res.json(), null, 2));
  })
  .catch(err => console.error('Error:', err.message));