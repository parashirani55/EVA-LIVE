import axios from 'axios';

const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;
const TWILIO_API_URL = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;

const authHeader = {
    auth: {
        username: accountSid,
        password: authToken,
    },
};

export const startAICall = async (name, toPhone) => {
    const aiScriptUrl = `http://demo.twilio.com/docs/voice.xml`; // Replace with your own TwiML URL

    const payload = new URLSearchParams({
        To: toPhone,
        From: twilioPhoneNumber,
        Url: aiScriptUrl,
    });

    const response = await axios.post(TWILIO_API_URL, payload, authHeader);
    return response.data;
};
