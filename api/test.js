export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Check if Gemini key exists
  const keyExists = !!process.env.GEMINI_API_KEY;
  const keyPreview = process.env.GEMINI_API_KEY
    ? process.env.GEMINI_API_KEY.slice(0, 8) + "..."
    : "NOT SET";

  // Try calling Gemini with a simple test
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say hello in one word" }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        status: "❌ Gemini API Error",
        keyExists,
        keyPreview,
        geminiError: data?.error?.message || "Unknown error",
        fix: "Check your GEMINI_API_KEY in Vercel environment variables"
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({
      status: "✅ Everything working!",
      keyExists,
      keyPreview,
      geminiResponse: text
    });

  } catch (err) {
    return res.status(200).json({
      status: "❌ Connection Error",
      keyExists,
      keyPreview,
      error: err.message
    });
  }
}
