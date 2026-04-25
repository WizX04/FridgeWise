import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // This pulls the key from Vercel's secret settings
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Sends the AI's answer back to your HTML page
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: "AI failed to respond", details: error.message });
  }
}
