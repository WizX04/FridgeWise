import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Parse body for Vercel
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: "Invalid JSON" }); }
  }

  // 2. Initialize with your API Key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // 3. Use the versioned model name which is more stable for the SDK
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const { prompt } = body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    // This will help you see the REAL error in Vercel logs if it fails again
    res.status(500).json({ error: "AI failed", details: error.message });
  }
}
