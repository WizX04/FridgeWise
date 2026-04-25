export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.GEMINI_API_KEY; 

  if (!API_KEY) {
    console.error("Vercel Error: GEMINI_API_KEY is not defined.");
    return res.status(500).json({ error: 'Server key configuration error' });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No ingredients provided' });

  // Use Flash Lite 3.1 for better free-tier availability
  const MODEL = "gemini-3.1-flash-lite-preview";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  // Retry logic settings
  const MAX_RETRIES = 2;
  let attempt = 0;

  async function callGemini() {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      // If we hit a rate limit (429) and haven't exhausted retries
      if (response.status === 429 && attempt < MAX_RETRIES) {
        attempt++;
        const waitTime = attempt * 2000; // Wait 2s, then 4s
        console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return callGemini(); 
      }

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: data.error?.message || "Gemini Service Error" 
        });
      }

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.status(200).json({ response: generatedText });

    } catch (error) {
      console.error('Fetch Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  await callGemini();
}
