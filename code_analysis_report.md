# 🔍 Technical Codebase Analysis: LIC Jeevan Labh NoteLLM Studio

This document provides a detailed technical analysis of the **LIC Jeevan Labh NoteLLM Studio** application. It explores the directory structure, design patterns, core mathematical engines, backend services, third-party integrations (Supabase & Google Gemini), and frontend workflow components.

---

## 📂 Project Architecture & File Structure

The project is structured as a **full-stack TypeScript application** powered by a Vite-configured React client and an Express backend server.

### 1. Root Configurations
- [`package.json`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/package.json): Defines dependencies and script tasks. Uses `tsx` for launching `server.ts` directly in development, and compiles both React (Vite) and Node Express (`server.ts` bundled with `esbuild`) for production.
- [`tsconfig.json`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/tsconfig.json) & [`vite.config.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/vite.config.ts): Configurations for the TypeScript compiler and Vite asset builder (integrating `@tailwindcss/vite` v4).

### 2. Backend Engine
- [`server.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/server.ts): Express server hosting client-side assets and routing `/api/chat` calls to Google's Gemini models with Search Grounding tools.

### 3. Frontend Client (`src/`)
- [`main.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/main.tsx) & [`App.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/App.tsx): Main React application entry. Coordinates active workspace tabs (`player` | `calculator` | `heatmap` | `studio` | `advisor`), state synchronization, and dynamic scene list assembly.
- [`utils.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/utils.ts): Actuarial core housing mathematical logic for LIC calculations, budget allocation splits, and multi-policy portfolio simulation.
- [`types.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/types.ts): TypeScript interface and type declarations.
- [`data.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/data.ts) & [`plansData.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/plansData.ts): Static data models representing default scenes, buyer personas, regional metrics, and details for 27 certified LIC plans.
- [`supabaseClient.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/supabaseClient.ts): Initializes the Supabase client using environment variables.

### 4. Interactive Components (`src/components/`)
- [`AdvisorChat.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/components/AdvisorChat.tsx): AI chatbot interface with preset suggestions and citations helper.
- [`Calculator.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/components/Calculator.tsx): Multi-layered premium simulation dashboard (Individual, Portfolio, and Catalog views).
- [`SalesHeatmap.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/components/SalesHeatmap.tsx): Interactive SVG map of India illustrating regional demands and demographic prompt compiler.
- [`StudioEditor.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/components/StudioEditor.tsx): Custom script storyboard and prompt editor with export options.
- [`SovereignCatalogExplorer.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/components/SovereignCatalogExplorer.tsx): Database-integrated directory of LIC products.
- [`VideoPlayer.tsx`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/components/VideoPlayer.tsx): Narrative video storyboard simulator using browser-level Speech Synthesis.

---

## 🛠️ Deep-Dive: Core System Integrations

### A. Google Gemini 3.5 AI & Search Grounding
The backend exposes `/api/chat` to deliver real-time financial advisor features.

*   **SDK Initialization**: Implements the official `@google/genai` library:
    ```typescript
    const ai = new GoogleGenAI({ apiKey: apiKey });
    ```
*   **Search Grounding Integration**: Includes `tools: [{ googleSearch: {} }]` inside the call parameter block. This prompts Gemini to fetch live documentation or updates directly from the official `licindia.in` portal, rendering real-time search citations inside bubbles in the React UI:
    ```typescript
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: mappedContents,
      config: {
        systemInstruction: `You are "LIC Mithra", an elite, licensed Senior Indian Insurance Advisor...`,
        tools: [{ googleSearch: {} }],
      }
    });
    ```
*   **Hinglish / Cultural Persona**: The prompt commands the model to use warm Hinglish expressions like *"Behtareen Bachat"* and *"Kanyadan goals"* to enhance engagement with Indian users.

### B. Supabase Catalog Sync & Static Fallback
The `SovereignCatalogExplorer.tsx` component bridges cloud catalog storage and client static files.

*   **Dynamic Synchronization**: At mount, it issues a request to the `lic_catalog` table:
    ```typescript
    const { data, error } = await supabase.from("lic_catalog").select("*");
    ```
