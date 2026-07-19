import { CalculationInputs, CalculationResults } from "./types";
import { LIC_PLANS } from "./plansData";

/**
 * Standard LIC Policy parameters and formulas
 */

export interface DetailedPolicyResult {
  id: string;
  name: string;
  planNumber: number;
  policyTerm: number;
  premiumPayingTerm: number;
  monthlyPremium: number;
  yearlyPremium: number;
  totalPremiumPaid: number;
  sumAssured: number;
  estimatedReversionaryBonus: number;
  estimatedFAB: number;
  estimatedMaturityPayout: number;
  lifelongFreeCover: number;
  guaranteedAnnualIncome: number;
  guaranteedAnnualIncomeStartAge: number;
  childBenefitAnnualPayout: number;
  premiumWaiverBenefit: boolean;
  returnMultiplier: number;
  mainHighlight: string;
  suitabilityScore: number; // out of 100
  policyCategory: "endowment" | "whole_life" | "money_back" | "term" | "pension" | "micro";
  moneyBackPayouts?: string;
}

/**
 * Format currency in Indian numbering format (e.g. 5,00,000)
 */
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Core Jeevan Labh (Plan 736) logic
 */
export function calculateJeevanLabh(inputs: CalculationInputs): {
  results: CalculationResults | null;
  eligible: boolean;
  maxAgeAllowed: number;
} {
  const { age, sumAssured, policyTerm } = inputs;

  let maxAgeAllowed = 50;
  let premiumPayingTerm = 16;
  let baseRatePerThousand = 44.0; 

  if (policyTerm === 16) {
    maxAgeAllowed = 59;
    premiumPayingTerm = 10;
    baseRatePerThousand = 84.5;
  } else if (policyTerm === 21) {
    maxAgeAllowed = 54;
    premiumPayingTerm = 15;
    baseRatePerThousand = 54.2;
  } else {
    maxAgeAllowed = 50;
    premiumPayingTerm = 16;
    baseRatePerThousand = 44.1;
  }

  if (age < 8 || age > maxAgeAllowed) {
    return { results: null, eligible: false, maxAgeAllowed };
  }

  const ageFactor = (age - 30) * (policyTerm === 16 ? 0.28 : policyTerm === 21 ? 0.38 : 0.48);
  const adjustedRatePerThousand = Math.max(20.0, baseRatePerThousand + ageFactor);
  const rawYearlyPremium = (sumAssured / 1000) * adjustedRatePerThousand;
  const firstYearGST = rawYearlyPremium * 1.045;
  const succeedingYearsGST = rawYearlyPremium * 1.0225;
  const totalPremiumPaid = firstYearGST + succeedingYearsGST * (premiumPayingTerm - 1);

  const reversionaryBonus = (sumAssured / 1000) * 55 * policyTerm;

  let fabRatePerThousand = 20;
  if (sumAssured >= 1000000) fabRatePerThousand = 110;
  else if (sumAssured >= 500000) fabRatePerThousand = 55;
  else if (sumAssured >= 300000) fabRatePerThousand = 35;
  const finalAdditionalBonus = (sumAssured / 1000) * fabRatePerThousand;

  const estimatedMaturity = sumAssured + reversionaryBonus + finalAdditionalBonus;
  const deathBenefitMin = Math.max(rawYearlyPremium * 7, sumAssured) + reversionaryBonus;

  return {
    eligible: true,
    maxAgeAllowed,
    results: {
      premiumPayingTerm,
      yearlyPremium: Math.round(firstYearGST),
      halfYearlyPremium: Math.round(firstYearGST * 0.505),
      monthlyPremium: Math.round(firstYearGST * 0.086),
      totalPremiumPaid: Math.round(totalPremiumPaid),
      reversionaryBonus: Math.round(reversionaryBonus),
      finalAdditionalBonus: Math.round(finalAdditionalBonus),
      estimatedMaturity: Math.round(estimatedMaturity),
      deathBenefitMin: Math.round(deathBenefitMin),
      taxSavings80C: Math.min(150000, rawYearlyPremium) * 0.30
    }
  };
}

/**
 * Calculates and compares performance of all 8 major policies for a given entry age and monthly premium budget.
 */
