import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, Shield, Info, Calendar, Award, GraduationCap, 
  Coins, Heart, ShieldCheck, ChevronDown, ChevronUp, BookOpen, 
  Bookmark, CheckCircle, Sparkles, Filter, HelpCircle
} from "lucide-react";
import { LIC_PLANS, LIC_RIDERS } from "../plansData";
import { LicPlan, LicRider } from "../types";
import { supabase } from "../supabaseClient";

export default function SovereignCatalogExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "endowment" | "whole_life" | "money_back" | "term" | "riders">("all");
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const [plans, setPlans] = useState<LicPlan[]>([]);
  const [riders, setRiders] = useState<LicRider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch from Supabase
        const { data, error } = await supabase
          .from("lic_catalog")
          .select("*");

        if (error) {
          throw new Error(error.message);
        }

        if (!data || data.length === 0) {
          // Fallback to static if no records returned
          setPlans(LIC_PLANS);
          setRiders(LIC_RIDERS);
          return;
        }

        const supabasePlans: LicPlan[] = [];
        const supabaseRiders: LicRider[] = [];

        data.forEach((row: any) => {
          const id = row.id;
          
          if (row.category === "Supplemental Rider") {
            const localRider = LIC_RIDERS.find(r => r.id === id);
            
            const mappedRider: LicRider = {
              id: row.id,
              name: row.name || localRider?.name || "",
              uin: row.uin || localRider?.uin || "",
              purpose: localRider?.purpose || row.features?.[0] || "",
              payout: localRider?.payout || row.features?.[1] || "",
              eligibility: localRider?.eligibility || `Age ${row.min_entry_age || ""} to ${row.max_entry_age || ""}`,
              keyBenefit: localRider?.keyBenefit || row.features?.[2] || ""
            };
            
            supabaseRiders.push(mappedRider);
          } else {
            let category: "endowment" | "whole_life" | "money_back" | "term" = "endowment";
            const rowCat = (row.category || "").toLowerCase().replace("-", "_").replace(" ", "_");
            if (rowCat === "whole_life" || rowCat === "money_back" || rowCat === "term" || rowCat === "endowment") {
              category = rowCat;
            }

            let minSumAssured = 0;
            if (row.min_sum_assured) {
              const cleaned = row.min_sum_assured.replace(/[^\d]/g, "");
              minSumAssured = parseInt(cleaned, 10) || 0;
            }

            const localPlan = LIC_PLANS.find(p => p.id === id);

            const mappedPlan: LicPlan = {
              id: row.id,
              name: row.name || localPlan?.name || "",
              planNumber: typeof row.plan_number === "number" ? row.plan_number : (localPlan?.planNumber || 0),
              uin: row.uin || localPlan?.uin || "",
              category,
              minAge: row.min_entry_age || localPlan?.minAge || "",
              maxAge: row.max_entry_age || localPlan?.maxAge || "",
              minSumAssured: minSumAssured || localPlan?.minSumAssured || 0,
              maxSumAssured: row.max_sum_assured || localPlan?.maxSumAssured || "",
              features: Array.isArray(row.features) && row.features.length > 0 ? row.features : (localPlan?.features || []),
              maturityBenefit: localPlan?.maturityBenefit || "",
              deathBenefit: localPlan?.deathBenefit || "",
              bestFor: localPlan?.bestFor || "",
              premiumModes: localPlan?.premiumModes || ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
              loanFacility: localPlan?.loanFacility || "",
              taxBenefits: localPlan?.taxBenefits || ""
            };

            supabasePlans.push(mappedPlan);
          }
        });

        setPlans(supabasePlans);
        setRiders(supabaseRiders);
      } catch (err: any) {
        console.error("Error loading Supabase catalog:", err);
        setError(err.message || "Failed to load catalog data");
        setIsFallback(true);
        setPlans(LIC_PLANS);
        setRiders(LIC_RIDERS);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleToggleExpand = (id: string) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  // Filter logic
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
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
  }, [plans, activeFilter, searchQuery]);

  const filteredRiders = useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "riders") return [];
    
    return riders.filter(rider => {
      if (searchQuery.trim() === "") return true;
      const query = searchQuery.toLowerCase();
      return (
        rider.name.toLowerCase().includes(query) ||
        rider.uin.toLowerCase().includes(query) ||
        rider.purpose.toLowerCase().includes(query) ||
        rider.keyBenefit.toLowerCase().includes(query)
      );
    });
  }, [riders, activeFilter, searchQuery]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white/50 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#003087] animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-sans font-bold text-[#003087] uppercase tracking-wider animate-pulse">
            Connecting to Supabase...
          </p>
          <p className="text-[10px] text-slate-500 font-semibold font-sans">
            Fetching official sovereign LIC plan catalog
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="catalog-explorer">
      
      {isFallback && (
        <div className="bg-amber-50 text-[#003087] border border-amber-200 rounded-lg p-3 text-[11px] font-semibold flex items-center gap-2 shadow-3xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Note: Displaying static local catalog backup (offline or failed to load from Supabase: {error || "Unknown error"}).</span>
        </div>
      )}
      
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
