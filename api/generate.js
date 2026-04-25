export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Use the key name you have in Vercel
  const API_KEY = process.env.GEMINI_API_KEY; 

  if (!API_KEY) {
    console.error("Vercel Error: GEMINI_API_KEY is not defined in Environment Variables.");
    return res.status(500).json({ error: 'Server key configuration error' });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No ingredients provided' });

  try {
    // Gemini 3 Flash Preview - Fast, powerful, and requires v1beta
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google AI Error:", data);
      return res.status(response.status).json({ 
        error: data.error?.message || "Gemini 3 Service Error" 
      });
    }

    // Return the text back to your FridgeWise dashboard
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ response: generatedText });

  } catch (error) {
    console.error('Crash Log:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
