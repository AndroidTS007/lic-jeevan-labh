/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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

export default function App() {
  const [activeTab, setActiveTab] = useState<"player" | "calculator" | "heatmap" | "studio" | "advisor">("player");
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [scenes, setScenes] = useState<Scene[]>([]);

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
              />
            )}
            
            {activeTab === "calculator" && (
              <Calculator />
            )}
            
            {activeTab === "heatmap" && (
              <SalesHeatmap />
            )}

            {activeTab === "studio" && (
              <StudioEditor 
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
