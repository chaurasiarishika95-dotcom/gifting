export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY is not configured in Vercel." });

  try {
    const { prompt, max_tokens = 1200 } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: max_tokens,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data?.error || data);
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini API request failed"
      });
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map(part => part?.text || "")
      .join("")
      .trim();

    if (!text) {
      const finishReason = data?.candidates?.[0]?.finishReason;
      return res.status(502).json({
        error: `Gemini returned no text${finishReason ? ` (finish reason: ${finishReason})` : ""}.`
      });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini proxy error:", error);
    return res.status(500).json({ error: "Unable to reach Gemini." });
  }
}
