EVA AI Voice Calling Portal
===========================

EVA is an AI-driven voice calling platform built with React.js (frontend) and Node.js (backend). 
It allows real-time AI-powered two-way communication and full customization with Twilio integration.

Features
--------
- Real-time AI voice calling
- User authentication (login/signup)
- Custom Twilio configuration
- NGROK support for local development
- React frontend & Node.js backend architecture

Project Structure
-----------------
EVA-AI-VOICE-CALLING-PORTAL/
  frontend/         - React.js frontend
  auth-backend/     - Node.js backend (with auth and API routes)
  README.txt        - This documentation

Prerequisites
-------------
- Node.js (v18+ recommended)
- npm or yarn
- Twilio account (for voice calls)
- NGROK (for exposing backend)
- OpenAI API key (for AI features)

Setup & Installation
--------------------
1. Clone the repository:
   git clone https://github.com/parashirani55/EVA-AI-VOICE-CALLING-PORTAL.git
   cd EVA-AI-VOICE-CALLING-PORTAL

2. Setup Backend:
   cd auth-backend
   npm install

   Setup NGROK for WebSocket and reverse proxy:
     npm install -g ngrok
     ngrok authtoken YOUR_NGROK_AUTH_TOKEN
   (Get your auth token by signing in on the ngrok website)

   Start NGROK to expose your backend:
     ngrok http 5000

   Create a .env file with the following:
     PORT=5000
     NGROK_AUTH_TOKEN=your_ngrok_auth_token
     TWILIO_ACCOUNT_SID=your_twilio_account_sid
     TWILIO_AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number
     OPENAI_API_KEY=your_openai_api_key

   Start backend:
     npm run dev

3. Setup Frontend:
   cd ../frontend
   npm install
   npm start

   Frontend will run on http://localhost:3000

Usage
-----
1. Signup or login via the frontend
2. Configure Twilio settings if needed
3. Start AI-powered voice calls through the dashboard
4. Backend handles Twilio call routing

Notes
-----
- NGROK token must be valid to expose backend
- Update Twilio credentials to avoid call errors
- Supports two-way AI voice conversation

Tech Stack
----------
- Frontend: React.js, Axios
- Backend: Node.js, Express, Twilio SDK, NGROK
- Database: Optional (MongoDB/MySQL)
- AI Integration: OpenAI (optional)

Contributing
------------
Fork the repo, make improvements, and submit PRs. Issues and suggestions welcome.

Disclaimer
----------
For development and testing purposes only. Ensure Twilio account is in good standing to avoid charges.
