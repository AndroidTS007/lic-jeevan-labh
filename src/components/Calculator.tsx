import React, { useState, useMemo } from "react";
import { 
  Calculator as CalcIcon, Shield, HelpCircle, ArrowRight, 
  Info, TrendingUp, CheckCircle, Calendar, Users,
  Award, Sparkles, Building, Heart, GraduationCap, Coins, Plus, 
  Layers, CheckSquare, Square, Sliders, Play, Percent
} from "lucide-react";
import { 
  calculateAllPoliciesByBudget, 
  formatIndianCurrency, 
  DetailedPolicyResult,
  simulatePortfolio,
  PortfolioSimResult
} from "../utils";
import SovereignCatalogExplorer from "./SovereignCatalogExplorer";
import { LIC_PLANS } from "../plansData";

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<"individual" | "portfolio" | "explorer">("portfolio"); // default to the major value-add multi-plan
  const [age, setAge] = useState<number>(30);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(5000);
  const [policyTerm, setPolicyTerm] = useState<16 | 21 | 25>(25);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("labh"); // For single view

  // Portfolio Builder state
  const [portfolioSelectedIds, setPortfolioSelectedIds] = useState<string[]>(["labh", "anand", "umang"]);
  const [portfolioStrategy, setPortfolioStrategy] = useState<"equal" | "returns" | "shield" | "custom">("equal");
  const [customAllocations, setCustomAllocations] = useState<{ [key: string]: number }>({
    labh: 40,
    anand: 30,
    umang: 30,
    lakshya: 30,
    bima_bachat: 30,
    jeevan_amar: 30,
    jeevan_akshay: 30,
    bhagya_lakshmi: 30
  });

  // Budget presets
  const budgetPresets = [2500, 3500, 5000, 10000, 12000, 15000, 20000];

  // Map of all 8 policy features for rendering + 22 catalog plans dynamically appended!
  const allPolicyCategories = useMemo(() => {
    const flagship = [
      { id: "labh", name: "LIC Jeevan Labh", plan: 736, cat: "endowment" },
      { id: "anand", name: "LIC New Jeevan Anand", plan: 915, cat: "endowment" },
      { id: "umang", name: "LIC Jeevan Umang", plan: 945, cat: "whole_life" },
      { id: "lakshya", name: "LIC Jeevan Lakshya", plan: 933, cat: "endowment" },
      { id: "bima_bachat", name: "LIC New Bima Bachat", plan: 948, cat: "money_back" },
      { id: "jeevan_amar", name: "LIC Jeevan Amar", plan: 855, cat: "term" },
      { id: "jeevan_akshay", name: "LIC Jeevan Akshay-VII", plan: 857, cat: "pension" },
      { id: "bhagya_lakshmi", name: "LIC Bhagya Lakshmi", plan: 839, cat: "micro" }
    ];
    
    const excludeIds = ["jeevan_labh", "new_jeevan_anand", "jeevan_umang", "jeevan_lakshya", "new_jeevan_amar"];
    const dynamic = LIC_PLANS
      .filter(p => !excludeIds.includes(p.id))
      .map(p => ({
        id: p.id,
        name: p.name,
        plan: p.planNumber,
        cat: p.category
      }));
      
    return [...flagship, ...dynamic];
  }, []);

  // Calculate results for all 8 policies based on current parameters
  const allPlanResults = useMemo(() => {
    return calculateAllPoliciesByBudget(age, monthlyBudget, policyTerm);
  }, [age, monthlyBudget, policyTerm]);

  // Find active plan for the individual tab
  const activePlan = useMemo(() => {
    return allPlanResults.find((p) => p.id === selectedPlanId) || allPlanResults[0];
  }, [allPlanResults, selectedPlanId]);

  // Handle checking/unchecking plans in portfolio builder
  const togglePortfolioPlan = (id: string) => {
    if (portfolioSelectedIds.includes(id)) {
      if (portfolioSelectedIds.length > 1) {
        setPortfolioSelectedIds(portfolioSelectedIds.filter(item => item !== id));
      }
    } else {
      setPortfolioSelectedIds([...portfolioSelectedIds, id]);
    }
  };

  // Handle slider custom changes
  const handleCustomAllocChange = (id: string, val: number) => {
    setCustomAllocations(prev => {
      const updated = { ...prev, [id]: val };
      return updated;
    });
  };

  // Run the smart portfolio simulator
  const portfolioSimulation: PortfolioSimResult = useMemo(() => {
    return simulatePortfolio(
      age,
      monthlyBudget,
      portfolioSelectedIds,
      policyTerm,
      portfolioStrategy,
      customAllocations
    );
  }, [age, monthlyBudget, portfolioSelectedIds, policyTerm, portfolioStrategy, customAllocations]);

  // Year-by-year schedule for the individual tab plan
  const planSchedule = useMemo(() => {
    if (!activePlan) return [];
    const schedule = [];
    const currentYear = new Date().getFullYear();
    let cumulativePremiumPaid = 0;

    const termToUse = activePlan.policyTerm;

    for (let yr = 1; yr <= termToUse; yr++) {
      let premiumForYr = 0;
      if (activePlan.id === "jeevan_akshay") {
        premiumForYr = yr === 1 ? activePlan.yearlyPremium : 0;
      } else {
        premiumForYr = yr <= activePlan.premiumPayingTerm 
          ? (yr === 1 ? activePlan.yearlyPremium : Math.round(activePlan.yearlyPremium * 1.0225 / 1.045))
          : 0;
      }

      cumulativePremiumPaid += premiumForYr;

      let survivalCashbackValue = 0;
      if (activePlan.id === "umang" && yr > activePlan.premiumPayingTerm) {
        survivalCashbackValue = activePlan.guaranteedAnnualIncome;
      } else if (activePlan.id === "bima_bachat" && (yr === 5 || yr === 10)) {
        survivalCashbackValue = Math.round(activePlan.sumAssured * 0.15); // Money Back 15%
      }

      // Accumulated asset worth
      let accumulatedMultiplier = yr / activePlan.policyTerm;
      const guaranteedWorth = activePlan.id === "jeevan_amar" 
        ? 0 
        : activePlan.sumAssured + Math.round(activePlan.estimatedReversionaryBonus * accumulatedMultiplier);

      schedule.push({
        policyYear: yr,
        calendarYear: currentYear + yr - 1,
        ageAtYear: age + yr - 1,
        premium: premiumForYr,
        cumulativePremium: cumulativePremiumPaid,
        survivalCashback: survivalCashbackValue,
        guaranteedWorth
      });
    }
    return schedule;
  }, [activePlan, age]);

  // Combined Year-by-Year cashflow for portfolio
  const portfolioSchedule = useMemo(() => {
    if (portfolioSelectedIds.length === 0) return [];
    const schedule = [];
    const currentYear = new Date().getFullYear();
    
    // Aggregate over the maximum active policy term (e.g. 25 years)
    for (let yr = 1; yr <= policyTerm; yr++) {
      let combinedPremium = 0;
      let combinedCashback = 0;
      let combinedCover = 0;
      let combinedAssetVal = 0;

      portfolioSimulation.allocations.forEach(alloc => {
        const fullPlan = allPlanResults.find(p => p.id === alloc.id)!;
        const scale = fullPlan.sumAssured > 0 ? alloc.allocatedSumAssured / fullPlan.sumAssured : 0;

        // Premium for this year
        let planPrem = 0;
        if (yr <= fullPlan.premiumPayingTerm) {
          planPrem = yr === 1 ? fullPlan.yearlyPremium : Math.round(fullPlan.yearlyPremium * 1.0225 / 1.045);
        }
        combinedPremium += Math.round(planPrem * scale);

        // Cashback this year
        let planCashback = 0;
        if (fullPlan.id === "umang" && yr > fullPlan.premiumPayingTerm) {
          planCashback = fullPlan.guaranteedAnnualIncome;
        } else if (fullPlan.id === "bima_bachat" && (yr === 5 || yr === 10)) {
          planCashback = Math.round(fullPlan.sumAssured * 0.15);
        } else if (fullPlan.id === "jeevan_akshay") {
          planCashback = fullPlan.guaranteedAnnualIncome;
        }
        combinedCashback += Math.round(planCashback * scale);

        // Active life coverage cover this year
        let planCover = fullPlan.sumAssured;
        if (fullPlan.id === "jeevan_amar") {
          planCover = fullPlan.sumAssured;
        } else {
          planCover = fullPlan.sumAssured + Math.round(fullPlan.estimatedReversionaryBonus * (yr / policyTerm));
        }
        combinedCover += Math.round(planCover * scale);

        // Accumulated cash worth
        let planAsset = 0;
        if (fullPlan.id !== "jeevan_amar") {
          planAsset = fullPlan.sumAssured + Math.round(fullPlan.estimatedReversionaryBonus * (yr / policyTerm));
        }
        combinedAssetVal += Math.round(planAsset * scale);
      });

      schedule.push({
        year: yr,
        calendarYear: currentYear + yr - 1,
        age: age + yr - 1,
        premium: combinedPremium,
        cashback: combinedCashback,
        cover: combinedCover,
        assetValue: combinedAssetVal
      });
    }
    return schedule;
  }, [portfolioSelectedIds, portfolioSimulation, allPlanResults, policyTerm, age]);

  // Matching icons for plan render
  const getPlanIcon = (id: string) => {
    switch (id) {
      case "labh":
        return <Award className="w-5 h-5 text-amber-500" />;
      case "anand":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "umang":
        return <Coins className="w-5 h-5 text-emerald-500" />;
      case "lakshya":
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case "bima_bachat":
        return <Layers className="w-5 h-5 text-orange-500" />;
      case "jeevan_amar":
        return <Shield className="w-5 h-5 text-indigo-500" />;
      case "jeevan_akshay":
        return <Building className="w-5 h-5 text-[#003087]" />;
      case "bhagya_lakshmi":
        return <Users className="w-5 h-5 text-pink-500" />;
    }

    // Dynamic catalog category fallbacks
    const planInfo = allPolicyCategories.find(p => p.id === id);
    if (planInfo) {
      switch (planInfo.cat) {
        case "endowment":
          return <GraduationCap className="w-5 h-5 text-blue-500" />;
        case "whole_life":
          return <Heart className="w-5 h-5 text-red-500" />;
        case "money_back":
          return <Coins className="w-5 h-5 text-emerald-500" />;
        case "term":
          return <Shield className="w-5 h-5 text-indigo-500" />;
      }
    }

    return <CalcIcon className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden p-5 md:p-6" id="multi-policy-calculator">
      
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#003087] text-[#ffd700] p-2.5 rounded border border-[#ffd700]/30 shadow-sm">
            <CalcIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-sans tracking-wider font-extrabold text-[#003087]">
              Sovereign Wealth Catalyst Module
            </span>
            <h2 className="text-xl font-display font-extrabold text-[#003087] tracking-tight">
              LIC Multi-Policy Portfolio & Budget Planner
            </h2>
            <p className="text-slate-500 text-xs font-medium mt-0.5">
              Select multiple policies, simulate dynamic splits, and build the ultimate risk-insulated safety portfolio
            </p>
          </div>
        </div>

        <div className="bg-amber-50 px-3 py-1.5 rounded border border-amber-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <span className="text-left text-[10px] font-sans text-amber-800 leading-tight font-bold">
            Sovereign Central Guarantee status: ACTIVE (Section 37, 1956 Linkages)
          </span>
        </div>
      </div>

      {/* Control Variables Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-5 rounded border border-slate-200 mb-6 shadow-xs">
        
        {/* Entry Age Selector */}
        <div className="lg:col-span-3 space-y-2">
          <div className="flex justify-between items-center text-xs font-sans font-bold text-slate-700">
            <span>Proposer Entry Age:</span>
            <span className="text-[#003087] bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-sm font-extrabold">
              {age} Years Old
            </span>
          </div>
          <input
            type="range"
            min={18}
            max={50}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#003087]"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-semibold font-sans">
            <span>Min: 18 Years</span>
            <span>Max common: 50 Years</span>
          </div>
        </div>

        {/* Dynamic Budget Selector */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-sans font-bold text-slate-700">
            <span>Total Monthly Savings Budget:</span>
            <span className="text-emerald-700 bg-white px-3 py-0.5 rounded border border-[#a7f3d0] shadow-sm font-extrabold text-sm">
              {formatIndianCurrency(monthlyBudget)} / Month
            </span>
          </div>
          <input
            type="range"
            min={1500}
            max={50000}
            step={500}
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[9px] text-slate-500 font-semibold font-sans uppercase">Quick Budget Presets:</span>
            <div className="flex flex-wrap gap-1">
              {budgetPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMonthlyBudget(val)}
                  className={`px-2 py-0.5 text-[10px] font-sans rounded font-bold transition-all ${
                    monthlyBudget === val
                      ? "bg-[#003087] text-[#ffd700] font-extrabold shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                  }`}
                >
                  ₹{val.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Benchmark Policy Term */}
        <div className="lg:col-span-3 space-y-2">
          <span className="block text-xs font-sans font-bold text-slate-700">
            Preferred Protection Term:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[16, 21, 25].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setPolicyTerm(term as 16 | 21 | 25)}
                className={`p-1.5 rounded border text-center transition-all cursor-pointer text-xs font-bold ${
                  policyTerm === term
                    ? "border-[#003087] bg-blue-50/50 text-[#003087] font-extrabold outline-1 outline-[#003087] shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-350"
                }`}
              >
                {term} Yrs
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* TAB SELECTOR */}
      <div className="flex flex-wrap border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "portfolio"
              ? "border-[#003087] text-[#003087] font-extrabold bg-blue-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Interactive Portfolio Combo Builder (Smart Allocator)</span>
        </button>

        <button
          onClick={() => setActiveTab("individual")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "individual"
              ? "border-[#003087] text-[#003087] font-extrabold bg-blue-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CalcIcon className="w-4 h-4" />
          <span>Compare Individual Plans side-by-side (8 Policies)</span>
        </button>

        <button
          onClick={() => setActiveTab("explorer")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "explorer"
              ? "border-[#003087] text-[#003087] font-extrabold bg-blue-50/40"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Shield className="w-4 h-4 text-[#003087]" />
          <span>Sovereign Catalog Explorer (27 Plans &amp; 7 Riders)</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. PORTFOLIO COMBO BUILDER */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          
          {/* Dynamic Strategy & Selector Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Checked selection checklist (Col span 5) */}
            <div className="lg:col-span-5 bg-slate-50 rounded border border-slate-200 p-4.5 space-y-3.5">
              <div>
                <span className="text-[9px] font-sans font-bold text-[#003087] uppercase tracking-wider block">
                  Step 1: Choose Your Combination
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                  Check policies to include in your customized bundle:
                </h4>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {allPolicyCategories.map((p) => {
                  const isChecked = portfolioSelectedIds.includes(p.id);
                  const baseData = allPlanResults.find(plan => plan.id === p.id);
                  return (
                    <div 
                      key={p.id}
                      onClick={() => togglePortfolioPlan(p.id)}
                      className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-all ${
                        isChecked 
                          ? "bg-white border-[#003087] shadow-xs" 
                          : "bg-slate-100/50 border-slate-200 hover:border-slate-300 opacity-75"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isChecked ? (
                          <CheckSquare className="w-4.5 h-4.5 text-[#003087] shrink-0" />
                        ) : (
                          <Square className="w-4.5 h-4.5 text-slate-450 shrink-0" />
                        )}
                        <div className="flex items-center gap-1.5">
                          {getPlanIcon(p.id)}
                          <div>
                            <span className="text-[8px] bg-slate-200 text-[#003087] font-semibold px-1 rounded block w-max">
                              Plan {p.plan}
                            </span>
                            <span className="text-xs font-bold text-slate-800 leading-tight">
                              {p.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {baseData && (
                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">Yield Ratio</span>
                          <span className="text-[11px] font-extrabold text-[#003087]">{baseData.returnMultiplier}x ROI</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-500 italic mt-1.5">
                💡 Choosing multiple policies hedges tax rules, combines pension yields, and sets separate child and lifetime checkpoints.
              </p>
            </div>

            {/* Smart Allocation Strategy (Col span 7) */}
            <div className="lg:col-span-7 bg-white rounded border border-slate-200 p-4.5 space-y-4">
              <div>
                <span className="text-[9px] font-sans font-bold text-[#003087] uppercase tracking-wider block">
                  Step 2: Set Budget Split Strategy
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                  How should your monthly ₹{monthlyBudget.toLocaleString("en-IN")} be distributed?
                </h4>
              </div>

              {/* Selector buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPortfolioStrategy("equal")}
                  className={`p-2 rounded border text-center transition-all cursor-pointer text-[11px] font-bold ${
                    portfolioStrategy === "equal"
                      ? "border-[#003087] bg-blue-50/50 text-[#003087] font-extrabold"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                  }`}
                >
                  ⚖️ Equal Split
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioStrategy("returns")}
                  className={`p-2 rounded border text-center transition-all cursor-pointer text-[11px] font-bold ${
                    portfolioStrategy === "returns"
                      ? "border-amber-500 bg-amber-50/50 text-amber-900 font-extrabold"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                  }`}
                >
                  🔥 Return Focus
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioStrategy("shield")}
                  className={`p-2 rounded border text-center transition-all cursor-pointer text-[11px] font-bold ${
                    portfolioStrategy === "shield"
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 font-extrabold"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                  }`}
                >
                  🛡️ Shield Focus
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioStrategy("custom")}
                  className={`p-2 rounded border text-center transition-all cursor-pointer text-[11px] font-bold ${
                    portfolioStrategy === "custom"
                      ? "border-purple-600 bg-purple-50/50 text-purple-900 font-extrabold"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                  }`}
                >
                  🎛️ Custom Sliders
                </button>
              </div>

              {/* Sliders render block */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-3.5">
                {portfolioStrategy === "custom" ? (
                  <div className="space-y-3">
                    <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Drag allocations (will auto-normalize to 100% total):
                    </span>
                    {portfolioSelectedIds.map((id) => {
                      const value = customAllocations[id] || 30;
                      const planInfo = allPolicyCategories.find(p => p.id === id)!;
                      return (
                        <div key={id} className="space-y-1 bg-white p-2.5 rounded border border-slate-150">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-800">{planInfo.name}</span>
                            <span className="text-purple-700 bg-purple-50 px-2 rounded">{value}% Share</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={value}
                            onChange={(e) => handleCustomAllocChange(id, parseInt(e.target.value))}
                            className="w-full accent-purple-600 cursor-pointer h-1 rounded bg-slate-150"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-700 space-y-2">
                    <span className="font-bold text-slate-800 uppercase text-[9px] tracking-wider block">
                      Current Strategy Allocation split:
                    </span>
                    <div className="space-y-2">
                      {portfolioSimulation.allocations.map((alloc) => (
                        <div key={alloc.id} className="flex justify-between items-center bg-white p-2 border border-slate-150 rounded">
                          <span className="font-semibold text-slate-700">{alloc.name}</span>
                          <span className="font-extrabold text-[#003087] bg-blue-50 px-2 py-0.5 rounded text-[10.5px]">
                            {alloc.percentage}% split ({formatIndianCurrency(alloc.allocatedMonthlyPremium)}/mo)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Strategy advisor bubble */}
              <div className="p-3.5 bg-[#fffdf0] border border-amber-200 rounded text-[11px] text-slate-800 font-semibold flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <p className="leading-normal">{portfolioSimulation.payoutTimelineNarrative}</p>
              </div>

            </div>

          </div>

          {/* COMBINED PORTFOLIO METRICS DASHBOARD */}
          <div className="bg-gradient-to-r from-[#003087] to-[#0a4fc0] text-white p-6 rounded border border-[#ffd700]/30 shadow-md">
            <span className="bg-[#ffd700] text-[#003087] text-[9px] font-black px-2.5 py-0.5 rounded tracking-widest uppercase inline-block mb-3.5 shadow-sm">
              Sovereign Custom Wealth Portfolio Ledger
            </span>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 pt-1">
              
              {/* Stat 1 */}
              <div className="space-y-1">
                <span className="text-[10px] text-blue-100 uppercase tracking-wider block">Combined sum assured</span>
                <p className="text-xl font-display font-black text-[#ffd700]">
                  {formatIndianCurrency(portfolioSimulation.combinedSumAssured)}
                </p>
                <span className="text-[8.5px] text-[#a7f3d0] bg-emerald-950/40 border border-emerald-900/30 px-1 py-0.5 rounded">
                  🛡️ Family Coverage
                </span>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1">
                <span className="text-[10px] text-blue-100 uppercase tracking-wider block">Total Monthly Budget</span>
                <p className="text-xl font-display font-black text-white">
                  {formatIndianCurrency(portfolioSimulation.totalMonthlyPremium)}
                </p>
                <span className="text-[9px] text-slate-350">
                  (~{formatIndianCurrency(portfolioSimulation.totalYearlyPremium)} / yr)
                </span>
              </div>

              {/* Stat 3 */}
              <div className="space-y-1">
                <span className="text-[10px] text-blue-100 uppercase tracking-wider block font-bold">Total premiums paid</span>
                <p className="text-xl font-display font-black text-slate-200">
                  {formatIndianCurrency(portfolioSimulation.overallTotalPremiumPaid)}
                </p>
                <span className="text-[9px] text-slate-300">Over chosen cycles</span>
              </div>

              {/* Stat 4 */}
              <div className="space-y-1 col-span-2 md:col-span-1">
                <span className="text-[10px] text-blue-100 uppercase tracking-wider block text-yellow-300 font-extrabold">Combined Maturity return</span>
                <p className="text-2xl font-display font-black text-emerald-400">
                  {formatIndianCurrency(portfolioSimulation.combinedProjectedMaturity)}
                </p>
                <span className="text-[8.5px] text-[#ffd700] bg-yellow-950/40 border border-yellow-900/30 px-1 py-0.5 rounded">
                  📈 100% Tax-Exempt
                </span>
              </div>

              {/* Stat 5 */}
              <div className="space-y-1">
                <span className="text-[10px] text-blue-100 uppercase tracking-wider block">Survival Pension yields</span>
                <p className="text-xl font-display font-black text-[#ffd700]">
                  {portfolioSimulation.combinedAnnualAnnuity > 0 
                    ? `${formatIndianCurrency(portfolioSimulation.combinedAnnualAnnuity)} / Yr` 
                    : "₹0 (No pension plans)"}
                </p>
                <span className="text-[9px] text-slate-200">Starting post-PPT</span>
              </div>

              {/* Stat 6 */}
              <div className="space-y-1">
                <span className="text-[10px] text-blue-100 uppercase tracking-wider block">Combined ROI Index</span>
                <p className="text-xl font-display font-black text-white">
                  {portfolioSimulation.overallROI}x Returns
                </p>
                {/* Risk shield level bar */}
                <div className="w-full pt-1">
                  <div className="h-1 bg-blue-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ffd700]" 
                      style={{ width: `${portfolioSimulation.riskCoverIndex}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-300 font-semibold block mt-0.5">
                    Family Safety: {portfolioSimulation.riskCoverIndex}/100
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* COMBINED LEDGER YEARLY CASHFLOW TABLE */}
          <div className="bg-slate-50 border border-slate-200 rounded p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-[9px] uppercase font-sans tracking-widest text-[#003087] font-bold block">
                  Combined Group Cashflows
                </span>
                <h4 className="text-sm font-display font-extrabold text-[#003087]">
                  Unified Year-by-Year Allocation Schedule: Custom Portfolio Choice
                </h4>
              </div>
              <span className="bg-blue-100 border border-blue-200 text-[#003087] text-[10px] font-bold px-2.5 py-1 rounded">
                Sovereign Parliament Underwrite: Underpinning Checked Rows
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded bg-white shadow-xs">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#003087] text-[10px] text-white font-sans font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Year</th>
                    <th className="p-3">Insured Age</th>
                    <th className="p-3">Total Combined Premium (incl. GST)</th>
                    <th className="p-3">Survival Payout / Cashback Received</th>
                    <th className="p-3">Sovereign Protection Cover</th>
                    <th className="p-3">Projected Asset Value (incl. Bonuses)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {portfolioSchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-[#003087]">
                        Year {row.year} <span className="text-[10px] text-slate-500 font-normal">({row.calendarYear})</span>
                      </td>
                      <td className="p-3 font-sans font-medium text-slate-600">
                        {row.age} Yrs
                      </td>
                      <td className={`p-3 font-sans font-extrabold ${row.premium > 0 ? "text-[#003087]" : "text-emerald-600"}`}>
                        {row.premium > 0 ? formatIndianCurrency(row.premium) : "₹0 (PAID)"}
                      </td>
                      <td className={`p-3 font-sans font-extrabold ${row.cashback > 0 ? "text-emerald-600 bg-emerald-50/20" : "text-slate-400"}`}>
                        {row.cashback > 0 ? `+${formatIndianCurrency(row.cashback)}` : "-"}
                      </td>
                      <td className="p-3 font-sans font-bold text-emerald-700">
                        {formatIndianCurrency(row.cover)}
                      </td>
                      <td className="p-3 font-sans text-slate-800 font-extrabold">
                        {formatIndianCurrency(row.assetValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded text-[11px] font-sans text-slate-700 font-medium">
              💡 <strong>Portfolio Multi-Plan Synergy:</strong> Total combined premium commits of <strong>{formatIndianCurrency(portfolioSimulation.overallTotalPremiumPaid)}</strong> yields a secure tax-exempt maturity of <strong className="text-emerald-700">{formatIndianCurrency(portfolioSimulation.combinedProjectedMaturity)}</strong>. In worst-case critical scenarios, all future premiums are fully waived (if child protective plans are selected) while child education targets remain 100% intact under Indian Parliamentary decree.
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: 2. COMPARE INDIVIDUAL PLANS (Classic Matrix) */}
      {activeTab === "individual" && (
        <div className="space-y-6">
          
          {/* Scenario Solver Card */}
          <div className="bg-gradient-to-r from-blue-900 to-[#003087] text-white p-4.5 rounded border border-[#ffd700]/30 shadow-md mb-2 leading-relaxed relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
              <CalcIcon className="w-40 h-40" />
            </div>
            <div className="z-10 relative">
              <span className="bg-yellow-400 text-[#003087] text-[9px] px-2 py-0.5 rounded font-extrabold tracking-wider uppercase inline-block mb-2 shadow-xs">
                Actuarial Intelligence Advisor Recommendation
              </span>
              <h3 className="text-sm font-bold flex items-center gap-1.5 leading-snug">
                🎯 Analyzing a Monthly Contribution of {formatIndianCurrency(monthlyBudget)} (~{formatIndianCurrency(monthlyBudget * 12)}/year) for entry age {age}:
              </h3>
              <p className="text-[11px] text-blue-100 mt-1.5 font-sans leading-relaxed">
                • <strong className="text-white">Endowment Growth (Jeevan Labh Plan 736)</strong> reaches a high final maturity of <span className="text-[#ffd700] font-extrabold">{formatIndianCurrency(allPlanResults[0].estimatedMaturityPayout)}</span> on Final Maturity with 16-year payment term option.
              </p>
              <p className="text-[11px] text-blue-100 mt-1.5 font-sans leading-relaxed">
                • <strong className="text-white">Whole-Life Annuity option (Jeevan Umang Plan 945)</strong> yields a lifetime guaranteed <span className="text-[#ffd700] font-bold">{formatIndianCurrency(allPlanResults[2].guaranteedAnnualIncome)} / Yr</span> starting in Year {allPlanResults[2].premiumPayingTerm + 1}, plus a heavy final estate payout of <span className="text-[#ffd700] font-bold">{formatIndianCurrency(allPlanResults[2].estimatedMaturityPayout)}</span>.
              </p>
              <p className="text-[11px] text-blue-100 mt-1.5 font-sans leading-relaxed">
                • <strong className="text-white">Double Protection (New Jeevan Anand Plan 915)</strong> pays the full mature value of <span className="text-[#ffd700] font-bold">{formatIndianCurrency(allPlanResults[1].estimatedMaturityPayout)}</span>, and maintains a lifetime cover of <span className="text-emerald-300 font-extrabold">{formatIndianCurrency(allPlanResults[1].lifelongFreeCover)}</span> active for the family forever at ₹0 extra premium.
              </p>
            </div>
          </div>

          {/* Comparison Grid Matrix (8 items!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {allPlanResults.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`rounded border p-4.5 flex flex-col justify-between transition-all cursor-pointer relative shadow-xs ${
                    isSelected 
                      ? "border-[#003087] bg-blue-50/20 ring-1 ring-[#003087]" 
                      : "border-slate-200 hover:border-slate-350 bg-white"
                  }`}
                >
                  
                  {/* Highlight Badge */}
                  <div className="absolute top-2.5 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 font-sans shadow-2xs">
                    {plan.id === "labh" && <span className="bg-amber-100 text-amber-800 border border-amber-200">Max Returns</span>}
                    {plan.id === "anand" && <span className="bg-red-100 text-red-800 border border-red-200">Double Cover</span>}
                    {plan.id === "umang" && <span className="bg-emerald-100 text-emerald-800 border border-emerald-250">8% Pension</span>}
                    {plan.id === "lakshya" && <span className="bg-blue-100 text-blue-800 border border-blue-200">Child Safe</span>}
                    {plan.id === "bima_bachat" && <span className="bg-orange-100 text-orange-850 border border-orange-200">Money Back</span>}
                    {plan.id === "jeevan_amar" && <span className="bg-indigo-100 text-indigo-800 border border-indigo-200">Pure Term</span>}
                    {plan.id === "jeevan_akshay" && <span className="bg-indigo-550/15 text-[#003087] border border-[#003087]/20">Pension Pool</span>}
                    {plan.id === "bhagya_lakshmi" && <span className="bg-pink-100 text-pink-850 border border-pink-200">Micro Cover</span>}
                  </div>

                  {/* Top Meta */}
                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex items-center gap-1.5">
                      {getPlanIcon(plan.id)}
                      <div>
                        <span className="text-[9px] uppercase font-sans font-extrabold text-[#003087]">Plan {plan.planNumber}</span>
                        <h3 className="text-xs font-display font-bold text-slate-800 leading-tight">
                          {plan.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                      "{plan.mainHighlight}"
                    </p>
                  </div>

                  {/* Payout Metric block */}
                  <div className="my-3 py-3 border-y border-slate-150 border-dashed space-y-2 text-xs font-sans">
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase font-sans font-bold">Sum Assured (Life Cover):</span>
                      <p className="text-slate-800 font-extrabold text-[12.5px]">
                        {formatIndianCurrency(plan.sumAssured)}
                      </p>
                    </div>

                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase font-bold">Total Premium Paid:</span>
                      <p className="text-slate-700 font-semibold text-[11px]">
                        {formatIndianCurrency(plan.totalPremiumPaid)} {plan.id === "jeevan_akshay" ? "(Upfront Single)" : `(Over ${plan.premiumPayingTerm} yrs)`}
                      </p>
                    </div>

                    <div>
                      <span className="block text-[8px] text-[#003087] uppercase font-bold">Projected Maturity Payout:</span>
                      <p className="text-[#003087] font-black text-sm">
                        {plan.estimatedMaturityPayout > 0 ? formatIndianCurrency(plan.estimatedMaturityPayout) : "₹0 (Pure Term Coverage)"}
                      </p>
                    </div>

                    {/* Return Multiplier Level Bar */}
                    <div className="pt-1">
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-600 mb-0.5">
                        <span>Performance multiplier:</span>
                        <span className="text-[#003087] font-extrabold">{plan.returnMultiplier}x Return</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${plan.id === "labh" ? "bg-amber-500" : plan.id === "umang" ? "bg-emerald-500" : "bg-blue-600"}`}
                          style={{ width: `${Math.min(100, (plan.returnMultiplier / 3.4) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special unique triggers */}
                  <div className="space-y-1 text-[9px] leading-snug text-slate-600 font-sans mb-3.5 font-semibold">
                    {plan.id === "anand" && (
                      <p className="text-red-700 font-bold bg-red-50 p-1.5 rounded border border-red-100">
                        🎁 Post-Maturity Cover of <span className="font-extrabold">{formatIndianCurrency(plan.lifelongFreeCover)}</span> remains active forever at ₹0 premium!
                      </p>
                    )}
                    {plan.id === "umang" && (
                      <p className="text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded border border-[#a7f3d0]">
                        💰 Guaranteed Survival pension of <span className="font-extrabold">{formatIndianCurrency(plan.guaranteedAnnualIncome)} / Yr</span> starting in Year {plan.premiumPayingTerm + 1}!
                      </p>
                    )}
                    {plan.id === "lakshya" && (
                      <p className="text-blue-700 font-bold bg-blue-50 p-1.5 rounded border border-blue-100">
                        🎓 Child Guardian active. Autopays <span className="font-extrabold">{formatIndianCurrency(plan.childBenefitAnnualPayout)} / Yr</span> to child + Waives future premiums!
                      </p>
                    )}
                    {plan.id === "bima_bachat" && (
                      <p className="text-orange-700 font-bold bg-orange-50/50 p-1.5 rounded border border-orange-200">
                        ⚡ Cashbacks paid: {plan.moneyBackPayouts}
                      </p>
                    )}
                    {plan.id === "jeevan_amar" && (
                      <p className="text-indigo-700 font-bold bg-indigo-50 p-1.5 rounded border border-indigo-100">
                        🛡️ Incredibly huge protection umbrella. Secures your family with massive coverage for almost zero comparable budget.
                      </p>
                    )}
                    {plan.id === "jeevan_akshay" && (
                      <p className="text-[#003087] font-bold bg-blue-50 p-1.5 rounded border border-blue-100">
                        👴 Lifetime Annuity active: Autopays <span className="font-extrabold">{formatIndianCurrency(plan.guaranteedAnnualIncome)} / Yr</span> starting immediately!
                      </p>
                    )}
                    {plan.id === "bhagya_lakshmi" && (
                      <p className="text-pink-700 font-bold bg-pink-50 p-1.5 rounded border border-pink-100">
                        🏘️ Designed especially for micro savings. Inexpensive terminal refund mechanism.
                      </p>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(plan.id);
                    }}
                    className={`w-full py-1.5 rounded text-[10px] font-sans font-bold uppercase transition-colors select-none text-center ${
                      isSelected 
                        ? "bg-[#003087] text-white font-extrabold" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 animate-fade-in"
                    }`}
                  >
                    Deep-Dive Ledger &gt;
                  </button>

                </div>
              );
            })}
          </div>

          {/* Deep-Dive Yearly Ledger Table */}
          <div className="bg-slate-50 rounded border border-slate-200 p-5 shadow-xs">
            <div className="flex border-b border-slate-200 pb-3 mb-4 justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#003087] font-bold block">
                  Granular Financial Ledger
                </span>
                <h4 className="text-sm font-display font-extrabold text-[#003087]">
                  Year-by-Year Schedule: {activePlan.name} (Plan {activePlan.planNumber})
                </h4>
              </div>
              <span className="bg-blue-100 border border-blue-200 text-[#003087] text-[10px] font-bold px-2.5 py-1 rounded">
                Sovereign Central Guarantee status: ACTIVE
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded bg-white shadow-xs">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#003087] text-[10px] text-white font-sans font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Year</th>
                    <th className="p-3">Insured Age</th>
                    <th className="p-3">Premium (incl. GST)</th>
                    <th className="p-3">Cumulative Premium</th>
                    {activePlan.id === "umang" && <th className="p-3">Survival Pension Payback</th>}
                    {activePlan.id === "bima_bachat" && <th className="p-3">Money Back Returned</th>}
                    <th className="p-3">Sovereign Protection Cover</th>
                    <th className="p-3">Projected Asset Value (including Bonuses)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {planSchedule.map((row) => (
                    <tr key={row.policyYear} className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold">
                        Yr {row.policyYear} <span className="text-[10px] text-slate-500 font-normal">({row.calendarYear})</span>
                      </td>
                      <td className="p-3 font-sans font-medium text-slate-600">
                        {row.ageAtYear} Yrs
                      </td>
                      <td className={`p-3 font-sans font-extrabold ${row.premium > 0 ? "text-[#003087]" : "text-emerald-600"}`}>
                        {row.premium > 0 ? formatIndianCurrency(row.premium) : "₹0 (PAID)"}
                      </td>
                      <td className="p-3 font-sans font-semibold text-slate-600">
                        {formatIndianCurrency(row.cumulativePremium)}
                      </td>
                      {activePlan.id === "umang" && (
                        <td className={`p-3 font-sans font-extrabold ${row.survivalCashback > 0 ? "text-emerald-600 bg-emerald-50/30" : "text-slate-400"}`}>
                          {row.survivalCashback > 0 ? `+${formatIndianCurrency(row.survivalCashback)} / Yr` : "No Payback yet"}
                        </td>
                      )}
                      {activePlan.id === "bima_bachat" && (
                        <td className={`p-3 font-sans font-extrabold ${row.survivalCashback > 0 ? "text-orange-600 bg-orange-50/10" : "text-slate-400"}`}>
                          {row.survivalCashback > 0 ? `+${formatIndianCurrency(row.survivalCashback)}` : "No survival yet"}
                        </td>
                      )}
                      <td className="p-3 font-sans text-emerald-700 font-bold">
                        {activePlan.id === "jeevan_amar" 
                          ? formatIndianCurrency(activePlan.sumAssured) 
                          : formatIndianCurrency(row.guaranteedWorth)}
                      </td>
                      <td className="p-3 font-sans text-slate-800 font-extrabold">
                        {formatIndianCurrency(row.guaranteedWorth)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded text-[11px] font-sans text-slate-700 font-medium mt-4">
              💡 <strong className="text-[#003087]">Wealth Multiplication Summary:</strong> Total investment of <strong className="text-slate-800">{formatIndianCurrency(activePlan.totalPremiumPaid)}</strong> yields an estimated payout of <strong className="text-[#003087]">{formatIndianCurrency(activePlan.estimatedMaturityPayout)}</strong>. Payouts are fully tax-exempt under Section 10(10D). In worst-case scenarios, your child milestone goals remain 100% safe.
            </div>
          </div>

        </div>
      )}

      {activeTab === "explorer" && (
        <SovereignCatalogExplorer />
      )}

    </div>
  );
}
