import axios from "axios";

const openaiAxios = axios.create();

export const generateScript = async (desc) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key is missing. Check your .env file.");

  try {
    console.log("Sending request to OpenAI API with desc:", desc);

    const response = await openaiAxios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are EVA, an AI calling assistant.
Generate only EVA's speaking lines based on the campaign description.
Do NOT simulate customer responses.
Keep it natural, concise, and professional.
`
          },
          {
            role: "user",
            content: `Campaign description: "${desc}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const script = response.data.choices[0]?.message?.content;
    if (!script) throw new Error("No script content returned from API");

    console.log("EVA script received:", script);
    return script;
  } catch (error) {
    console.error("Script Generation Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to generate EVA script."
    );
  }
};
