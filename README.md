🚀 EVA AI Voice Calling Portal

EVA is an AI-driven voice calling platform built with React.js (frontend) and Node.js (backend).
It enables real-time AI-powered two-way voice communication with customizable Twilio integration.

🌟 Features

🔊 Real-time AI voice calling

🛡️ User authentication (signup/login)

⚙️ Custom Twilio configuration

🌐 NGROK support for local development

💻 Modular React frontend & Node.js backend architecture

🗂️ Project Structure
EVA-AI-VOICE-CALLING-PORTAL/
│
├─ frontend/        # React.js frontend
├─ auth-backend/    # Node.js backend with auth & API routes
└─ README.md        # Project documentation

🛠 Prerequisites

Node.js v18+

npm or yarn

Twilio account (for voice calls)

NGROK (for exposing backend)

OpenAI API key (for AI voice features)

⚡ Getting Started
1️⃣ Clone Repository
```
git clone https://github.com/parashirani55/EVA-AI-VOICE-CALLING-PORTAL.git
cd EVA-AI-VOICE-CALLING-PORTAL
```
2️⃣ Backend Setup
```
cd auth-backend
npm install
```
Create .env for Backend & Frontend and add credentials

3️⃣ NGROK Setup

Install NGROK globally:
```
npm install -g ngrok
```

Get your Auth Token from NGROK Dashboard

Set the Auth Token:
```
ngrok authtoken YOUR_NGROK_AUTH_TOKEN
```

Start NGROK:
```
ngrok http 5000
```

Update .env in backend and frontend with the NGROK URL:

NGROK_URL=https://abc123.ngrok.io       # backend
REACT_APP_BACKEND_URL=https://abc123.ngrok.io  # frontend


⚠️ Tip: NGROK URL changes every time you restart. Update .env files each time.

4️⃣ Start Backend
```
npm run dev
```
5️⃣ Frontend Setup
```
npm install
```
Create .env for Frontend
REACT_APP_BACKEND_URL=https://xxxxxx.ngrok.io   # NGROK backend URL
REACT_APP_OPENAI_API_KEY=your_openai_api_key

Start Frontend
```
npm start
```

Frontend runs at: http://localhost:3000

🚀 Usage

Sign up or log in via the frontend

Configure Twilio settings if needed

Start AI-powered voice calls from the dashboard

Backend handles Twilio call routing automatically

📝 Notes

⚠️ NGROK URL changes after every restart. Update .env in both frontend and backend

Ensure Twilio credentials are correct to avoid call failures

Supports two-way AI voice conversations

🧰 Tech Stack

Frontend: React.js, Axios

Backend: Node.js, Express, Twilio SDK, NGROK

Database: Optional (MongoDB/MySQL)

AI Integration: OpenAI

🤝 Contributing

Fork the repository, make improvements, and submit PRs. Issues and suggestions are welcome.

⚠️ Disclaimer

For development and testing purposes only. Ensure your Twilio account is in good standing to avoid unexpected charges.
