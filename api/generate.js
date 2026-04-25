import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: "Invalid JSON" }); }
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Update to the latest 2026 model names
  // Try Gemini 3 Flash for speed, or 2.5 Flash for stability
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    const { prompt } = body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    
    // Automatic Fallback to 2.5 Pro if 3 Flash is unavailable
    if (error.message.includes("404")) {
      try {
        const backupModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
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
