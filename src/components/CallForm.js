// src/components/CallForm.js
import React, { useState } from 'react';
import { startAICall } from '../api/twilioCall';

const CallForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleCall = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const result = await startAICall(name, phone);
            setStatus('Call started successfully!');
        } catch (err) {
            setStatus('Failed to start call.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold">Start AI Voice Call</h2>
            <form onSubmit={handleCall} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone (e.g., +1234567890)"
                    className="w-full p-2 border rounded"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Calling...' : 'Start AI Call'}
                </button>
                {status && <p className="text-center text-sm">{status}</p>}
            </form>
        </div>
    );
};

export default CallForm;
