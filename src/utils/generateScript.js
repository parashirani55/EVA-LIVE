// src/utils/generateScript.js
import axios from 'axios';

export const generateScript = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is missing. Check your .env file.');
  }

  try {
    console.log('Sending request to OpenAI API with prompt:', prompt);
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Use gpt-3.5-turbo for wider availability
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const script = response.data.choices[0]?.message?.content;
    if (!script) {
      throw new Error('No script content returned from API');
    }
    console.log('Response received:', script);
    return script;
  } catch (error) {
    console.error('Script Generation Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.error?.message || 'Failed to generate script. Check your API key or network connection.'
    );
  }
};