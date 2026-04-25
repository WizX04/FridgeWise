import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Vercel sometimes needs the body to be parsed manually in 'vanilla' Node functions
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON input" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = body; // Use the parsed body here
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI failed to respond", details: error.message });
  }
}
