import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // AI Dashboard analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { reviews } = req.body;
      if (!reviews) {
        return res.status(400).json({ error: "No reviews provided" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Analyze these raw customer reviews and extract a customer sentiment report.
        
Reviews:
${reviews}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              timeline: {
                type: Type.ARRAY,
                description: "Sentiment over time. Assign realistic sequential dates from the past 30 days chronologically if none exist in the text.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
                    sentimentScore: { type: Type.NUMBER, description: "Average sentiment score between -100 (very negative) and 100 (very positive)" }
                  },
                  required: ["date", "sentimentScore"]
                }
              },
              wordCloud: {
                type: Type.ARRAY,
                description: "Most frequent words/themes (both complaints and praises)",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    weight: { type: Type.NUMBER, description: "Frequency weight (e.g. 1-100)" },
                    sentiment: { type: Type.STRING, description: "'positive', 'negative', or 'neutral'" }
                  },
                  required: ["word", "weight", "sentiment"]
                }
              },
              executiveSummary: {
                type: Type.STRING,
                description: "A professional executive summary of the overall sentiment."
              },
              actionableItems: {
                type: Type.ARRAY,
                description: "Top 3 actionable areas for improvement based on complaints.",
                items: { type: Type.STRING }
              }
            },
            required: ["timeline", "wordCloud", "executiveSummary", "actionableItems"]
          }
        }
      });

      let jsonStr = response.text || "{}";
      const parsed = JSON.parse(jsonStr);
      res.json(parsed);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // AI Assistant Chat stream
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message, contextData } = req.body;
      
      const contents = (history || []).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      let systemInstruction = "You are a customer sentiment analysis assistant. You help users understand the review dashboard data and answer questions about it.";
      if (contextData) {
        systemInstruction += `\n\nHere is the current dashboard data context:\n${JSON.stringify(contextData, null, 2)}`;
      }

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
        }
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err: any) {
      console.error("Chat Error:", err);
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