*   **Actuarial Mapping**: Converts the table's rows to uniform `LicPlan` and `LicRider` entities on-the-fly.
*   **Safety Fallback**: If `VITE_SUPABASE_URL` is missing or the request fails (e.g. database offline), the component catches the exception and falls back gracefully to `LIC_PLANS` and `LIC_RIDERS` imported from [`plansData.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/plansData.ts), guaranteeing zero UI interruptions.

---

## 🧮 Financial Simulation & Portfolio Strategy Math

The logic defined in [`utils.ts`](file:///c:/Users/akhil/OneDrive/Desktop/Python_code/github/lic-jeevan-labh/src/utils.ts) acts as the engine of the **Premium Planner**.

### 1. Single Policy Calculations: LIC Jeevan Labh (Plan 736)
The math maps entry age and premium paying terms to premium calculations:
*   **Premium Paying Term (PPT) & Rates**:
    *   **Term 16**: PPT is 10 years; baseline premium rate is ₹84.5 per thousand sum assured. Max age limit is 59.
    *   **Term 21**: PPT is 15 years; baseline premium rate is ₹54.2 per thousand sum assured. Max age limit is 54.
    *   **Term 25**: PPT is 16 years; baseline premium rate is ₹44.1 per thousand sum assured. Max age limit is 50.
*   **Age Adjustment**:
    ```typescript
    const ageFactor = (age - 30) * (policyTerm === 16 ? 0.28 : policyTerm === 21 ? 0.38 : 0.48);
    const adjustedRate = Math.max(20.0, baseRate + ageFactor);
    ```
*   **Taxes & surcharges**: Calculates standard GST rates (4.5% in Year 1, 2.25% in succeeding years).
*   **Bonus Declarations**:
    *   *Reversionary Bonus*: Projected at standard ₹55 per ₹1,000 Sum Assured per year.
    *   *Final Additional Bonus (FAB)*: Uses a progressive tier: Sum Assured $\ge$ ₹10L yields ₹110/k, $\ge$ ₹5L yields ₹55/k, $\ge$ ₹3L yields ₹35/k, otherwise ₹20/k.
    *   *Estimated Maturity*: Sum Assured + Reversionary Bonus + FAB.

### 2. Multi-Policy Portfolio Simulator
`simulatePortfolio` aggregates selected policies under a shared monthly budget constraint.
*   **Split Allocation Strategies**:
    *   **Equal Split**: Spreads budget equally across all selected policies.
    *   **Returns Focus**: Allocates a heavy 70% fraction to flagship returns-generating policies (`labh`, `anand`, `jeevan_akshay`), distributing the remaining 30% to safety term products.
    *   **Shield Focus**: Allocates 70% of the budget to protective and waiver schemes (`lakshya`, `jeevan_amar`, `umang`).
    *   **Custom**: Allows precise slider control scaling to 100% of the input budget.
*   **Proportional Scaling**:
    All outcomes (Sum Assured, Maturity, Annuity, Death benefit) are computed at a plan's default budget, then scaled down or up using a linear `scaleFactor` representing the policy's percentage share of the overall wallet budget:
    ```typescript
    const scaleFactor = totalMonthlyBudget > 0 ? allocatedMonthlyPremium / totalMonthlyBudget : 0;
    ```
*   **Risk Cover Index**: Scales based on policy composition: presence of pure Term cover adds +40 index points, while Anand and Lakshya add +25 points each.

---

## 📽️ Interactive Storyboarding: VideoPlayer Engine

The animated player operates on a simulation clock with local speech feedback.
*   **Dynamic Narration Sync**: Hooks directly into the browser's native Web Speech API (`window.speechSynthesis`).
*   **Regional Accent Matching**: Attempts to locate a local Indian dialect voice (`hi-IN` or `en-IN`) inside the browser's runtime environment, matching it to the target Hinglish scripts.
*   **Scene Teleportation**: Keeps track of `currentSceneIndex` matching the scene index list. External triggers (like tapping chapters or picking custom options) automatically update state and trigger an immediate speech reset.
