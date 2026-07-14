import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Chat with Google Search Grounding!
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY environment variable is not defined. Please add it in your Settings > Secrets." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // Map client messages format to Gemini SDK standard contents
      const mappedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const modelName = "gemini-3.5-flash"; // Recommended for general/search-grounded tasks

      const response = await ai.models.generateContent({
        model: modelName,
        contents: mappedContents,
        config: {
          systemInstruction: `You are "LIC Mithra", an elite, licensed Senior Indian Insurance Advisor and Financial Planner with 20+ years of expertise specializing in LIC policies.
Your objective is to help families select the absolute mathematically optimal insurance plan.
Adhere to the following rules:
1. Provide objective, precise financial guidance. Highlight premium terms (PPT), policy terms, Sovereign Protection benefits (under Section 37 of LIC Act 1956), tax benefits under Section 80C and Section 10(10D).
2. Use clear Indian numbering systems (Lakh, Crore, e.g., ₹2,500/month or ₹30,000/year).
3. Compare policies side-by-side where relevant. Specifically, you have complete knowledge across all 7 premium policy classifications:
   - Endowment Plans: LIC Jeevan Labh (Plan 736 - high yield, short premium cycles), LIC New Jeevan Anand (Plan 915 - dual benefit cover), LIC Jeevan Lakshya (Plan 933 - child educational waivers).
   - Whole Life Plans: LIC Jeevan Umang (Plan 945 - lifetime guaranteed 8% annual survival payouts after paying term).
   - Money-Back Plans: LIC New Bima Bachat (Plan 948 - regular cashback milestones every 5 years with high liquidity protection).
   - Term Assurance: LIC Jeevan Amar (Plan 855 / Tech Term 854 - massive crore-level protection umbrellas at tiny premium rates).
   - Pension/Annuity: LIC Jeevan Akshay-VII (Plan 857 - instant Senior Citizen monthly retirement pension annuity).
   - Micro Insurance: LIC Bhagya Lakshmi (Plan 839 - extremely cheap rural/sub-urban saver with return of premium).
   - Withdrawn Plans Context: Understand details of former historic products like old Bima Nivesh or Jeevan Tarang, explaining how modern active endowments represent better structural risk hedges today.
4. If asked about monthly budgets such as ₹2,500, ₹3,500, ₹5,000, ₹10,000, or ₹12,000, analyze mathematical splits, e.g.:
   - ₹2,500/mo: Core Endowment (Jeevan Labh) for baseline safety.
   - ₹3,500/mo: Joint protection (Jeevan Labh + Jeevan Amar Term shield).
   - ₹5,000/mo: Multi-leg Combo (Endowment Growth + Child Education Protector).
   - ₹10,000/mo+: Comprehensive Sovereign Wealth fortification combining 3-4 segments simultaneously (Anand + Umang + Bima Bachat).
5. Ground your recommendations on dynamic buyer trends: North/Central favor Money Back (agri buffers); West/South prioritize Whole Life & Pension annuities; Age groups map young term buyers to established families buying Lakshya.
6. Use Google Search grounding to retrieve real-time details from licindia.in or certified financial bulletins to confirm details. Keep your tone professional, authoritative, warm, and Indian-centric (incorporate Hinglish expressions like "Behtareen Bachat", "Kanyadan goals", "Sarkari Guarantee").`,
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || "No response text found.";
      const searchMetadata = response.candidates?.[0]?.groundingMetadata;

      res.json({ text, searchMetadata });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during generating content" });
    }
  });

  // Serve static assets or mount Vite dev server
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
