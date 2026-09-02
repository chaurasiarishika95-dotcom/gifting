export default async function handler(req, res) {
  const keyExists = !!process.env.GEMINI_API_KEY;

  if (!keyExists) {
    return res.status(500).json({
      status: "❌ GEMINI_API_KEY is not configured",
      keyExists: false
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Reply with exactly one word: Hello" }] }],
          generationConfig: { maxOutputTokens: 10, temperature: 0 }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        status: "❌ Gemini API Error",
        keyExists: true,
        geminiError: data?.error?.message || "Unknown Gemini error"
      });
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map(part => part?.text || "")
      .join("")
      .trim() || "";

    return res.status(200).json({
      status: text ? "✅ Everything working!" : "⚠️ Gemini connected but returned no text",
      keyExists: true,
      geminiResponse: text
    });
  } catch (err) {
    return res.status(500).json({
      status: "❌ Connection Error",
      keyExists: true,
      error: err.message
    });
  }
}
