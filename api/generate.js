import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: "Invalid JSON" }); }
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Use "gemini-pro" for maximum compatibility if "gemini-1.5-flash" fails
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const { prompt } = body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Model Error:", error);
    res.status(500).json({ error: "Model error", details: error.message });
  }
}
