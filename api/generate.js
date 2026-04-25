import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: "Invalid JSON" }); }
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Try the most standard Flash string
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { prompt } = body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    
    // If Flash specifically fails with a 404, try the classic Pro model as a backup
    if (error.message.includes("404")) {
      try {
        const backupModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await backupModel.generateContent(body.prompt);
        const response = await result.response;
        return res.status(200).json({ text: response.text() });
      } catch (backupErr) {
        return res.status(500).json({ error: "All models failed", details: backupErr.message });
      }
    }

    res.status(500).json({ error: "AI failed", details: error.message });
  }
}
