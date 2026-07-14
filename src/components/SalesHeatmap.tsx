import React, { useState } from "react";
import { 
  Compass, Flame, MapPin, Users, HelpCircle, GraduationCap, 
  Heart, Landmark, ShieldCheck, HelpCircle as HelpIcon, ArrowRight,
  TrendingUp, Star, Sparkles
} from "lucide-react";
import { SalesRegion } from "../types";
import { REGIONAL_SALES_REGIONS } from "../data";

export default function SalesHeatmap() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("UP");
  const [activeAgeSegment, setAgeSegment] = useState<string>("26-35");
  const [activeMaritalStatus, setMaritalStatus] = useState<string>("families");

  const activeRegion = REGIONAL_SALES_REGIONS.find((r) => r.id === selectedRegionId) || REGIONAL_SALES_REGIONS[0];

  const compiledNoteLLMPrompt = React.useMemo(() => {
    return `Create a 2.5–3 minute animated explainer video in a vibrant, clean infographic style. Use LIC's official brand colors: Deep Blue (#003087), Gold (#FFD700), and White.

TARGET AUDIENCE: Age band ${activeAgeSegment} years old with family status: ${activeMaritalStatus === "families" ? "Married with young children" : activeMaritalStatus === "newlyweds" ? "Newly married double income" : activeMaritalStatus === "single" ? "Single corporate professional" : "Senior retiree"}.

SCENE 1: Hook & Demographic pain points. Focus on their core goal: "${maritalStatusDetails[activeMaritalStatus].riskProfile}". Highlight standard market volatility versus reliable returns.
SCENE 2: The Actionable Solution. Showcase a customized sovereign combination: "${maritalStatusDetails[activeMaritalStatus].combo}". Show year-by-year cash accumulation.
SCENE 3: Parliamentary Sovereignty. Explain Section 37 Guarantee of LIC Act 1956. Show a shield underwritten by the Indian parliament.
SCENE 4: CTA. Call an LIC expert to optimize tax relief under Section 80C and 10(10D).`;
  }, [activeAgeSegment, activeMaritalStatus]);

  // Helper for rendering fire icons based on demand level
  const renderDemandFlame = (level: number) => {
    return (
      <div className="flex items-center gap-0.5 text-orange-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Flame 
            key={i} 
            className={`w-3.5 h-3.5 ${i < level ? "fill-orange-500 text-orange-500 scale-110" : "text-slate-800"}`} 
          />
        ))}
      </div>
    );
  };

  // Helper for getting specific milestone icons based on state priorities
  const getMilestoneIcon = (id: string) => {
    switch (id) {
      case "UP":
      case "KA":
        return <GraduationCap className="w-8 h-8 text-yellow-400" />;
      case "MH":
      case "DL":
        return <Landmark className="w-8 h-8 text-blue-400" />;
      case "TN":
      case "WB":
      case "BR":
        return <Heart className="w-8 h-8 text-red-400" />;
      case "RJ":
      case "MP":
      case "GJ":
        return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden p-6" id="sales-intelligence">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#003087] text-[#ffd700] p-2.5 rounded border border-[#ffd700]/30 shadow-sm">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans tracking-wider font-extrabold text-[#003087]">
              National Market Coverage Index
            </span>
            <h2 className="text-xl font-display font-extrabold text-[#003087] tracking-tight">
              LIC Jeevan Labh Sales Intelligence Map
            </h2>
          </div>
        </div>

        <div className="text-xs text-slate-700 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 font-semibold shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping inline-block relative top-[-1px]" />
          <span>Real-Time Territory High-Demand Heatmaps</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT Grid/Map Panel (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-4 bg-slate-50 rounded border border-slate-200 relative overflow-hidden flex flex-col justify-between h-[420px] shadow-sm">
            
            {/* Soft geometric background grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
            
            <div className="z-10 bg-white/95 p-2 rounded border border-slate-200 text-[10px] text-slate-600 font-sans font-bold flex justify-between items-center shadow-sm">
              <span>🌐 CLICK NODES TO TELEPORT MAP INSIGHTS</span>
              <span className="text-[#003087] font-extrabold">Heat Level: Flame Star</span>
            </div>

            {/* HIGH TECH SCHEMATIC MAP OF INDIA SVG CANVAS */}
            <div className="relative flex-1 w-full flex items-center justify-center py-4 z-10">
              <svg 
                className="w-full max-w-sm h-full" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified outline mapping helper of Indian Subcontinent for high aesthetic fidelity */}
                <path 
                  d="M44 8 C48 10, 52 7, 50 14 C48 18, 48 20, 52 23 C55 25, 60 21, 62 25 C64 30, 54 30, 56 34 C58 37, 65 37, 67 36 C70 38, 72 37, 72 40 C72 44, 66 43, 67 46 C69 49, 78 49, 75 53 C71 55, 68 53, 66 56 C61 59, 58 63, 56 68 C53 72, 49 76, 47 80 C46 84, 45 88, 44 92 C42 92, 41 85, 40 81 C38 75, 36 71, 37 66 C38 60, 31 59, 28 54 C25 49, 18 48, 20 44 C22 41, 26 43, 28 38 C30 33, 31 29, 36 29 C40 29, 41 24, 44 20 C46 16, 42 12, 44 8 Z" 
                  fill="#f8fafc" 
                  stroke="#cbd5e1" 
                  strokeWidth="0.8" 
                  strokeDasharray="2 2"
                  className="transition-all duration-700"
                />

                {/* Draw connection lines to show network relationship */}
                {REGIONAL_SALES_REGIONS.map((state) => (
                  <line
                    key={`line-${state.id}`}
                    x1="45"
                    y1="48"
                    x2={state.coordinates.x}
                    y2={state.coordinates.y}
                    stroke={`${selectedRegionId === state.id ? "#003087" : "#cbd5e1"}`}
                    strokeWidth={selectedRegionId === state.id ? "0.6" : "0.3"}
                    className="transition-all duration-300 pointer-events-none"
                  />
                ))}

                {/* Central India Anchor Hub */}
                <circle cx="45" cy="48" r="1.5" fill="#003087" />

                {/* State Node Plot points */}
                {REGIONAL_SALES_REGIONS.map((state) => {
                  const isSelected = selectedRegionId === state.id;
                  return (
                    <g 
                      key={state.id} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedRegionId(state.id)}
                    >
                      {/* Pulse circle for top tier demand */}
                      {state.demand === 5 && (
                        <circle
                          cx={state.coordinates.x}
                          cy={state.coordinates.y}
                          r={isSelected ? "5" : "3.5"}
                          className="fill-orange-550/20 animate-ping"
                        />
                      )}

                      {/* State marker circle */}
                      <circle
                        cx={state.coordinates.x}
                        cy={state.coordinates.y}
                        r={isSelected ? "2.8" : "1.8"}
                        fill={isSelected ? "#003087" : state.color}
                        stroke="#ffffff"
                        strokeWidth="0.4"
                        className="transition-all duration-300 group-hover:scale-125"
                      />

                      {/* State short labels */}
                      <text
                        x={state.coordinates.x}
                        y={state.coordinates.y - 3}
                        fontSize="3.2"
                        fill={isSelected ? "#003087" : "#475569"}
                        fontWeight={isSelected ? "bold" : "normal"}
                        textAnchor="middle"
                        className="font-sans font-bold"
                      >
                        {state.id}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Float Legend guide in map box */}
              <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 p-2.5 rounded text-[8.5px] font-sans font-semibold space-y-1 z-10 text-slate-600 shadow-md">
                <p className="font-bold text-[#003087] text-[9px] uppercase border-b border-slate-150 pb-0.5">Heat Legend</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                  <span>UP / Maharashtra (Extreme Peak)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500/80 block" />
                  <span>South/Bengal Stronghold (High)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                  <span>Tier-2 / Business (Consistent)</span>
                </div>
              </div>
            </div>

            {/* Quick state-by-state selection chips at bottom */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-2 border-t border-slate-200 border-dashed z-10">
              {REGIONAL_SALES_REGIONS.map((state) => (
                <button
                  key={state.id}
                  onClick={() => setSelectedRegionId(state.id)}
                  className={`px-2 py-0.5 shrink-0 text-[10px] font-sans font-bold rounded transition-all ${
                    selectedRegionId === state.id
                      ? "bg-[#ffd700] text-[#003087] font-extrabold border border-[#ccae00] shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-150 border border-slate-250 animate-none cursor-pointer"
                  }`}
                >
                  {state.state.replace(" & Jharkhand", "").replace(" / Andhra", "")}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT Intelligence Detail Panel (Col span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Active selected state details card with rich demographics */}
          <div className="bg-slate-50 border border-slate-200 rounded p-5 space-y-4 shadow-sm">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-sans text-slate-500 font-bold">Selected Hub Territory</span>
                <h3 className="text-lg font-display font-bold text-[#003087] mt-0.5">
                  {activeRegion.state}
                </h3>
              </div>
              <div className="p-2 bg-white rounded shrink-0 border border-slate-200 shadow-sm animate-bounce">
                {getMilestoneIcon(activeRegion.id)}
              </div>
            </div>

            {/* Demographics Profile Segment */}
            <div className="border-t border-slate-200 pt-3 space-y-3.5">
              <span className="block text-[10px] uppercase font-sans text-[#003087] font-extrabold tracking-wider">
                Demographics & Buyer Persona Profile
              </span>

              {/* Popular Policy */}
              <div className="space-y-1">
                <span className="text-[9.5px] font-sans text-slate-500 font-bold block">Most Popular LIC Plan:</span>
                <div className="bg-white border border-blue-150 p-2 rounded text-xs shadow-3xs flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="text-[#003087] font-extrabold">
                    {activeRegion.id === "UP" ? "LIC Jeevan Lakshya (Plan 933 - Child Protection)" : 
                     activeRegion.id === "MH" ? "LIC Jeevan Labh (Plan 736 - Max Yield)" : 
                     activeRegion.id === "TN" ? "LIC Jeevan Umang (Plan 945 - Whole Life 8% Pension)" : 
                     activeRegion.id === "DL" ? "LIC New Jeevan Anand (Plan 915 - Double Cover)" : 
                     activeRegion.id === "BR" ? "LIC Jeevan Lakshya (Plan 933 - Kanyadan Goal)" : 
                     activeRegion.id === "RJ" ? "LIC Jeevan Umang (Plan 945 - Business Cushion)" : 
                     activeRegion.id === "MP" ? "LIC Jeevan Labh (Plan 736 - 21-Yr Saving Option)" : 
                     activeRegion.id === "KA" ? "LIC Jeevan Labh (Plan 736 - 16-Yr IT Hedge)" : 
                     "LIC Jeevan Labh (Plan 736)"}
                  </span>
                </div>
              </div>

              {/* Monthly Subscription Size */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div>
                  <span className="text-[9.5px] font-sans text-slate-500 font-bold block">Avg. Monthly Premium:</span>
                  <p className="text-slate-800 font-extrabold text-sm font-sans mt-0.5">
                    {activeRegion.id === "UP" ? "₹3,500 / Month" : 
                     activeRegion.id === "MH" ? "₹10,000 / Month" : 
                     activeRegion.id === "TN" ? "₹5,000 / Month" : 
                     activeRegion.id === "DL" ? "₹12,000 / Month" : 
                     activeRegion.id === "BR" ? "₹3,000 / Month" : 
                     activeRegion.id === "RJ" ? "₹3,500 / Month" : 
                     activeRegion.id === "MP" ? "₹3,000 / Month" : 
                     "₹4,200 / Month"}
                  </p>
                </div>
                <div>
                  <span className="text-[9.5px] font-sans text-slate-500 font-bold block">Avg. Buyer Age:</span>
                  <p className="text-[#003087] font-extrabold text-sm mt-0.5">
                    {activeRegion.id === "KA" ? "28 Years Old" : 
                     activeRegion.id === "MH" ? "29 Years Old" : 
                     activeRegion.id === "UP" ? "32 Years Old" : 
                     activeRegion.id === "TN" ? "38 Years Old" : 
                     activeRegion.id === "DL" ? "31 Years Old" : 
                     "33 Years Old"}
                  </p>
                </div>
              </div>

              {/* Marital Status Deep-Dive */}
              <div className="space-y-1">
                <span className="text-[9.5px] font-sans text-slate-500 font-bold block">Marital Status Ratio:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-[#003087]" />
                  <span className="text-xs text-slate-800 font-bold">
                    {activeRegion.id === "UP" || activeRegion.id === "BR" ? "94% Married with children" : 
                     activeRegion.id === "MH" || activeRegion.id === "KA" ? "58% Married, 42% Single Tech Professionals" : 
                     "84% Married Families / Risk-Averse Savers"}
                  </span>
                </div>
              </div>

              {/* Age Group Distribution Meter */}
              <div className="space-y-2 pt-1 border-t border-slate-150 border-dashed">
                <span className="text-[9.5px] font-sans text-slate-550 font-bold text-slate-550 block text-slate-500">Buyer Age Band Distributions:</span>
                
                <div className="space-y-1.5 text-[10px]">
                  {/* Category 1: Young (18-25) */}
                  <div>
                    <div className="flex justify-between font-semibold font-sans">
                      <span>Young Savers (18-25 Yrs)</span>
                      <span>
                        {activeRegion.id === "KA" ? "40%" : activeRegion.id === "MH" ? "30%" : "15%"}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: activeRegion.id === "KA" ? "40%" : activeRegion.id === "MH" ? "30%" : "15%" }} 
                      />
                    </div>
                  </div>

                  {/* Category 2: Core (26-35) */}
                  <div>
                    <div className="flex justify-between font-semibold font-sans">
                      <span>Establishers (26-35 Yrs)</span>
                      <span>
                        {activeRegion.id === "BR" ? "65%" : activeRegion.id === "UP" ? "60%" : "48%"}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#003087] rounded-full" 
                        style={{ width: activeRegion.id === "BR" ? "65%" : activeRegion.id === "UP" ? "60%" : "48%" }} 
                      />
                    </div>
                  </div>

                  {/* Category 3: Mid-Career (36-50) */}
                  <div>
                    <div className="flex justify-between font-semibold font-sans">
                      <span>Senior Savers (36-50 Yrs)</span>
                      <span>
                        {activeRegion.id === "TN" ? "50%" : activeRegion.id === "WB" ? "40%" : "25%"}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full" 
                        style={{ width: activeRegion.id === "TN" ? "50%" : activeRegion.id === "WB" ? "40%" : "25%" }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Qualitative analysis statement */}
            <div className="p-3.5 bg-blue-50 border border-blue-100 text-xs leading-relaxed text-slate-700 font-medium font-sans rounded">
              <span className="block text-[10px] font-sans text-[#003087] font-extrabold uppercase mb-1">Regional Catalyst Narrative</span>
              "{activeRegion.reason}"
            </div>

          </div>

          {/* Leaderboard comparisons stat bar */}
          <div className="bg-slate-50 border border-slate-200 rounded p-5 space-y-3 shadow-sm">
            <h4 className="text-[10px] font-sans text-slate-500 uppercase tracking-widest font-extrabold">
              National Volume Index Rank
            </h4>

            {/* Manual custom visual list chart */}
            <div className="space-y-2 text-[10.5px]">
              <div>
                <div className="flex justify-between font-sans font-bold text-[9px] mb-1">
                  <span className="text-slate-700">1. Uttar Pradesh (Child Milestone Safe-Havens)</span>
                  <span className="text-[#003087] font-extrabold">100% Volume Weight</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-sans font-bold text-[9px] mb-1">
                  <span className="text-slate-700">2. Maharashtra (Tax Shield & Wealth Accumulation)</span>
                  <span className="text-[#003087] font-extrabold">95% Volume Weight</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-sans font-bold text-[9px] mb-1">
                  <span className="text-slate-600">3. Tamil Nadu / Bengal (Traditional Pension Loyalty)</span>
                  <span className="text-slate-500 font-semibold">80% Volume Weight</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-700 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* NEW INTERACTIVE AGE & MARITAL DEMOGRAPHICS MATRIX DEEP-DIVE */}
      <div className="mt-8 border-t border-slate-200 pt-6 space-y-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#003087]" />
          <div>
            <h3 className="text-sm font-display font-black text-[#003087] uppercase tracking-wider">
              📊 National Demographics & Buyer Life-Stage Intelligence Matrix
            </h3>
            <p className="text-slate-550 text-xs font-semibold text-slate-500">
              Interactive matching index showcasing policy adoption cycles, marriage correlations, and regional triggers
            </p>
          </div>
        </div>

        {/* Demographics bento grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section A: Age Group Analyzer with selection state */}
          <div className="bg-slate-50 border border-slate-250 p-5 rounded space-y-3.5">
            <h4 className="text-xs font-bold text-[#003087] uppercase tracking-wide">
              1. Interactive Age Band Navigator
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              Select an age segment to reveal their core safety objectives, purchase habits, and target plans.
            </p>

            {/* Age segment select buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {["18-25", "26-35", "36-50", "50+"].map((segment) => (
                <button
                  key={segment}
                  onClick={() => setAgeSegment(segment)}
                  className={`p-1.5 rounded border text-[11px] font-sans font-bold transition-all cursor-pointer ${
                    activeAgeSegment === segment
                      ? "bg-[#003087] border-[#003594] text-[#ffd700] font-extrabold shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {segment} Yrs
                </button>
              ))}
            </div>

            {/* Age Segment detail result card */}
            <div className="bg-white p-3 rounded border border-slate-200 space-y-2.5 text-xs text-slate-700 font-semibold shadow-2xs">
              <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded">
                <span className="text-[10px] text-slate-500 uppercase font-sans">Core Primary Plan Match</span>
                <span className="text-[#003087] font-black">{ageSegmentDetails[activeAgeSegment].plan}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-1">
                <div>
                  <span className="text-[9px] text-slate-450 block uppercase text-slate-400">Adoption Density</span>
                  <span className="text-slate-800 text-xs font-bold">{ageSegmentDetails[activeAgeSegment].adoption}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-450 block uppercase text-slate-400">Avg Saving Pot</span>
                  <span className="text-[#003087] text-xs font-extrabold">{ageSegmentDetails[activeAgeSegment].saving}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-450 block uppercase text-slate-400">Family Milestone Aim</span>
                <p className="text-slate-800 leading-snug">{ageSegmentDetails[activeAgeSegment].milestone}</p>
              </div>

              <div className="space-y-0.5 border-t border-slate-100 pt-1.5">
                <span className="text-[9px] text-[#003087] block uppercase font-bold">Why they buy</span>
                <p className="text-slate-600 italic leading-snug text-[11px] font-medium">{ageSegmentDetails[activeAgeSegment].buyingReason}</p>
              </div>
            </div>
          </div>

          {/* Section B: Marital Status Matching Matrix */}
          <div className="bg-slate-50 border border-slate-250 p-5 rounded space-y-3.5">
            <h4 className="text-xs font-bold text-[#003087] uppercase tracking-wide">
              2. Marital Status & Life-Stage Matcher
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              Family composition dictates cash flow timelines. Choose a marital profile to assess optimal hedging:
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {["single", "newlyweds", "families", "retired"].map((status) => (
                <button
                  key={status}
                  onClick={() => setMaritalStatus(status)}
                  className={`p-1.5 rounded border text-[10px] font-sans font-bold transition-all uppercase cursor-pointer ${
                    activeMaritalStatus === status
                      ? "bg-[#003087] border-[#003594] text-[#ffd700] font-extrabold shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {status === "single" ? "Single Pro" : 
                   status === "newlyweds" ? "Newlyweds" : 
                   status === "families" ? "With Kids" : "Senior / Retiree"}
                </button>
              ))}
            </div>

            {/* Marital detail card */}
            <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-700 font-semibold space-y-2.5 shadow-2xs">
              <div className="flex justify-between items-center bg-emerald-50/50 p-2 rounded">
                <span className="text-[10px] text-slate-500 uppercase font-sans">Recommended Portfolio Combo</span>
                <span className="text-emerald-800 font-black">{maritalStatusDetails[activeMaritalStatus].combo}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-450 block uppercase text-slate-400">Risk Profile Shielding</span>
                <p className="text-slate-800 font-bold">{maritalStatusDetails[activeMaritalStatus].riskProfile}</p>
              </div>

              <div className="space-y-0.5 border-t border-slate-100 pt-1.5">
                <span className="text-[9px] text-orange-600 block uppercase font-bold">Tactical Financial Advice</span>
                <p className="text-slate-600 text-[11px] leading-snug font-medium italic">"{maritalStatusDetails[activeMaritalStatus].advice}"</p>
              </div>
            </div>
          </div>

        </div>

        {/* NOTELLM ACTUARIAL PROMPT GENERATOR */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-5 rounded border border-yellow-400/20 shadow-md">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="bg-[#ffd700] text-[#003087] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider block w-max">
                Live Prompt Synthesizer
              </span>
              <h4 className="text-sm font-display font-black text-white mt-1 uppercase">
                Generated NoteLLM Animated Video Prompt: Demographic Focus
              </h4>
              <p className="text-blue-105 text-[11px] mt-0.5 font-medium max-w-2xl text-slate-200">
                Compile and use this calibrated prompt to generate stunning 2.5-minute explainer cartoon scripts centered on {activeAgeSegment} years old savers with {activeMaritalStatus === "single" ? "independent career" : activeMaritalStatus === "families" ? "parent" : "saving"} milestones.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(compiledNoteLLMPrompt);
                alert("Calibrated NoteLLM Prompt copied to clipboard!");
              }}
              className="bg-[#ffd700] text-[#003087] font-sans font-bold hover:bg-yellow-400 text-[10px] px-3 py-1.5 rounded transition-all cursor-pointer shadow-sm shrink-0 uppercase active:scale-95"
            >
              📋 Copy Prompt
            </button>
          </div>

          <div className="mt-4 bg-blue-950/70 p-3.5 rounded border border-blue-800 font-mono text-[10px] text-cyan-200 leading-relaxed max-h-[170px] overflow-y-auto whitespace-pre-wrap select-all">
            {compiledNoteLLMPrompt}
          </div>
        </div>

      </div>

    </div>
  );
}

// Age Selector Data structure
const ageSegmentDetails: { [key: string]: any } = {
  "18-25": {
    plan: "LIC Jeevan Amar (Plan 855) / Bhagya Lakshmi (Plan 839)",
    adoption: "🔥 Moderate (25% volume share)",
    saving: "₹1,500 - ₹2,500 / Month",
    milestone: "Securing initial career shield, simple premium returns, tax optimization on early salary.",
    buyingReason: "Young professionals buy early to lock in structural low-entry premiums. E.g., securing ₹1 Crore life protection in Jeevan Amar at less than ₹800 monthly!"
  },
  "26-35": {
    plan: "LIC Jeevan Labh (Plan 736) / Jeevan Lakshya (Plan 933)",
    adoption: "🚀 Peak Density (55% volume share)",
    saving: "₹5,000 - ₹12,000 / Month",
    milestone: "Children higher education plans, wedding milestones financing, and first-tier family protection umbrella.",
    buyingReason: "This segment represent newlyweds or parents with young infants. They heavily favor Jeevan Lakshya because the integrated premium waiver ensures that children milestone corpuses are mathematically secure."
  },
  "36-50": {
    plan: "LIC Jeevan Umang (Plan 945) / New Bima Bachat (Plan 948)",
    adoption: "⚡ High (40% volume share)",
    saving: "₹8,000 - ₹20,000 / Month",
    milestone: "Compounding guaranteed income streams + intermediate milestone payouts for business or home expansions.",
    buyingReason: "Established cash flow individuals lock in Jeevan Umang for guaranteed 8% annual tax-exempt payouts starting right at the end of their pay term as lifetime corporate cushion pensions."
  },
  "50+": {
    plan: "LIC Jeevan Akshay-VII (Plan 857) / Pension Annuities",
    adoption: "🔥 Consistent (30% volume share)",
    saving: "₹12,000 - ₹25,000 / Month (or lumpsum)",
    milestone: "Guaranteed Immediate lifetime pension payouts, heritage legacy transfer for children/grandchildren.",
    buyingReason: "Pre-retirees transfer their provident funds or commercial legacy pools into immediate annuities, enjoying safe 7.5% sovereign-backed paychecks every single month."
  }
};

// Marital Selector Data structure
const maritalStatusDetails: { [key: string]: any } = {
  "single": {
    combo: "Jeevan Amar (Pure Term) + Jeevan Labh (Endowment)",
    riskProfile: "Aggressive wealth buildup with single-line risk indemnity",
    advice: "Optimize corporate salary tax caps (80C) immediately. Allocate 30% to high-value family umbrella cover (Jeevan Amar) and 70% to maximum compound payouts in Jeevan Labh to prepare early wedding or commercial funds."
  },
  "newlyweds": {
    combo: "LIC New Jeevan Anand + Jeevan Umang",
    riskProfile: "Dual asset cover + lifetime guaranteed passive cashflow backing",
    advice: "Lay down the baseline. Choose a 21-yr Jeevan Anand term to secure your combined family. Compound this with Jeevan Umang's 8% annual survival paybacks. This provides dual coverage and lifetime retirement pension security in one master stroke."
  },
  "families": {
    combo: "LIC Jeevan Lakshya (Plan 933 - Child Special) + Jeevan Labh",
    riskProfile: "Zero-compromise children milestones protection (integrated premium waiver)",
    advice: "Secure children first. Jeevan Lakshya automatically pays out 10% annual benefits to family on proposer decease, completely waives future premiums, and yields full maturity payouts unchanged. Match this with Jeevan Labh's limited premium paying cycle!"
  },
  "retired": {
    combo: "LIC Jeevan Akshay-VII + Single Premium Endowment",
    riskProfile: "Capital preservation with immediate guaranteed monthly pension",
    advice: "Insulate lifetime corpuses from financial market collapses. Allocate pools to Jeevan Akshay VII to start your immediate senior lifetime pension, with guaranteed premium refund to child nominees as clean heritage transfer blocks."
  }
};
