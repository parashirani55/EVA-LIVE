import React, { useState } from 'react';
import { startAICall } from '../api/twilioCall';

const TestCall = () => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('');

    const handleCall = async () => {
        setStatus('Calling...');
        try {
            const res = await startAICall('Test User', phone);
            console.log('Call Started:', res);
            setStatus('Call started successfully!');
        } catch (err) {
            console.error('Call Error:', err);
            setStatus(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md mt-10">
            <h2 className="text-xl font-bold mb-4">Test AI Call</h2>
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="border px-4 py-2 w-full rounded mb-3"
            />
            <button
                onClick={handleCall}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Start Call
            </button>
            {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
        </div>
    );
};

export default TestCall;
