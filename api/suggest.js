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
    const { prompt, max_tokens } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Fix: 1200 was too low — 4 detailed recommendations need ~2000-2500 tokens
    const safeMax = Math.max(Number(max_tokens) || 2500, 2500);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: safeMax
            // temperature removed — deprecated in gemini-3.6-flash
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

    const finishReason = data?.candidates?.[0]?.finishReason;

    const text = data?.candidates?.[0]?.content?.parts
      ?.map(part => part?.text || "")
      .join("")
      .trim();

    // Log finish reason so you can debug truncation in Vercel logs
    console.log("Gemini finishReason:", finishReason, "| text length:", text?.length);

    if (!text) {
      return res.status(502).json({
        error: `Gemini returned no text${finishReason ? ` (finish reason: ${finishReason})` : ""}.`
      });
    }

    // Warn if truncated (MAX_TOKENS means response was cut off)
    if (finishReason === "MAX_TOKENS") {
      console.warn("Response truncated — increase maxOutputTokens further if this persists");
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini proxy error:", error);
    return res.status(500).json({ error: "Unable to reach Gemini." });
  }
}
