export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
 const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: 'API key missing in Vercel' });
  if (!prompt) return res.status(400).json({ error: 'No ingredients provided' });

  try {
    // Using 1.5-flash which is fast and stable
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
        // This will log the specific error from Google (like Invalid Key)
        console.error("Google API Error:", data);
        return res.status(response.status).json({ error: data.error?.message || "AI Error" });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ response: generatedText });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
