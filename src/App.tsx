/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Play, Calculator as CalcIcon, Compass, Edit3, Shield, Bot,
  Info, Award, ExternalLink, Moon, Sparkles, Landmark, Star, HelpCircle
} from "lucide-react";
import VideoPlayer from "./components/VideoPlayer";
import Calculator from "./components/Calculator";
import SalesHeatmap from "./components/SalesHeatmap";
import StudioEditor from "./components/StudioEditor";
import AdvisorChat from "./components/AdvisorChat";
import { Scene } from "./types";
import { LIC_PLANS } from "./plansData";
import { INITIAL_SCENES } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<"player" | "calculator" | "heatmap" | "studio" | "advisor">("player");
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  
  // Initialize portfolioSelectedIds from localStorage
  const [portfolioSelectedIds, setPortfolioSelectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("portfolioSelectedIds");
      return saved ? JSON.parse(saved) : ["labh", "anand", "umang"];
    } catch {
      return ["labh", "anand", "umang"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("portfolioSelectedIds", JSON.stringify(portfolioSelectedIds));
    } catch (e) {
      console.error(e);
    }
  }, [portfolioSelectedIds]);

  useEffect(() => {
    const getPlanNameAndNumber = (id: string) => {
      switch (id) {
        case "labh": return "LIC Jeevan Labh (Plan 736)";
        case "anand": return "LIC New Jeevan Anand (Plan 915)";
        case "umang": return "LIC Jeevan Umang (Plan 945)";
        case "lakshya": return "LIC Jeevan Lakshya (Plan 933)";
        case "bima_bachat": return "LIC New Bima Bachat (Plan 948)";
        case "jeevan_amar": return "LIC Jeevan Amar (Plan 855)";
        case "jeevan_akshay": return "LIC Jeevan Akshay-VII (Plan 857)";
        case "bhagya_lakshmi": return "LIC Bhagya Lakshmi (Plan 839)";
        default: {
          const p = LIC_PLANS.find(plan => plan.id === id);
          return p ? `${p.name} (Plan ${p.planNumber})` : id;
        }
      }
    };

    const planNames = portfolioSelectedIds.map(getPlanNameAndNumber).join(", ");
    
    // 1. Hook Scene
    const scenesList: Scene[] = [
      {
        id: 1,
        title: "Your Custom Portfolio Combo — Overview",
        duration: 12,
        visualDescription: "A personalized Indian family dashboard with floating icons representing your selected policies: " + planNames,
        narratorText: `Kya aapne apne safe investment portfolio ko check kiya hai? Aapne apne combo mein total ${portfolioSelectedIds.length} plans select kiye hain. Chaliye inke detail benefits dekhte hain!`,
        textOnScreen: [
          "Your Customized LIC Portfolio",
          `${portfolioSelectedIds.length} Safe Government Schemes`,
          "100% Tax Exempt & Capital Protected"
        ],
        icon: "Sliders",
        category: "introduction"
      }
    ];

    // 2. Dynamic Intro Scenes for EACH selected plan!
    portfolioSelectedIds.forEach((planId, index) => {
      const getPlanDetails = (id: string) => {
        switch (id) {
          case "labh": return { name: "LIC Jeevan Labh", plan: 736 };
          case "anand": return { name: "LIC New Jeevan Anand", plan: 915 };
          case "umang": return { name: "LIC Jeevan Umang", plan: 945 };
          case "lakshya": return { name: "LIC Jeevan Lakshya", plan: 933 };
          case "bima_bachat": return { name: "LIC New Bima Bachat", plan: 948 };
          case "jeevan_amar": return { name: "LIC Jeevan Amar", plan: 855 };
          case "jeevan_akshay": return { name: "LIC Jeevan Akshay-VII", plan: 857 };
          case "bhagya_lakshmi": return { name: "LIC Bhagya Lakshmi", plan: 839 };
          default: {
            const p = LIC_PLANS.find(plan => plan.id === id);
            return p ? { name: p.name, plan: p.planNumber } : { name: id, plan: "" };
          }
        }
      };

      const planDetails = getPlanDetails(planId);
      const sceneId = 100 + index; // Dynamic ID
      
      let highlightText = "Secure government-backed endowment growth with profit sharing.";
      if (planId === "umang") highlightText = "Whole life cover with guaranteed 8% annual survival payouts.";
      else if (planId === "anand") highlightText = "Double benefit: Maturity payout + LIFETIME FREE whole-life cover.";
      else if (planId === "lakshya") highlightText = "Child education buffer: Waiver of premium on parent decease.";
      else if (planId === "jeevan_amar") highlightText = "Pure term protection shield with high value family cover.";
      
      let iconName = "FileCheck";
      if (["labh", "anand", "umang", "lakshya", "bima_bachat", "jeevan_amar", "jeevan_akshay", "bhagya_lakshmi"].includes(planId)) {
        if (planId === "labh") iconName = "Award";
        else if (planId === "anand") iconName = "Heart";
        else if (planId === "umang") iconName = "Coins";
        else if (planId === "lakshya") iconName = "GraduationCap";
        else if (planId === "bima_bachat") iconName = "Layers";
        else if (planId === "jeevan_amar") iconName = "Shield";
        else if (planId === "jeevan_akshay") iconName = "Building";
        else if (planId === "bhagya_lakshmi") iconName = "Users";
      } else {
        const p = LIC_PLANS.find(plan => plan.id === planId);
        if (p) {
          if (p.category === "endowment") iconName = "GraduationCap";
          else if (p.category === "whole_life") iconName = "Heart";
          else if (p.category === "money_back") iconName = "Coins";
          else if (p.category === "term") iconName = "Shield";
        }
      }

      scenesList.push({
        id: sceneId,
        title: `Introducing ${planDetails.name}`,
        duration: 15,
        visualDescription: `A glowing golden scroll details the features of ${planDetails.name}. Government sovereign safety badge sparkles.`,
        narratorText: `${planDetails.name} — Plan Number ${planDetails.plan}. Yeh ek behtareen scheme hai jo ${highlightText} 100% safe hai aur stock market risks se mukt hai.`,
        textOnScreen: [
          planDetails.name,
          `Plan No. ${planDetails.plan}`,
          "Sovereign Capital Guarantee",
          "Tax Savings under Section 80C"
        ],
        icon: iconName,
        category: "details",
        associatedPlanId: planId // custom property to link back
      } as any);
    });

    // 3. Comparisons & Strategy Scene
    scenesList.push({
      id: 5,
      title: "Portfolio Budget Allocation",
      duration: 15,
      visualDescription: "A dynamic layout representing your monthly budget being distributed into secure safety baskets. Visual highlights show combined risk coverage index.",
      narratorText: "Is portfolio combo mein aapka premium safe plans mein divide hota hai. Yeh secure allocation aapko intermediate milestones aur lifelong safety dono provide karta hai.",
      textOnScreen: [
        "Interactive Portfolio Allocation",
        "Dual Benefit: Liquidity + Lifetime Cover",
        "Risk Cover Index Boosted"
      ],
      icon: "Layers",
      category: "features"
    });

    // 4. Combined Benefits Scene
    scenesList.push({
      id: 6,
      title: "Combined Maturity & Protection",
      duration: 20,
      visualDescription: "A large golden umbrella shielding a family, raining gold coins into a digital treasure chest representing compound maturity payouts.",
      narratorText: "Policy mature hone pe aapko sum assured ke saath saare accumulated bonuses milenge. Aur kisi bhi anhooni ki soorat mein, aapke parivar ko full tax-free death benefit milega.",
      textOnScreen: [
        "Maturity: Sum Assured + Accumulated Profits",
        "Death Shield: Sovereign Tax-Free Payouts",
        "Section 10(10D) Tax-Free Benefits"
      ],
      icon: "ShieldCheck",
      category: "benefits"
    });

    // 5. Call to Action (Zindagi Ke Saath Bhi...)
    scenesList.push({
      id: 11,
      title: "Secure Your Family's Future Today",
      duration: 12,
      visualDescription: "Pulsing LIC Logo with the national motto. Golden sparks represent guaranteed financial security.",
      narratorText: "Zindagi ke saath bhi, zindagi ke baad bhi. Apne aur apne parivar ke sapno ko aaj hi secure kijiye. Trusted LIC consultant se aaj hi baat kijiye!",
      textOnScreen: [
        "LIC of India — Trust Since 1956",
        "Secure Your Combo Plan Today",
        "Contact Your LIC Representative"
      ],
      icon: "Heart",
      category: "conclusion"
    });

    setScenes(scenesList);
  }, [portfolioSelectedIds]);

  // Synchronizers
  const handleSceneChange = (sceneId: number) => {
    setSelectedSceneId(sceneId);
  };

  const handleUpdateScenes = (updatedScenes: Scene[]) => {
    setScenes(updatedScenes);
  };

  const handleSelectSceneFromEditor = (sceneId: number) => {
    setSelectedSceneId(sceneId);
    setActiveTab("player"); // Teleport view back to player stage
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#ffd700] selection:text-[#003087]">
      
      {/* HEADER BAR */}
      <header className="bg-[#003087] border-b border-[#ffd700] shadow-md sticky top-0 z-40 px-4 md:px-6">
        <div className="max-w-7xl mx-auto py-3 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white rounded-sm flex items-center justify-center font-display font-black text-[#003087] border-2 border-[#ffd700] shadow-sm shrink-0">
              <span className="text-sm">LIC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#ffd700] text-[#003087] font-sans font-bold px-2 py-0.5 rounded shadow-sm">
                  NOTELLM PROMPT ORCHESTRATOR
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-sans font-bold px-2 py-0.5 rounded uppercase shadow-sm">
                  PLAN 736
                </span>
              </div>
              <h1 className="text-base md:text-lg font-display font-bold text-white tracking-tight uppercase leading-tight mt-1">
                NoteLLM <span className="text-[#ffd700]">Prompt Orchestrator</span>
              </h1>
            </div>
          </div>

          {/* Core Navigation Tabs */}
          <nav className="flex flex-wrap gap-1 p-1 bg-[#002466] rounded border border-[#003dbd]/50">
            <button
              onClick={() => setActiveTab("player")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                activeTab === "player"
                  ? "bg-[#ffd700] text-[#003087] font-extrabold shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-[#002f85]"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Animated Player</span>
            </button>

            <button
              onClick={() => setActiveTab("calculator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                activeTab === "calculator"
                  ? "bg-[#ffd700] text-[#003087] font-extrabold shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-[#002f85]"
              }`}
            >
              <CalcIcon className="w-3.5 h-3.5" />
              <span>Premium Planner</span>
            </button>

            <button
              onClick={() => setActiveTab("heatmap")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                activeTab === "heatmap"
                  ? "bg-[#ffd700] text-[#003087] font-extrabold shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-[#002f85]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sales Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                activeTab === "studio"
                  ? "bg-[#ffd700] text-[#003087] font-extrabold shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-[#002f85]"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Prompt Editor</span>
            </button>

            <button
              onClick={() => setActiveTab("advisor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                activeTab === "advisor"
                  ? "bg-[#ffd700] text-[#003087] font-extrabold shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-[#002f85]"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Mithra AI Chat</span>
            </button>
          </nav>

        </div>
      </header>

      {/* SUB-HEADER INFOLINE ADVISORY */}
      <div className="bg-[#fffdf0] text-[#003087] border-b border-amber-200 py-2.5 px-4 md:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs font-sans">
          <div className="flex items-center gap-2 text-[#003087]">
            <Info className="w-4 h-4 shrink-0 text-[#003087]" />
            <span className="font-semibold text-slate-800">
              National Campaign Highlight: <span className="text-[#003087] font-extrabold">Limited premium payment plans completely insulate children's milestones from equity market recessions.</span>
            </span>
          </div>
          <span className="text-[10px] bg-amber-100 text-[#003087] font-sans font-bold px-2 py-0.5 rounded border border-amber-200 shadow-sm">
            Sovereign Central Guarantee: Section 37 (LIC Act 1956)
          </span>
        </div>
      </div>

      {/* CORE WORKSPACE STAGE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Main stage (Col span 9) */}
          <div className="xl:col-span-9 space-y-6">
            {activeTab === "player" && (
              <VideoPlayer 
                onSceneChange={handleSceneChange} 
                selectedSceneId={selectedSceneId} 
                scenes={scenes}
                portfolioSelectedIds={portfolioSelectedIds}
              />
            )}
            
            {activeTab === "calculator" && (
              <Calculator 
                portfolioSelectedIds={portfolioSelectedIds}
                setPortfolioSelectedIds={setPortfolioSelectedIds}
              />
            )}
            
            {activeTab === "heatmap" && (
              <SalesHeatmap />
            )}

            {activeTab === "studio" && (
              <StudioEditor 
                scenes={scenes}
                onUpdateScenes={handleUpdateScenes} 
                onSelectScene={handleSelectSceneFromEditor} 
              />
            )}

            {activeTab === "advisor" && (
              <AdvisorChat />
            )}
          </div>

          {/* Quick facts sidebar list (Col span 3) */}
          <div className="xl:col-span-3 space-y-4">
            
            {/* Quick Pitch card */}
            <div className="bg-white rounded border border-slate-200 p-4 shadow-sm space-y-3.5">
              <h3 className="text-[10px] font-sans text-slate-500 uppercase tracking-widest font-bold border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#003087]" />
                Jeevan Labh Parameters
              </h3>

              <div className="space-y-3 text-xs">
                
                {/* 1 */}
                <div className="space-y-0.5">
                  <span className="block font-sans text-[9px] text-[#003087] uppercase font-bold">Plan Categories:</span>
                  <p className="text-slate-800 font-semibold leading-snug">
                    Limited Premium, Non-Linked, With-profit Endowment Plan
                  </p>
                </div>

                {/* 2 */}
                <div className="space-y-0.5">
                  <span className="block font-sans text-[9px] text-[#003087] uppercase font-bold">Admissible Ages:</span>
                  <p className="text-slate-800 font-semibold">
                    8 Years Minimum to 59 Years Maximum
                  </p>
                </div>

                {/* 3 */}
                <div className="space-y-0.5">
                  <span className="block font-sans text-[9px] text-[#003087] uppercase font-bold">Flexible PPTs (Pay Less!):</span>
                  <p className="text-slate-800 font-semibold">
                    10 Yrs (Term 16) | 15 Yrs (Term 21) | 16 Yrs (Term 25)
                  </p>
                </div>

                {/* 4 */}
                <div className="space-y-0.5">
                  <span className="block font-sans text-[9px] text-[#003087] uppercase font-bold">LIC Current Bonus rate:</span>
                  <p className="text-[#003087] font-bold text-xs">
                    ₹55 per ₹1,000 Sum Assured per policy year
                  </p>
                </div>

                {/* 5 */}
                <div className="space-y-0.5">
                  <span className="block font-sans text-[9px] text-[#003087] uppercase font-bold">Sovereign Guarantee Status:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed italic">
                    Sovereign capital shield underwritten by the Indian Parliament (LIC Act, 1956).
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Milestone Calculator Prompt Shortcuts */}
            <div className="bg-white rounded border border-slate-200 p-4 shadow-sm space-y-3">
              <h4 className="text-[10px] font-sans text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#003087]" />
                Milestone Target Presets
              </h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Need a quick financial goal outline? Choose the dynamic tab view above and utilize standard rates.
              </p>
              
              <div className="space-y-1.5 pt-1 text-[11px] font-sans font-semibold">
                <button 
                  onClick={() => setActiveTab("calculator")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-150 flex justify-between items-center text-slate-700"
                >
                  <span>🎓 Child Education target</span>
                  <span className="text-[#003087] font-bold">&gt;&gt;</span>
                </button>
                <button 
                  onClick={() => setActiveTab("calculator")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-150 flex justify-between items-center text-slate-700"
                >
                  <span>💍 Child Wedding target</span>
                  <span className="text-[#003087] font-bold">&gt;&gt;</span>
                </button>
                <button 
                  onClick={() => setActiveTab("calculator")}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-150 flex justify-between items-center text-slate-700"
                >
                  <span>👴 Safe Retirement target</span>
                  <span className="text-[#003087] font-bold">&gt;&gt;</span>
                </button>
              </div>
            </div>

            {/* Indian Trust stats tag */}
            <div className="p-4 bg-gradient-to-b from-blue-50/50 to-blue-50/10 border border-slate-200 rounded text-center space-y-1.5 shadow-sm">
              <Award className="w-7 h-7 text-[#003087] mx-auto animate-pulse" />
              <h4 className="text-xs font-bold text-[#003087] uppercase tracking-wider">
                Sovereign Trust Catalyst
              </h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                Over 25 Crore Indian households are protected by standard government and parliament-approved wealth safety rules.
              </p>
            </div>
            
          </div>
        </div>
      </main>

      {/* FOOTER GENERAL ASSURANCE DISCLAIMERS */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 mt-auto shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs text-slate-500 font-sans">
          
          <div className="space-y-1">
            <p className="font-bold text-[#003087]">
              LIC Jeevan Labh NoteLLM Animated Prompt Studio
            </p>
            <p className="max-w-lg leading-relaxed text-[11px] text-slate-600">
              Disclaimer: This application is a dynamic storyboard, simulator, and video creator preview tool generated based on NoteLLM prompt formats. Projections, premium valuations, and bonus rates (₹55 per ₹1000 sum assured) match standard 2024-2025 schedules and are intended for visualization under plan 736 rules. Please consult standard LIC policy circular documents for definitive illustrations before investing.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-[10.5px] font-sans font-semibold shrink-0">
            <span className="text-slate-700">Sovereign Security Guarantee - Plan 736</span>
            <div className="flex gap-2 text-slate-600 bg-slate-50 px-3 py-1 rounded border border-slate-200 shrink-0">
              <span>Secure Underwriting Active</span>
              <span className="text-emerald-600 font-bold">● Live</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