export function calculateAllPoliciesByBudget(
  age: number,
  monthlyBudget: number,
  chosenTerm: 16 | 21 | 25 = 25
): DetailedPolicyResult[] {
  const yearlyBudget = monthlyBudget * 12;

  const excludeIds = ["jeevan_labh", "new_jeevan_anand", "jeevan_umang", "jeevan_lakshya", "new_jeevan_amar"];
  const dynamicPlans = LIC_PLANS.filter(p => !excludeIds.includes(p.id)).map(plan => {
    let bonusRate = 40; // default
    let ppt: number = chosenTerm;
    let premiumRateFactor = 45; // default
    let suitabilityScore = 90;
    
    // Customize specific categories
    if (plan.category === "term") {
      bonusRate = 0;
      premiumRateFactor = chosenTerm === 16 ? 12.5 : chosenTerm === 21 ? 14.2 : 15.6;
      suitabilityScore = 91;
    } else if (plan.category === "whole_life") {
      bonusRate = 42;
      ppt = plan.id === "jeevan_utsav_single" ? 1 : chosenTerm - 5;
      premiumRateFactor = chosenTerm === 16 ? 72.8 : chosenTerm === 21 ? 51.4 : 39.5;
      suitabilityScore = 92;
    } else if (plan.category === "money_back") {
      bonusRate = plan.id === "bima_shree" ? 42 : 40;
      ppt = plan.id.includes("single") ? 1 : chosenTerm - 4;
      premiumRateFactor = chosenTerm === 16 ? 60.5 : chosenTerm === 21 ? 42.4 : 32.5;
      suitabilityScore = 88;
    } else {
      // endowment
      bonusRate = plan.id.includes("jyoti") || plan.id.includes("baal") ? 50 : 42;
      ppt = plan.id.includes("single") ? 1 : chosenTerm - 2;
      premiumRateFactor = chosenTerm === 16 ? 75.0 : chosenTerm === 21 ? 49.0 : 40.0;
      suitabilityScore = 90;
    }

    // Ensure ppt is at least 1 and does not exceed chosenTerm
    ppt = Math.max(1, Math.min(ppt, chosenTerm));

    return {
      id: plan.id,
      name: plan.name,
      planNumber: plan.planNumber,
      policyCategory: plan.category as "endowment" | "whole_life" | "money_back" | "term",
      mainHighlight: plan.bestFor || plan.features[0] || "",
      bonusRate,
      ppt: ppt as number,
      premiumRateFactor,
      suitabilityScore,
      moneyBackPayouts: plan.category === "money_back" ? (plan.maturityBenefit || "") : undefined
    };
  });

  const plansData: any[] = [
    {
      id: "labh",
      name: "LIC Jeevan Labh",
      planNumber: 736,
      policyCategory: "endowment" as const,
      mainHighlight: "Max Cash Returns with Limited Premium Paying Years",
      bonusRate: 55, // Rs. 55 per 1000 SA per year
      ppt: chosenTerm === 16 ? 10 : chosenTerm === 21 ? 15 : 16,
      premiumRateFactor: chosenTerm === 16 ? 84.5 : chosenTerm === 21 ? 54.2 : 44.1,
      suitabilityScore: 95
    },
    {
      id: "anand",
      name: "LIC New Jeevan Anand",
      planNumber: 915,
      policyCategory: "endowment" as const,
      mainHighlight: "Double Benefit: Maturity payout + LIFETIME FREE whole-life cover",
      bonusRate: 45, // Rs. 45 per 1000 SA per year
      ppt: chosenTerm, 
      premiumRateFactor: chosenTerm === 16 ? 76.0 : chosenTerm === 21 ? 50.5 : 41.2,
      suitabilityScore: 89
    },
    {
      id: "umang",
      name: "LIC Jeevan Umang",
      planNumber: 945,
      policyCategory: "whole_life" as const,
      mainHighlight: "Whole Life Pension: Guaranteed 8% Sum Assured every year after PPT",
      bonusRate: 48,
      ppt: chosenTerm === 16 ? 15 : chosenTerm === 21 ? 20 : 25, 
      premiumRateFactor: chosenTerm === 16 ? 72.8 : chosenTerm === 21 ? 51.4 : 39.5,
      suitabilityScore: 92
    },
    {
      id: "lakshya",
      name: "LIC Jeevan Lakshya",
      planNumber: 933,
      policyCategory: "endowment" as const,
      mainHighlight: "Child Education: Waiver of Premium + 10% Annual Payout on parent decease",
      bonusRate: 46,
      ppt: chosenTerm - 3, 
      premiumRateFactor: chosenTerm === 16 ? 68.2 : chosenTerm === 21 ? 46.5 : 37.8,
      suitabilityScore: 94
    },
    {
      id: "bima_bachat",
      name: "LIC New Bima Bachat",
      planNumber: 948,
      policyCategory: "money_back" as const,
      mainHighlight: "Money Back: Regular cash-back every 5 years for intermediate goals",
      bonusRate: 42,
      ppt: chosenTerm,
      premiumRateFactor: chosenTerm === 16 ? 60.5 : chosenTerm === 21 ? 42.4 : 32.5,
      suitabilityScore: 88,
      moneyBackPayouts: "Pays 15% of Sum Assured at Year 5, Year 10, and remainder on mature"
    },
    {
      id: "jeevan_amar",
      name: "LIC Jeevan Amar",
      planNumber: 855,
      policyCategory: "term" as const,
      mainHighlight: "Pure Protection: High-value family term shield at absolute lowest cost",
      bonusRate: 0,
      ppt: chosenTerm,
      premiumRateFactor: chosenTerm === 16 ? 12.5 : chosenTerm === 21 ? 14.2 : 15.6,
      suitabilityScore: 91
    },
    {
      id: "jeevan_akshay",
      name: "LIC Jeevan Akshay-VII",
      planNumber: 857,
      policyCategory: "pension" as const,
      mainHighlight: "Immediate / Deferred Pension: Secure guaranteed lifetime monthly annuity",
      bonusRate: 35,
      ppt: 1, // pay upfront to start annuity
      premiumRateFactor: chosenTerm === 16 ? 48.0 : chosenTerm === 21 ? 42.0 : 38.0,
      suitabilityScore: 84
    },
    {
      id: "bhagya_lakshmi",
      name: "LIC Bhagya Lakshmi",
      planNumber: 839,
      policyCategory: "micro" as const,
      mainHighlight: "Micro Insurance: Very affordable rural protector with premium return",
      bonusRate: 33,
      ppt: chosenTerm - 2,
      premiumRateFactor: chosenTerm === 16 ? 32.0 : chosenTerm === 21 ? 28.0 : 25.0,
      suitabilityScore: 80
    },
    ...dynamicPlans
  ];

  return plansData.map((plan) => {
    // Premium logic adjustment based on age
    const ageOffset = (age - 30) * 0.35;
    let finalFactor = Math.max(8.0, plan.premiumRateFactor + ageOffset);

    let sumAssured = 0;
    let actualYearlyPremium = 0;
    let actualMonthlyPremium = 0;
    let totalPremiumPaid = 0;

    if (plan.policyCategory === "term") {
      // Pure protection Term Assurance: Sum Assured is scaled MASSIVELY (10x-20x larger covers for same budget)
      sumAssured = Math.round((yearlyBudget / finalFactor) * 1000);
      sumAssured = Math.max(1000000, Math.round((sumAssured * 15) / 1000000) * 1000000); // Decent term size round to million
      const rawYearly = (sumAssured / 15000) * finalFactor; // scaled term rate
      actualYearlyPremium = Math.round(rawYearly * 1.18); // 18% GST for pure covers
      actualMonthlyPremium = Math.round(actualYearlyPremium * 0.086);
      totalPremiumPaid = actualYearlyPremium * plan.ppt;
    } else if (plan.id === "jeevan_akshay") {
      // Single/Annuity accumulation logic:
      const totalAccumulationPool = monthlyBudget * 12 * 10; // equivalent pool
      sumAssured = Math.max(100000, Math.round(totalAccumulationPool / 50000) * 50000);
      actualYearlyPremium = sumAssured; // single investment
      actualMonthlyPremium = 0;
      totalPremiumPaid = sumAssured;
    } else {
      // Annualized standard endowment or cash back plans
      sumAssured = Math.round((yearlyBudget / finalFactor) * 1000);
      sumAssured = Math.max(50000, Math.round(sumAssured / 50000) * 50000);
      
      const rawYearly = (sumAssured / 1000) * finalFactor;
      actualYearlyPremium = Math.round(rawYearly * 1.045); // average including GST
      actualMonthlyPremium = Math.round(actualYearlyPremium * 0.086);
      totalPremiumPaid = Math.round((rawYearly * 1.045) + (rawYearly * 1.0225) * (plan.ppt - 1));
    }

    // Pro-rate bonuses based on state schedules
    const reversionaryBonus = plan.bonusRate > 0 ? (sumAssured / 1000) * plan.bonusRate * chosenTerm : 0;

    // FAB Tiers
    let fabRate = 12;
    if (sumAssured >= 1000000) fabRate = 120;
    else if (sumAssured >= 500000) fabRate = 60;
    else if (sumAssured >= 300000) fabRate = 35;
    const estimatedFAB = plan.bonusRate > 0 ? (sumAssured / 1000) * fabRate : 0;

    let estimatedMaturityPayout = sumAssured + reversionaryBonus + estimatedFAB;
    let lifelongFreeCover = 0;
    let guaranteedAnnualIncome = 0;
    let guaranteedAnnualIncomeStartAge = 0;
    let childBenefitAnnualPayout = 0;
    let premiumWaiverBenefit = false;

    // Apply special benefits per plan rules
    if (plan.id === "anand") {
      lifelongFreeCover = sumAssured;
    } else if (plan.id === "umang") {
      guaranteedAnnualIncome = Math.round(sumAssured * 0.08); // 8% annuity
      guaranteedAnnualIncomeStartAge = age + plan.ppt;
      estimatedMaturityPayout = sumAssured + ((sumAssured / 1000) * plan.bonusRate * (100 - age)) + (sumAssured * 0.15);
    } else if (plan.id === "lakshya") {
      childBenefitAnnualPayout = Math.round(sumAssured * 0.10);
      premiumWaiverBenefit = true;
    } else if (plan.id === "bima_bachat") {
      // Money Back paying inside the term, so maturity payout is lower by already paid cashbacks
      estimatedMaturityPayout = Math.round(sumAssured * 0.70 + reversionaryBonus + estimatedFAB);
    } else if (plan.policyCategory === "term") {
      estimatedMaturityPayout = 0; // Pure term protection is zero on safe terminal maturity
    } else if (plan.id === "jeevan_akshay") {
      guaranteedAnnualIncome = Math.round(sumAssured * 0.075); // 7.5% guaranteed annual pension payout immediately
      guaranteedAnnualIncomeStartAge = age + 1;
      estimatedMaturityPayout = sumAssured; // purchase price returned to nominee on death
    } else if (plan.id === "bhagya_lakshmi") {
      // returns 110% of premiums on survival
      estimatedMaturityPayout = Math.round(totalPremiumPaid * 1.10);
    }

    const returnMultiplier = totalPremiumPaid > 0 ? Number((estimatedMaturityPayout / totalPremiumPaid).toFixed(2)) : 0;

    return {
      id: plan.id,
      name: plan.name,
      planNumber: plan.planNumber,
      policyTerm: chosenTerm,
      premiumPayingTerm: plan.ppt,
      monthlyPremium: actualMonthlyPremium,
      yearlyPremium: actualYearlyPremium,
      totalPremiumPaid,
      sumAssured,
      estimatedReversionaryBonus: Math.round(reversionaryBonus),
      estimatedFAB: Math.round(estimatedFAB),
      estimatedMaturityPayout: Math.round(estimatedMaturityPayout),
      lifelongFreeCover,
      guaranteedAnnualIncome,
      guaranteedAnnualIncomeStartAge,
      childBenefitAnnualPayout,
      premiumWaiverBenefit,
      returnMultiplier,
      mainHighlight: plan.mainHighlight,
      suitabilityScore: plan.suitabilityScore,
      policyCategory: plan.policyCategory,
      moneyBackPayouts: plan.moneyBackPayouts
    };
  });
}

