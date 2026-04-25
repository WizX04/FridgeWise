import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  let body = req.body;
  if (typeof body === 'string') {
    try { 
      body = JSON.parse(body); 
    } catch (e) { 
      return res.status(400).json({ error: "Invalid JSON" }); 
    }
  }

  const { prompt } = body;
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Use a variable for the model so we can swap it if needed
  let modelName = "gemini-3-flash-preview";
  const model = genAI.getGenerativeModel({ model: modelName });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ text: response.text() });

  } catch (error) {
    console.error("Gemini Error:", error);

    // Check if the error is due to high demand (503) or Not Found (404)
    const isBusy = error.message.includes("503") || error.message.includes("high demand");
    const isNotFound = error.message.includes("404");

    if (isBusy || isNotFound) {
      try {
        console.log("Primary model busy or unavailable. Attempting fallback to gemini-1.5-flash...");
        
        // Falling back to 1.5 Flash as it is extremely stable compared to preview models
        const backupModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await backupModel.generateContent(prompt);
        const response = await result.response;
        
        return res.status(200).json({ 
          text: response.text(),
          info: "Served by backup model due to high demand." 
        });
      } catch (backupErr) {
        return res.status(503).json({ 
          error: "Kitchen is temporarily overloaded", 
          details: "All AI models are currently experiencing high traffic. Please try again in a few seconds." 
        });
      }
    }

    // Generic error for anything else
    res.status(500).json({ error: "AI failed", details: error.message });
  }
}
