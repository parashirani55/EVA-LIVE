// src/components/OpenAITester.js
import React, { useState } from 'react';
import axios from 'axios';

const OpenAITester = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const result = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setResponse(result.data.choices[0].message.content.trim());
        } catch (error) {
            console.error(error);
            setResponse('Error: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <h2>🧪 OpenAI API Tester</h2>
            <textarea
                rows="4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything..."
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            />
            <button
                onClick={handleSubmit}
                style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                {loading ? 'Loading...' : 'Ask GPT'}
            </button>
            {response && (
                <div style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
                    <strong>Response:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default OpenAITester;