/**
 * Creates an intelligent multi-policy portfolio simulation based on chosen strategy & selected plans.
 */
export interface PortfolioSimResult {
  totalMonthlyPremium: number;
  totalYearlyPremium: number;
  overallTotalPremiumPaid: number;
  combinedSumAssured: number;
  combinedProjectedMaturity: number;
  combinedLifeCoverActive: number;
  combinedAnnualAnnuity: number;
  overallROI: number;
  riskCoverIndex: number; // out of 100
  payoutTimelineNarrative: string;
  allocations: Array<{
    id: string;
    name: string;
    allocatedMonthlyPremium: number;
    allocatedSumAssured: number;
    allocatedMaturity: number;
    percentage: number;
  }>;
}

export function simulatePortfolio(
  age: number,
  totalMonthlyBudget: number,
  selectedPlanIds: string[],
  chosenTerm: 16 | 21 | 25,
  strategy: "equal" | "returns" | "shield" | "custom",
  customPercentages?: { [key: string]: number }
): PortfolioSimResult {
  // Guard for empty selection
  if (selectedPlanIds.length === 0) {
    return {
      totalMonthlyPremium: 0,
      totalYearlyPremium: 0,
      overallTotalPremiumPaid: 0,
      combinedSumAssured: 0,
      combinedProjectedMaturity: 0,
      combinedLifeCoverActive: 0,
      combinedAnnualAnnuity: 0,
      overallROI: 0,
      riskCoverIndex: 0,
      payoutTimelineNarrative: "Select policies to build your customized sovereign financial portfolio.",
      allocations: []
    };
  }

  // Calculate base results for all 8 plans
  const allPolicyResults = calculateAllPoliciesByBudget(age, totalMonthlyBudget, chosenTerm);
  
  // Decide percentages per selected plan based on strategy
  const allocationsMap: { [key: string]: number } = {};
  
  if (strategy === "custom" && customPercentages) {
    // Use custom user percentages scaled to 100%
    let totalCustomSum = selectedPlanIds.reduce((sum, id) => sum + (customPercentages[id] || 0), 0);
    if (totalCustomSum === 0) totalCustomSum = 1;
    selectedPlanIds.forEach((id) => {
      allocationsMap[id] = ((customPercentages[id] || 0) / totalCustomSum) * 100;
    });
  } else if (strategy === "returns") {
    // High-yield policies (Jeevan Labh, Single Prem, Anand) get dominant weights (e.g., 60%), rest get equal shares
    const preferredIds = ["labh", "anand", "jeevan_akshay"];
    const highYieldChosen = selectedPlanIds.filter(id => preferredIds.includes(id));
    const regularChosen = selectedPlanIds.filter(id => !preferredIds.includes(id));
    
    if (highYieldChosen.length > 0) {
      const highYieldTotalAlloc = 70; // 70% budget goes to high yield
      const eachHighYield = highYieldTotalAlloc / highYieldChosen.length;
      const eachRegular = regularChosen.length > 0 ? (30 / regularChosen.length) : 0;
      highYieldChosen.forEach(id => allocationsMap[id] = eachHighYield);
      regularChosen.forEach(id => allocationsMap[id] = eachRegular);
    } else {
      // Fallback to equal split
      selectedPlanIds.forEach(id => allocationsMap[id] = 100 / selectedPlanIds.length);
    }
  } else if (strategy === "shield") {
    // Safety plans (Jeevan Lakshya, Jeevan Amar, Jeevan Umang) get high weights
    const safetyIds = ["lakshya", "jeevan_amar", "umang"];
    const safetyChosen = selectedPlanIds.filter(id => safetyIds.includes(id));
    const othersChosen = selectedPlanIds.filter(id => !safetyIds.includes(id));
    
    if (safetyChosen.length > 0) {
      const safetyTotalAlloc = 70;
      const eachSafety = safetyTotalAlloc / safetyChosen.length;
      const eachOther = othersChosen.length > 0 ? (30 / othersChosen.length) : 0;
      safetyChosen.forEach(id => allocationsMap[id] = eachSafety);
      othersChosen.forEach(id => allocationsMap[id] = eachOther);
    } else {
      selectedPlanIds.forEach(id => allocationsMap[id] = 100 / selectedPlanIds.length);
    }
  } else {
    // Default "equal"
    selectedPlanIds.forEach(id => allocationsMap[id] = 100 / selectedPlanIds.length);
  }

  // Now calculate allocated outputs
  let totalMonthlyPremium = 0;
  let totalYearlyPremium = 0;
  let overallTotalPremiumPaid = 0;
  let combinedSumAssured = 0;
  let combinedProjectedMaturity = 0;
  let combinedLifeCoverActive = 0;
  let combinedAnnualAnnuity = 0;
  
  const finalAllocationsList = selectedPlanIds.map((planId) => {
    const originalPlan = allPolicyResults.find(p => p.id === planId);
    if (!originalPlan) return null;
    const allocPercent = allocationsMap[planId] || 0;
    const allocatedMonthlyPremium = Math.round((totalMonthlyBudget * allocPercent) / 100);
    
    // Scale features based on proportional cash allocation
    const scaleFactor = totalMonthlyBudget > 0 ? allocatedMonthlyPremium / totalMonthlyBudget : 0;
    
    const allocatedSumAssured = Math.round(originalPlan.sumAssured * scaleFactor);
    const allocatedMaturity = Math.round(originalPlan.estimatedMaturityPayout * scaleFactor);
    const allocatedPremiumPaid = Math.round(originalPlan.totalPremiumPaid * scaleFactor);
    const allocatedAnnuity = Math.round(originalPlan.guaranteedAnnualIncome * scaleFactor);
    const allocatedLifeCover = Math.round((originalPlan.sumAssured + (originalPlan.id === "jeevan_amar" ? originalPlan.sumAssured : originalPlan.estimatedReversionaryBonus)) * scaleFactor);

    totalMonthlyPremium += allocatedMonthlyPremium;
    totalYearlyPremium += allocatedMonthlyPremium * 12;
    overallTotalPremiumPaid += allocatedPremiumPaid;
    combinedSumAssured += allocatedSumAssured;
    combinedProjectedMaturity += allocatedMaturity;
    combinedLifeCoverActive += allocatedLifeCover;
    combinedAnnualAnnuity += allocatedAnnuity;

    return {
      id: planId,
      name: originalPlan.name,
      allocatedMonthlyPremium,
      allocatedSumAssured,
      allocatedMaturity,
      percentage: Math.round(allocPercent)
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  const overallROI = overallTotalPremiumPaid > 0 ? Number((combinedProjectedMaturity / overallTotalPremiumPaid).toFixed(2)) : 0;
  
  // Calculate relative risk cover index
  const hasTerm = selectedPlanIds.some(id => {
    const p = allPolicyResults.find(pr => pr.id === id);
    return p?.policyCategory === "term" || id === "jeevan_amar";
  });
  const hasAnand = selectedPlanIds.includes("anand") || selectedPlanIds.includes("new_jeevan_anand");
  const hasLakshya = selectedPlanIds.includes("lakshya") || selectedPlanIds.includes("jeevan_lakshya");

  let termMultiplier = hasTerm ? 40 : 10;
  let anandMultiplier = hasAnand ? 25 : 5;
  let lakshyaMultiplier = hasLakshya ? 25 : 5;
  let riskCoverIndex = Math.min(100, Math.round(termMultiplier + anandMultiplier + lakshyaMultiplier + (combinedSumAssured / 50000)));

  // Generate dynamic strategic feedback for this custom monthly level
  let payoutTimelineNarrative = "";
  if (totalMonthlyBudget < 3000) {
    payoutTimelineNarrative = `Recommended Starter Safety Portfolio: Investing ₹${totalMonthlyBudget}/month splits into basic endowment growth. If possible, upgrade to ₹3500+ to add high-value Term Shield to secure your loved ones up to ₹1 Crore.`;
  } else if (totalMonthlyBudget < 6000) {
    payoutTimelineNarrative = `Balanced Family Catalyst Portfolio: At ₹${totalMonthlyBudget}/month, you can easily combine an Endowment plan (such as Jeevan Labh) for child higher education, along with New Jeevan Anand for double protection. This safeguards intermediate milestones without stressing liquidity.`;
  } else if (totalMonthlyBudget < 11000) {
    payoutTimelineNarrative = `Sovereign Wealth Fortification Portfolio: A robust ₹${totalMonthlyBudget}/month commitment allows multi-policy compounding. Your returns are optimized with up to ₹${formatIndianCurrency(combinedProjectedMaturity)} expected at tax-exempt maturity, accompanied by ₹${formatIndianCurrency(combinedAnnualAnnuity)} in regular lifetime pensions!`;
  } else {
    payoutTimelineNarrative = `High-Net-Worth Sovereign Sanctuary: With an elite ₹${totalMonthlyBudget}/month budget, you enjoy premier tax hedges under Section 80C and 10(10D), combining the massive protective umbrella of Pure Term (Jeevan Amar) with immediate compound cash back (Bima Bachat) and lifetime high-yield annuity streams.`;
  }

  return {
    totalMonthlyPremium,
    totalYearlyPremium,
    overallTotalPremiumPaid,
    combinedSumAssured,
    combinedProjectedMaturity,
    combinedLifeCoverActive,
    combinedAnnualAnnuity,
    overallROI,
    riskCoverIndex,
    payoutTimelineNarrative,
    allocations: finalAllocationsList
  };
}
