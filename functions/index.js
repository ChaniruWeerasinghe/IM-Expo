const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Load OpenAI key from Firebase config
// Set later via: firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
const OPENAI_KEY = functions.config().openai?.key;
if (!OPENAI_KEY) {
  console.warn("⚠️ Missing OpenAI API key. Set with: firebase functions:config:set openai.key=\"...\"");
}

// Helper to trim and sanitize input
const safeText = (s) => (typeof s === "string" ? s.slice(0, 2000) : "");

// ---- Chat Endpoint ----
app.post("/chat", async (req, res) => {
  try {
    const userMessage = safeText(req.body?.message || "");
    const kb = req.body?.knowledge || [];

    if (!userMessage) {
      return res.status(400).json({ ok: false, answer: "Message required." });
    }

    // If OpenAI key missing → use local matching fallback
    if (!OPENAI_KEY) {
      const lower = userMessage.toLowerCase();
      const hit = kb.find((k) =>
        k.examples?.some((ex) => lower.includes(ex.toLowerCase()))
      );
      return res.json({
        ok: true,
        answer:
          hit?.answer ||
          "I couldn’t process your request right now. Please try again later.",
      });
    }

    const systemPrompt = `
You are the IM-Expo Assistant for a Sri Lanka–focused import/export platform.
Use only the provided knowledge items to answer. If a topic isn’t covered,
respond: "I'm not sure about that yet. Try our Resources page or Contact Us."

Match user intent to the closest knowledge.examples and return its 'answer'.
`;

    const knowledgeBlob = JSON.stringify(kb).slice(0, 15000);

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `User message: "${userMessage}"\n\nKnowledge items: ${knowledgeBlob}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 200,
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();

    return res.json({
      ok: true,
      answer:
        answer ||
        "I couldn’t process that question. Please try again or check the Resources page.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      answer:
        "Something went wrong while processing your request. Please try again later.",
    });
  }
});

// Export HTTP function endpoint
exports.api = functions.https.onRequest(app);
