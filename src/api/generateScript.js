import axios from 'axios';

export const generateScript = async (prompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const apiUrl = process.env.REACT_APP_OPENAI_API_URL;

  const response = await axios.post(
    apiUrl,
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};
