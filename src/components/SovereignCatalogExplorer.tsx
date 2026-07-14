import React, { useState, useMemo } from "react";
import { 
  Search, Shield, Info, Calendar, Award, GraduationCap, 
  Coins, Heart, ShieldCheck, ChevronDown, ChevronUp, BookOpen, 
  Bookmark, CheckCircle, Sparkles, Filter, HelpCircle
} from "lucide-react";
import { LIC_PLANS, LIC_RIDERS } from "../plansData";
import { LicPlan, LicRider } from "../types";

export default function SovereignCatalogExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "endowment" | "whole_life" | "money_back" | "term" | "riders">("all");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  // Filter logic
  const filteredPlans = useMemo(() => {
    return LIC_PLANS.filter(plan => {
      // Category filter
      if (activeFilter !== "all" && plan.category !== activeFilter) {
        return false;
      }
      
      // Search query filter
      if (searchQuery.trim() === "") return true;
      const query = searchQuery.toLowerCase();
      return (
        plan.name.toLowerCase().includes(query) ||
        plan.planNumber.toString().includes(query) ||
        plan.uin.toLowerCase().includes(query) ||
        plan.bestFor.toLowerCase().includes(query) ||
        plan.features.some(f => f.toLowerCase().includes(query))
      );
    });
  }, [activeFilter, searchQuery]);

  const filteredRiders = useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "riders") return [];
    
    return LIC_RIDERS.filter(rider => {
      if (searchQuery.trim() === "") return true;
      const query = searchQuery.toLowerCase();
      return (
        rider.name.toLowerCase().includes(query) ||
        rider.uin.toLowerCase().includes(query) ||
        rider.purpose.toLowerCase().includes(query) ||
        rider.keyBenefit.toLowerCase().includes(query)
      );
    });
  }, [activeFilter, searchQuery]);

  // Icons corresponding to categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "endowment":
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case "whole_life":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "money_back":
        return <Coins className="w-4 h-4 text-emerald-500" />;
      case "term":
        return <Shield className="w-4 h-4 text-indigo-500" />;
      default:
        return <Award className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "endowment": return "Endowment Savings";
      case "whole_life": return "Whole Life Income";
      case "money_back": return "Periodic Money Back";
      case "term": return "Pure Term Shield";
      default: return "Sovereign Plan";
    }
  };

  return (
    <div className="space-y-6" id="catalog-explorer">
      
      {/* Search and Filters panel */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4.5 space-y-4 shadow-3xs">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 27 flagship plans & 7 riders by name, plan number, feature, or UIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs font-semibold rounded px-4 py-3 pl-10 border border-slate-250 focus:outline-[#003087]"
            />
          </div>

          {/* Quick Counter */}
          <div className="bg-white px-3 py-2 rounded border border-slate-200 text-center shrink-0">
            <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">Matched Resources</span>
            <span className="text-sm font-sans font-black text-[#003087]">
              {filteredPlans.length} Plans {activeFilter === "all" || activeFilter === "riders" ? `+ ${filteredRiders.length} Riders` : ""}
            </span>
          </div>

        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded text-xs font-bold font-sans cursor-pointer transition-all border ${
              activeFilter === "all"
                ? "bg-[#003087] text-[#ffd700] border-[#003087] font-extrabold shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            All Products (27 Plans &amp; 7 Riders)
          </button>

          <button
            onClick={() => setActiveFilter("endowment")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-sans cursor-pointer transition-all border ${
              activeFilter === "endowment"
                ? "bg-[#003087] text-[#ffd700] border-[#003087] font-extrabold shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            <span>Endowments (11 Plans)</span>
          </button>

          <button
            onClick={() => setActiveFilter("whole_life")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-sans cursor-pointer transition-all border ${
              activeFilter === "whole_life"
                ? "bg-[#003087] text-[#ffd700] border-[#003087] font-extrabold shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span>Whole Life (3 Plans)</span>
          </button>

          <button
            onClick={() => setActiveFilter("money_back")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-sans cursor-pointer transition-all border ${
              activeFilter === "money_back"
                ? "bg-[#003087] text-[#ffd700] border-[#003087] font-extrabold shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-500" />
            <span>Money-Back (5 Plans)</span>
          </button>

          <button
            onClick={() => setActiveFilter("term")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-sans cursor-pointer transition-all border ${
              activeFilter === "term"
                ? "bg-[#003087] text-[#ffd700] border-[#003087] font-extrabold shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Term Shields (8 Plans)</span>
          </button>

          <button
            onClick={() => setActiveFilter("riders")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-sans cursor-pointer transition-all border ${
              activeFilter === "riders"
                ? "bg-[#003087] text-[#ffd700] border-[#003087] font-extrabold shadow-sm"
                : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sovereign Riders (7 Riders)</span>
          </button>
        </div>
      </div>

      {/* Flagship Plans Grid Section */}
      {filteredPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-[#003087] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Certified sovereign LIC Plans ({filteredPlans.length})</span>
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {filteredPlans.map((plan) => {
              const isExpanded = expandedPlanId === plan.id;
              return (
                <div 
                  key={plan.id}
                  className={`bg-white rounded-xl border transition-all ${
                    isExpanded 
                      ? "border-[#003087] shadow-md ring-1 ring-[#003087]/20" 
                      : "border-slate-200 hover:border-slate-350 shadow-5xs hover:shadow-4xs"
                  }`}
                >
                  {/* Header click bar */}
                  <div 
                    onClick={() => handleToggleExpand(plan.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      {/* Left icon wrapper */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 shrink-0">
                        {getCategoryIcon(plan.category)}
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-sans font-bold leading-none">
                          <span className="bg-[#ffd700]/25 text-[#003087] border border-yellow-400/30 px-1.5 py-0.5 rounded uppercase">
                            PLAN {plan.planNumber}
                          </span>
                          <span className="text-slate-500 uppercase">
                            UIN: {plan.uin}
                          </span>
                          <span className="text-slate-400">
                            | {getCategoryLabel(plan.category)}
                          </span>
                        </div>
                        
                        <h4 className="text-sm font-display font-extrabold text-[#003087] leading-tight mt-1 truncate">
                          {plan.name}
                        </h4>
                        
                        <p className="text-slate-500 text-[11px] leading-tight mt-0.5 font-medium truncate">
                          Best for: {plan.bestFor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:block text-right">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">Min Cover Size</span>
                        <span className="text-xs font-sans font-black text-slate-700">₹{plan.minSumAssured.toLocaleString("en-IN")}</span>
                      </div>
                      
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanding body details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-4 animate-fade-in text-xs font-sans text-slate-700 leading-relaxed font-semibold">
                      
                      {/* Features lists */}
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] font-mono text-[#003087] uppercase font-black tracking-wider block">Key Actuarial Features:</h5>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex gap-2 items-start bg-white p-2 rounded border border-slate-150">
                              <CheckCircle className="w-4 h-4 text-[#003087] shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits grids */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="space-y-1 bg-white p-3 rounded border border-slate-150">
                          <span className="text-[9px] font-mono text-emerald-700 uppercase font-bold block">🏆 Maturity Survival Benefit:</span>
                          <p className="text-[11px] leading-snug text-slate-700 font-medium">{plan.maturityBenefit}</p>
                        </div>
                        <div className="space-y-1 bg-white p-3 rounded border border-slate-150">
                          <span className="text-[9px] font-mono text-indigo-700 uppercase font-bold block">🛡️ Standard Death Cover Guarantee:</span>
                          <p className="text-[11px] leading-snug text-slate-700 font-medium">{plan.deathBenefit}</p>
                        </div>
                      </div>

                      {/* Constraints and parameters summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded border border-slate-150 text-[10px] font-semibold text-slate-600">
                        <div>
                          <span className="text-[8.5px] font-mono text-slate-400 block uppercase font-bold">Min Entry Age:</span>
                          <span className="text-slate-800 font-bold">{plan.minAge}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] font-mono text-slate-400 block uppercase font-bold">Max Entry Age:</span>
                          <span className="text-slate-800 font-bold">{plan.maxAge}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] font-mono text-slate-400 block uppercase font-bold">Max Cover Limit:</span>
                          <span className="text-slate-800 font-bold">{plan.maxSumAssured}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] font-mono text-slate-400 block uppercase font-bold">Premium Modes:</span>
                          <span className="text-[#003087] font-extrabold">{plan.premiumModes.join(", ")}</span>
                        </div>
                      </div>

                      {/* Loan and Tax relief footnotes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[10.5px] leading-snug text-slate-500 font-medium">
                        <div>
                          <strong className="text-slate-700 font-bold">🏛️ Sovereign Loan Liquidity:</strong> {plan.loanFacility}
                        </div>
                        <div>
                          <strong className="text-[#003087] font-bold">🧾 Section 80C &amp; 10(10D) Relief:</strong> {plan.taxBenefits}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flagship Riders Section */}
      {(activeFilter === "all" || activeFilter === "riders") && filteredRiders.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Sovereign Supplemental Riders ({filteredRiders.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRiders.map((rider) => (
              <div 
                key={rider.id}
                className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3 shadow-5xs hover:shadow-4xs hover:border-[#a7f3d0] transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase">
                      UIN: {rider.uin}
                    </span>
                    <span className="text-[9px] text-slate-400 font-sans font-bold">Sovereign Rider</span>
                  </div>
                  
                  <h4 className="text-xs font-display font-black text-slate-800 mt-1.5">
                    {rider.name}
                  </h4>
                </div>

                <div className="space-y-1.5 text-[11px] font-semibold text-slate-600 leading-snug">
                  <p>
                    <strong className="text-slate-700 font-bold block text-[9.5px] font-mono uppercase">Actuarial Purpose:</strong>
                    {rider.purpose}
                  </p>
                  <p>
                    <strong className="text-[#003087] font-bold block text-[9.5px] font-mono uppercase">Claim Payout Structure:</strong>
                    {rider.payout}
                  </p>
                  <p>
                    <strong className="text-emerald-700 font-bold block text-[9.5px] font-mono uppercase">Core Complement Value:</strong>
                    {rider.keyBenefit}
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-150 text-[10px] text-slate-500 font-medium leading-snug">
                  <strong>Eligibility constraints:</strong> {rider.eligibility}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {filteredPlans.length === 0 && filteredRiders.length === 0 && (
        <div className="text-center p-12 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto animate-bounce" />
          <h4 className="text-sm font-bold text-slate-700">No sovereign insurance products match your search query</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Try typing a broader term like "endowment", "term", "Jeevan", "rider", or specific plan numbers like "736".</p>
        </div>
      )}

    </div>
  );
}
