export interface Scene {
  id: number;
  title: string;
  duration: number; // in seconds
  visualDescription: string;
  narratorText: string;
  textOnScreen: string[];
  icon: string;
  category: string;
}

export interface CalculationInputs {
  age: number;
  sumAssured: number;
  policyTerm: 16 | 21 | 25;
}

export interface CalculationResults {
  premiumPayingTerm: number;
  yearlyPremium: number;
  halfYearlyPremium: number;
  monthlyPremium: number;
  totalPremiumPaid: number;
  reversionaryBonus: number;
  finalAdditionalBonus: number;
  estimatedMaturity: number;
  deathBenefitMin: number;
  taxSavings80C: number;
}

export interface SalesRegion {
  id: string;
  state: string;
  demand: number; // 3 to 5
  buyer: string;
  reason: string;
  color: string;
  coordinates: { x: number; y: number }; // For visual grid fallback & map plotting
}

export interface BuyerPersona {
  id: string;
  profile: string;
  goal: string;
  icon: string; // lucide icon name
  suitability: string;
}

export interface LicPlan {
  id: string;
  name: string;
  planNumber: number;
  uin: string;
  category: "endowment" | "whole_life" | "money_back" | "term";
  minAge: string;
  maxAge: string;
  minSumAssured: number;
  maxSumAssured: string;
  features: string[];
  maturityBenefit: string;
  deathBenefit: string;
  bestFor: string;
  premiumModes: string[];
  loanFacility: string;
  taxBenefits: string;
}

export interface LicRider {
  id: string;
  name: string;
  uin: string;
  purpose: string;
  payout: string;
  eligibility: string;
  keyBenefit: string;
}
