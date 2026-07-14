# LIC NoteLLM Studio: Application Workflow List

This document lists the step-by-step user workflow and interactive stages of the **LIC NoteLLM Studio** application.

---

## 1. Storyboard Stage (Animated Player)
*   **Step 1.1:** App defaults to the `player` tab, loading the default `INITIAL_SCENES` configuration.
*   **Step 1.2:** The 16:9 cinematic aspect screen displays visual instructions, icons, and dynamic SVG graphics corresponding to the active chapter.
*   **Step 1.3:** Interactive audio engine fires browser-level Speech Synthesis (`window.speechSynthesis`) to speak narrator text in a Hinglish/Indian accent.
*   **Step 1.4:** User toggles playback elements:
    *   *Captions Toggle:* Syncs subtitles over the player.
    *   *Voiceover Toggle:* Activates/deactivates live speech synthesis.
    *   *Tempo Buttons:* Accelerates script playback (1x, 1.25x, 1.5x speed).
    *   *Volume & Scrub Bar:* Modifies audio output and jumps/resets index parameters.
*   **Step 1.5:** User clicks on the *Scene Chapters Index* in the right sidebar to teleport to specific script frames instantly.

---

## 2. Portfolio Combo Builder (Premium Planner)
*   **Step 2.1:** User clicks on the `calculator` tab and is presented with the **Interactive Portfolio Combo Builder**.
*   **Step 2.2:** User inputs key parameters in the control variables bar:
    *   *Proposer Entry Age:* Drags slider from age 18 to 50.
    *   *Savings Budget:* Drags monthly saving targets or clicks quick budget presets (₹2,500, ₹5,000, ₹10,000, ₹12,000, etc.).
    *   *Protection Term:* Selects 16, 21, or 25 years.
*   **Step 2.3:** User selects which plans to include in the combo (choosing from the 8 primary policies).
*   **Step 2.4:** User chooses a split strategy to allocate the savings budget:
    *   *Equal Split:* Spreads the monthly budget evenly.
    *   *Return Focus:* Skew-weights high-yield policies.
    *   *Shield Focus:* Skew-weights family protection term & premium waiver policies.
    *   *Custom Sliders:* Activates separate share sliders to manually divide budgets.
*   **Step 2.5:** App calculates combined metrics in the Ledger dashboard:
    *   *Combined Sum Assured* (family protection cover)
    *   *Total Premiums Paid* over the terms.
    *   *Combined Maturity Payout* (tax-exempt under Sec 10(10D)).
    *   *Survival Pension Yields* (tax-exempt annuities).
    *   *ROI Multiplier* and *Family Safety Score*.
*   **Step 2.6:** User reviews the unified **Year-by-Year Allocation Schedule** showing exactly how premiums are paid and when cashbacks are received.

---

## 3. Product Catalog Explorer
*   **Step 3.1:** User clicks the *Sovereign Catalog Explorer* tab in the Calculator module.
*   **Step 3.2:** User types into the search bar (filtering by name, plan number, feature, or UIN).
*   **Step 3.3:** User filters by category (Endowment, Whole Life, Money-Back, Term, Riders).
*   **Step 3.4:** User clicks individual plan blocks to expand comprehensive actuarial details:
    *   Maturity and Death benefits.
    *   Min/Max eligibility boundaries.
    *   Premium modes, loan liquidity details, and tax relief clauses.

---

## 4. Sales Intelligence & Prompt Generator
*   **Step 4.1:** User clicks the `heatmap` tab to inspect marketing intelligence.
*   **Step 4.2:** User clicks states on the interactive India schematic SVG map to view regional popularity levels and custom demographic priorities.
*   **Step 4.3:** User fine-tunes target audience parameters:
    *   *Age Band:* 18-25, 26-35, 36-50, or 50+ years.
    *   *Marital Status:* Single, Newlyweds, With Kids, or Retired.
*   **Step 4.4:** App automatically compiles a custom **NoteLLM Video Script Prompt** optimized with target audience parameters and regional highlights.
*   **Step 4.5:** User clicks *Copy Prompt* to copy the script template directly to their clipboard for external generative video platforms.

---

## 5. Script Storyboard Editor
*   **Step 5.1:** User clicks the `studio` tab to customize the active storyboard script.
*   **Step 5.2:** User navigates the active chapter bubbles to edit details of specific scenes (titles, duration, visual directives, overlay text elements, and voiceover text).
*   **Step 5.3:** User configures global variables:
    *   *Aspect Ratio Format:* 16:9 landscape, 9:16 vertical shorts, or 1:1 square.
    *   *Frame Rate:* 30 FPS or 60 FPS.
    *   *Background Music Track* and *Voice Narrator Duo*.
*   **Step 5.4:** User exports the modifications:
    *   Clicks *Copy Full Prompt* to get a complete Markdown storyboard document.
    *   Clicks *Export JSON Bundle* to download a structured JSON file of their project.

---

## 6. Mithra AI Advisor Chat
*   **Step 6.1:** User clicks the `advisor` tab to launch the interactive chat.
*   **Step 6.2:** User clicks on preset question prompts or types a custom question regarding age, budget, or family milestones.
*   **Step 6.3:** Express backend forwards the query history to `gemini-3.5-flash` with search grounding enabled.
*   **Step 6.4:** User reviews the advice, reads bullet points containing Hinglish expressions, and clicks the *Google Search Citations* bubble to directly cross-reference facts on the official LIC portal.
