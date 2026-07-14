import { LicPlan, LicRider } from "./types";

export const LIC_PLANS: LicPlan[] = [
  // ENDOWMENT PLANS (11 Plans)
  {
    id: "single_premium_endowment",
    name: "LIC's Single Premium Endowment Plan",
    planNumber: 717,
    uin: "512N283V03",
    category: "endowment",
    minAge: "90 days",
    maxAge: "65 years",
    minSumAssured: 100000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked, individual savings plan combining protection and savings",
      "One-time single lump-sum premium paid at policy inception",
      "Flexible term ranging from 10 to 25 years; max maturity age is 75 years",
      "Loan available after completing one policy year"
    ],
    maturityBenefit: "Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus (if any)",
    deathBenefit: "After risk commencement: Sum Assured + accrued bonuses. Before commencement: refund of single premium (excl. taxes)",
    bestFor: "Lump-sum savers wanting risk cover and profit-sharing without recurring payment worries",
    premiumModes: ["Single"],
    loanFacility: "Available after completing one policy year; surrender value available from year one",
    taxBenefits: "Premium eligible for Sec 80C; maturity and death proceeds tax-free under Sec 10(10D)"
  },
  {
    id: "new_endowment",
    name: "LIC's New Endowment Plan",
    planNumber: 714,
    uin: "512N277V03",
    category: "endowment",
    minAge: "8 years",
    maxAge: "55 years",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Regular premium, non-linked, with-profits (participating) individual endowment plan",
      "Policy term of 12 to 35 years; premium paying term equals policy term",
      "Participates in LIC profits through Simple Reversionary Bonuses"
    ],
    maturityBenefit: "Basic Sum Assured + Vested Bonuses + Final Additional Bonus (if any) paid as lump sum",
    deathBenefit: "Higher of (Sum Assured + bonuses), OR 7x annualised premium, OR 105% of all premiums paid to date",
    bestFor: "Long-term goal planning like children's education, marriage, or retirement corpus building",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly (ECS)"],
    loanFacility: "Available after payment of at least 1 full year's premium",
    taxBenefits: "Premium deduction under Sec 80C; benefits tax-exempt under Sec 10(10D)"
  },
  {
    id: "new_jeevan_anand",
    name: "LIC's New Jeevan Anand",
    planNumber: 715,
    uin: "512N279V03",
    category: "endowment",
    minAge: "18 years",
    maxAge: "50 years",
    minSumAssured: 100000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked whole-life endowment plan combining savings and lifelong cover",
      "Unique: Life cover continues even AFTER policy maturity",
      "Nominees receive Basic Sum Assured on death anytime post-maturity"
    ],
    maturityBenefit: "Basic Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus at end of term",
    deathBenefit: "During term: Higher of Sum Assured on Death + bonuses, OR 7x annualised premium, OR 105% of premiums. Post-maturity: Basic Sum Assured paid on death",
    bestFor: "Breadwinners seeking a combination of lump sum savings on survival and permanent heritage protection",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly (ECS)"],
    loanFacility: "Available after paying 3 full years' premiums; policy can be surrendered after 3 years",
    taxBenefits: "Deductions under Sec 80C on premiums; Sec 10(10D) exemption on proceeds"
  },
  {
    id: "jeevan_lakshya",
    name: "LIC's Jeevan Lakshya",
    planNumber: 733,
    uin: "512N297V03",
    category: "endowment",
    minAge: "18 years",
    maxAge: "50 years",
    minSumAssured: 100000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked, limited premium endowment plan ideal for family financial planning",
      "Key: Provides annual income of 10% of SA if policyholder passes away during policy term",
      "Premium paying term is 3 years less than policy term"
    ],
    maturityBenefit: "Basic Sum Assured + accrued Simple Reversionary Bonuses + Final Additional Bonus",
    deathBenefit: "Annual income (10% of SA) paid till maturity date + Sum Assured on maturity + vested bonuses at maturity date",
    bestFor: "Parents who want to guarantee annual school/college funding and a final lump-sum for kids even in their absence",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after at least 2 full years' premiums paid",
    taxBenefits: "Premium deduction under Sec 80C; maturity/death benefits exempt under Sec 10(10D)"
  },
  {
    id: "jeevan_labh",
    name: "LIC's Jeevan Labh",
    planNumber: 736,
    uin: "512N304V03",
    category: "endowment",
    minAge: "8 years",
    maxAge: "59 years",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked, limited premium paying endowment plan with higher bonus potential",
      "Pay premiums for a shorter period (10, 15, or 16 years) but enjoy coverage for a longer term (16, 21, or 25 years)",
      "Highly competitive bonus declaration rates"
    ],
    maturityBenefit: "Basic Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus at end of policy term",
    deathBenefit: "Higher of Sum Assured on Death (7x annual premium or SA), OR 105% of all premiums paid - plus accrued bonuses",
    bestFor: "Investors seeking high guaranteed yields and shorter pay cycles for key major life milestones",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after at least 2 full years' premiums paid",
    taxBenefits: "Sec 80C on premium savings; Sec 10(10D) tax exemptions on maturity"
  },
  {
    id: "amritbaal",
    name: "LIC's Amritbaal",
    planNumber: 774,
    uin: "512N365V02",
    category: "endowment",
    minAge: "30 days",
    maxAge: "13 years",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, individual, savings endowment plan designed exclusively for children",
      "Fixed Guaranteed Additions of ₹80 per ₹1,000 of Basic Sum Assured added each policy year",
      "Waiver of future premiums if proposer dies during premium term"
    ],
    maturityBenefit: "Basic Sum Assured + Accumulated Guaranteed Additions",
    deathBenefit: "Sum Assured + Accumulated Guaranteed Additions paid to child's nominee/guardian on death",
    bestFor: "Parents and grandparents planning child higher education or career start capital",
    premiumModes: ["Single", "Limited Pay (Yearly, Half-yearly, Quarterly, Monthly)"],
    loanFacility: "Available after policy acquires surrender value (typically after 2 years)",
    taxBenefits: "Premiums deductible under Sec 80C; maturity proceeds exempt under Sec 10(10D)"
  },
  {
    id: "bima_jyoti",
    name: "LIC's Bima Jyoti",
    planNumber: 760,
    uin: "512N339V03",
    category: "endowment",
    minAge: "90 days",
    maxAge: "60 years",
    minSumAssured: 100000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, individual, limited premium savings endowment plan with guaranteed returns",
      "Fixed Guaranteed Additions accrue each year (predictable and market-free returns)",
      "Premium paying term is 5 years less than policy term"
    ],
    maturityBenefit: "Basic Sum Assured + Total Guaranteed Additions accumulated over full policy term",
    deathBenefit: "Sum Assured on Death (higher of 10x annual premium or SA) + Accrued Guaranteed Additions",
    bestFor: "Conservative savers seeking fixed, guaranteed returns with zero market volatility",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly (ECS)"],
    loanFacility: "Available after at least 2 full years' premiums paid",
    taxBenefits: "Sec 80C on premiums; Sec 10(10D) on maturity and death proceeds"
  },
  {
    id: "nav_jeevan_shree",
    name: "LIC's Nav Jeevan Shree",
    planNumber: 912,
    uin: "512N387V02",
    category: "endowment",
    minAge: "90 days",
    maxAge: "PPT dependent",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, limited premium endowment plan with Guaranteed Additions",
      "Guaranteed Additions of ₹85 per ₹1,000 of BSA accrued each year",
      "Auto Cover feature keeps policy active for a defined period if a premium is missed"
    ],
    maturityBenefit: "Basic Sum Assured + total accrued Guaranteed Additions at end of 25-year term",
    deathBenefit: "Sum Assured + Guaranteed Additions accrued to date of death",
    bestFor: "Individuals wanting guaranteed, inflation-proof savings for a 25-year horizon",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available once policy acquires surrender value",
    taxBenefits: "Sec 80C on premium payments; Sec 10(10D) on maturity/death proceeds"
  },
  {
    id: "bima_lakshmi",
    name: "LIC's Bima Lakshmi",
    planNumber: 881,
    uin: "512N389V01",
    category: "endowment",
    minAge: "Minor (guardian)",
    maxAge: "Adult women",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, limited premium savings plan exclusively designed for women",
      "Periodic guaranteed survival benefits paid at defined intervals during policy term",
      "Auto cover provision keeps policy active if premium is unpaid for a limited period"
    ],
    maturityBenefit: "Lump sum maturity benefit paid at end of 25-year term = SA + all accrued Guaranteed Additions + survival benefit balance",
    deathBenefit: "Sum Assured on Death + Accrued Guaranteed Additions paid to nominee",
    bestFor: "Women seeking guaranteed savings with periodic cash flows and specialized health critical riders",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available once policy acquires surrender value",
    taxBenefits: "Sec 80C on premiums; Sec 10(10D) on maturity and death proceeds"
  },
  {
    id: "jeevan_sathi_single",
    name: "LIC's New Jeevan Sathi – Single Premium",
    planNumber: 888,
    uin: "512N393V01",
    category: "endowment",
    minAge: "18 years (both)",
    maxAge: "Depends on term",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, participating, joint-life single premium endowment plan for married couples",
      "Covers both spouses under a single policy; single lump sum premium at inception",
      "7% Guaranteed Additions per year; future premiums waived on first death"
    ],
    maturityBenefit: "Sum Assured + all accrued Guaranteed Additions paid if both spouses survive to maturity",
    deathBenefit: "First Death: Sum Assured + accrued GAs paid, policy continues with premium waiver. Second Death: Sum Assured + accrued GAs paid again",
    bestFor: "Couples wanting joint safety and dual protection payouts from a single, one-time investment",
    premiumModes: ["Single"],
    loanFacility: "Available after policy acquires surrender value (post 1 year)",
    taxBenefits: "Sec 80C deduction on single premium; tax-exempt maturity under Sec 10(10D)"
  },
  {
    id: "jeevan_sathi_limited",
    name: "LIC's New Jeevan Sathi – Limited Premium",
    planNumber: 889,
    uin: "512N394V01",
    category: "endowment",
    minAge: "18 years (both)",
    maxAge: "Depends on term",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, participating, joint-life limited premium endowment plan for married couples",
      "PPT is significantly shorter than policy term, easing recurring cash flow burden",
      "7% Guaranteed Additions on BSA annually; premium waiver upon first spouse's death"
    ],
    maturityBenefit: "Sum Assured + total accrued Guaranteed Additions paid in a lump sum on survival",
    deathBenefit: "First Death: Sum Assured + GAs paid, future premium burden is waived. Second Death: Full Sum Assured + GAs paid to nominee",
    bestFor: "Married couples wanting joint life security with spread-out limited premium structures",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after minimum required premiums paid and surrender value is acquired",
    taxBenefits: "Sec 80C deductions; Sec 10(10D) tax exemptions on all death and maturity proceeds"
  },

  // WHOLE LIFE PLANS (3 Plans)
  {
    id: "jeevan_umang",
    name: "LIC's Jeevan Umang",
    planNumber: 745,
    uin: "512N312V03",
    category: "whole_life",
    minAge: "90 days",
    maxAge: "55 years (PPT 15)",
    minSumAssured: 200000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked, whole life assurance plan with lifelong survival benefits",
      "Annual survival benefit of 8% of Basic SA paid EVERY YEAR after PPT ends, until age 100",
      "Life cover duration extends up to age 100 years"
    ],
    maturityBenefit: "Basic Sum Assured on Maturity + Vested Simple Reversionary Bonuses + Final Additional Bonus at age 100",
    deathBenefit: "Higher of 10x annual premium or Basic SA + accrued bonuses; paid on death anytime during the policy",
    bestFor: "Retirement pension planning, legacy wealth creation, and lifelong income security",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after completing at least 2 years of premium payments",
    taxBenefits: "Sec 80C on premium; Sec 10(10D) on all annual payouts, death, and maturity claims"
  },
  {
    id: "jeevan_utsav",
    name: "LIC's Jeevan Utsav",
    planNumber: 771,
    uin: "512N363V02",
    category: "whole_life",
    minAge: "90 days",
    maxAge: "65 years",
    minSumAssured: 500000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, limited premium whole life plan with guaranteed income options",
      "Short premium paying terms of only 5 to 16 years; covers life up to 100",
      "Guaranteed Additions of ₹40 per ₹1,000 BSA added each policy year during PPT"
    ],
    maturityBenefit: "Sum Assured + Total Accrued Guaranteed Additions (payable at age 100)",
    deathBenefit: "Sum Assured on Death + Accrued Guaranteed Additions paid as lump sum or instalments",
    bestFor: "Salaried workers seeking a guaranteed annual pension with a short premium paying commitment",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after completing 1 year of premium payments",
    taxBenefits: "Premium deductible under 80C; tax-free guaranteed income and death benefits under 10(10D)"
  },
  {
    id: "jeevan_utsav_single",
    name: "LIC's Jeevan Utsav – Single Premium",
    planNumber: 883,
    uin: "512N392V01",
    category: "whole_life",
    minAge: "90 days",
    maxAge: "65 years",
    minSumAssured: 500000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, single premium whole life plan with guaranteed lifetime income",
      "Pay once, get benefit for life; Guaranteed Additions of ₹85 per ₹1,000 BSA",
      "Income options: Regular Income (10% SA annually) or Flexi Income (accumulates at 5.5% interest)"
    ],
    maturityBenefit: "Sum Assured + all accrued Guaranteed Additions at age 100",
    deathBenefit: "Sum Assured + Accrued Guaranteed Additions paid to nominee",
    bestFor: "NRIs, windfall recipients, or business owners wanting to park lump sums for lifelong guaranteed income",
    premiumModes: ["Single"],
    loanFacility: "Available after 1 policy year from date of commencement",
    taxBenefits: "Deduction on premium under Sec 80C; proceeds exempt under Sec 10(10D)"
  },

  // MONEY BACK PLANS (5 Plans)
  {
    id: "bima_shree",
    name: "LIC's Bima Shree",
    planNumber: 748,
    uin: "512N316V03",
    category: "money_back",
    minAge: "8 years",
    maxAge: "55 years",
    minSumAssured: 1000000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, with-profits, limited premium, money-back plan specifically for High-Net-Worth Individuals",
      "Policy terms of 14, 16, 18, or 20 years with short limited premium paying terms",
      "High value periodic survival money-back payouts"
    ],
    maturityBenefit: "Remaining sum assured + Vested Simple Reversionary Bonuses + Final Additional Bonus at term end",
    deathBenefit: "Full Sum Assured + accrued bonuses paid without deducting money-back cashbacks already paid",
    bestFor: "High-value investors desiring structural liquidity intervals alongside wealth creation",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after paying 2 full years' premiums",
    taxBenefits: "Sec 80C deductions; Sec 10(10D) tax exemption on all payouts"
  },
  {
    id: "money_back_20",
    name: "LIC's New Money Back Plan – 20 Years",
    planNumber: 720,
    uin: "512N280V03",
    category: "money_back",
    minAge: "13 years",
    maxAge: "50 years",
    minSumAssured: 100000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked, individual money-back plan; total coverage of 20 years",
      "Pays 20% of Basic SA at end of years 5, 10, and 15 (total 60% paid early)",
      "Maturity benefit at year 20 clears remaining 40% of SA"
    ],
    maturityBenefit: "40% of Basic SA + Vested Bonuses + Final Additional Bonus",
    deathBenefit: "Full Sum Assured + accrued bonuses paid to nominee (no deduction of survival benefits already paid)",
    bestFor: "Savers needing liquidity every 5 years for business cycles, household goals, or vehicle purchases",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after completing 3 full years' premium payments",
    taxBenefits: "Premium deduction under 80C; survival and death claims tax-free under 10(10D)"
  },
  {
    id: "money_back_25",
    name: "LIC's New Money Back Plan – 25 Years",
    planNumber: 721,
    uin: "512N278V03",
    category: "money_back",
    minAge: "13 years",
    maxAge: "45 years",
    minSumAssured: 100000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked, individual money-back plan; total coverage of 25 years",
      "Pays 15% of Basic SA at end of years 5, 10, 15, and 20 (total 60% paid early)",
      "Maturity benefit at year 25 clears remaining 40% of SA"
    ],
    maturityBenefit: "40% of Basic SA + Vested Simple Reversionary Bonuses + Final Additional Bonus",
    deathBenefit: "Full Sum Assured + accrued bonuses paid to nominee (no deduction of money-back cashbacks)",
    bestFor: "Individuals wanting a longer 25-year life cover while accessing regular cash-ins at 5-year intervals",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after pay of 3 full years' premiums",
    taxBenefits: "Deductions under Sec 80C; survival cash and maturity exempt under Sec 10(10D)"
  },
  {
    id: "children_money_back",
    name: "LIC's New Children's Money Back Plan",
    planNumber: 732,
    uin: "512N296V03",
    category: "money_back",
    minAge: "0 years (90 days)",
    maxAge: "12 years",
    minSumAssured: 100000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, non-linked, child-milestone money-back plan",
      "Pays 20% of Basic SA at ages 18, 20, and 22 to fund higher studies and startup needs",
      "Proposer Premium Waiver benefit keeps plan active if parent passes away"
    ],
    maturityBenefit: "Remaining 40% of Basic SA + accrued bonuses paid at child's age 25",
    deathBenefit: "Full Sum Assured + accrued bonuses paid to child's nominee (if death happens during term)",
    bestFor: "Parents wanting structured funds for college entry, graduation, and marriage milestones",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available after policy acquires surrender value (typically after 3 years)",
    taxBenefits: "Sec 80C premium reliefs; Sec 10(10D) tax-exempt payouts"
  },
  {
    id: "jeevan_tarun",
    name: "LIC's Jeevan Tarun",
    planNumber: 734,
    uin: "512N299V03",
    category: "money_back",
    minAge: "90 days",
    maxAge: "12 years",
    minSumAssured: 75000,
    maxSumAssured: "No upper limit",
    features: [
      "Participating, child-centric savings plan with flexible payout choice",
      "Four survival benefit options (5%, 10%, 15%, or 20% SA annually from age 20 to 24)",
      "Policy matures when child completes age 25"
    ],
    maturityBenefit: "Remaining SA (75%, 50%, 25%, or 0% depending on option chosen) + accrued bonuses at child's age 25",
    deathBenefit: "Full Sum Assured + accrued bonuses paid (no deduction of survival cashflows already paid)",
    bestFor: "Parents looking for customizable annual pocket money or fee payouts during higher education",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "Available once policy acquires surrender value",
    taxBenefits: "Deduction on premium under Sec 80C; maturity claims tax-exempt under Sec 10(10D)"
  },

  // TERM ASSURANCE PLANS (8 Plans)
  {
    id: "digi_term",
    name: "LIC's Digi Term",
    planNumber: 876,
    uin: "512N356V02",
    category: "term",
    minAge: "18 years",
    maxAge: "65 years",
    minSumAssured: 5000000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, online pure risk term insurance plan",
      "Available exclusively through LIC official website with streamlined digital process",
      "Death benefit options: Level Sum Assured or Increasing Sum Assured (10% p.a., capped at 2x)"
    ],
    maturityBenefit: "NIL (Pure Term Protection - no survival or maturity payout)",
    deathBenefit: "Chosen sum assured (level or increasing) paid as lump sum or monthly instalments to nominee",
    bestFor: "Tech-savvy professionals seeking high pure risk cover at very competitive online rates",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "NIL (Standard for pure protection term plans)",
    taxBenefits: "Deductions under Sec 80C; death proceeds 100% tax-free under Sec 10(10D)"
  },
  {
    id: "digi_credit_life",
    name: "LIC's Digi Credit Life",
    planNumber: 878,
    uin: "512N358V01",
    category: "term",
    minAge: "18 years",
    maxAge: "65 years",
    minSumAssured: 200000,
    maxSumAssured: "Aligned to loan amount",
    features: [
      "Non-linked, non-participating, pure risk online decreasing term plan for credit liability",
      "Sum Assured decreases annually in sync with reducing loan balance",
      "Protects family from inheriting EMIs or mortgages if policyholder dies"
    ],
    maturityBenefit: "NIL (Pure protection plan)",
    deathBenefit: "Decreasing sum assured at the time of death is paid to settle the outstanding loan",
    bestFor: "Home loan or commercial loan borrowers wanting debt security for their family",
    premiumModes: ["Single"],
    loanFacility: "NIL",
    taxBenefits: "Deduction under Sec 80C; death proceeds tax-exempt under Sec 10(10D)"
  },
  {
    id: "yuva_credit_life",
    name: "LIC's Yuva Credit Life",
    planNumber: 877,
    uin: "512N357V01",
    category: "term",
    minAge: "18 years",
    maxAge: "45 years",
    minSumAssured: 200000,
    maxSumAssured: "Aligned to loan",
    features: [
      "Non-linked, non-participating, offline decreasing term plan for young credit borrowers",
      "Designed specifically for youth under 45 years starting their credit journey",
      "Ensures loan obligations are settled without burdening family heirs"
    ],
    maturityBenefit: "NIL",
    deathBenefit: "Decreasing sum assured paid directly to nominee to settle outstanding liabilities",
    bestFor: "Young first-time home or business borrowers preferring agent assistance and offline purchase",
    premiumModes: ["Single", "Regular", "Limited"],
    loanFacility: "NIL",
    taxBenefits: "Sec 80C premium benefits; Sec 10(10D) tax exemption on claim"
  },
  {
    id: "yuva_term",
    name: "LIC's Yuva Term",
    planNumber: 875,
    uin: "512N355V02",
    category: "term",
    minAge: "18 years",
    maxAge: "45 years",
    minSumAssured: 2500000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, pure risk offline term plan specifically for youth",
      "Maximum entry age capped at 45 to lock in low entry premiums",
      "Provides level or increasing sum assured options with flexible payout modes"
    ],
    maturityBenefit: "NIL",
    deathBenefit: "Sum Assured paid as lump sum or monthly income to nominee",
    bestFor: "Young wage earners wanting high protective cover at low cost with local agent guidance",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "NIL",
    taxBenefits: "Premiums qualify for Sec 80C; death benefit exempt under Sec 10(10D)"
  },
  {
    id: "new_tech_term",
    name: "LIC's New Tech-Term",
    planNumber: 954,
    uin: "512N351V02",
    category: "term",
    minAge: "18 years",
    maxAge: "65 years",
    minSumAssured: 5000000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, online pure term insurance plan",
      "Inflation-beating options: Level Sum Assured or Increasing Sum Assured (+10% p.a. from 5th year)",
      "Incentivizes healthy lifestyles with special lower premium tables for non-smokers"
    ],
    maturityBenefit: "NIL (Pure protection cover)",
    deathBenefit: "Chosen sum assured paid to nominee (lump sum, monthly instalments, or combination)",
    bestFor: "Tech-savvy individuals seeking high protection umbrellas with flexible premium schedules",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "NIL",
    taxBenefits: "Sec 80C tax rebates on premium; 100% tax-free death claim under Sec 10(10D)"
  },
  {
    id: "new_jeevan_amar",
    name: "LIC's New Jeevan Amar",
    planNumber: 955,
    uin: "512N350V02",
    category: "term",
    minAge: "18 years",
    maxAge: "65 years",
    minSumAssured: 2500000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating, offline pure risk term insurance plan",
      "Purchase offline via licensed LIC agents or branches with personalized underwriting",
      "Separate lower premium rates for female lives and non-smokers"
    ],
    maturityBenefit: "NIL",
    deathBenefit: "Level or Increasing Sum Assured paid as lump sum or monthly instalments to nominee",
    bestFor: "Individuals wanting maximum cover with personalized LIC agent support and physical paperwork",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "NIL",
    taxBenefits: "Sec 80C premium benefits; Sec 10(10D) tax-exempt proceeds"
  },
  {
    id: "saral_jeevan_bima",
    name: "LIC's Saral Jeevan Bima",
    planNumber: 859,
    uin: "512N341V01",
    category: "term",
    minAge: "18 years",
    maxAge: "65 years",
    minSumAssured: 500000,
    maxSumAssured: "2500000",
    features: [
      "Standardised, simplified, non-linked pure term plan mandated by IRDAI",
      "Highly affordable and standardized across all life insurers in India",
      "Simple, no-frills underwriting with 45-day waiting period (except for accidents)"
    ],
    maturityBenefit: "NIL",
    deathBenefit: "Basic Sum Assured paid as a lump sum to nominee upon death",
    bestFor: "First-time buyers or low-income households wanting standard, hassle-free life protection",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "NIL",
    taxBenefits: "Deductions under Sec 80C; death claims tax-exempt under Sec 10(10D)"
  },
  {
    id: "bima_kavach",
    name: "LIC's Bima Kavach",
    planNumber: 887,
    uin: "512N360V01",
    category: "term",
    minAge: "18 years",
    maxAge: "55 years",
    minSumAssured: 2500000,
    maxSumAssured: "No upper limit",
    features: [
      "Non-linked, non-participating whole life term protection plan",
      "Covers the life assured all the way up to age 100",
      "Event-based Increasing Cover: Increase cover by 50% on major events like marriage, child birth"
    ],
    maturityBenefit: "NIL",
    deathBenefit: "Sum Assured (level or increased by event options) paid as claim to nominee",
    bestFor: "Young adults who want their life protection to automatically expand with milestone responsibilities",
    premiumModes: ["Yearly", "Half-yearly", "Quarterly", "Monthly"],
    loanFacility: "NIL",
    taxBenefits: "Sec 80C premium deductions; Sec 10(10D) tax-exempt death payouts"
  }
];

export const LIC_RIDERS: LicRider[] = [
  {
    id: "accident_benefit",
    name: "LIC's Accident Benefit Rider",
    uin: "512B203V03",
    purpose: "Provides additional lump sum sum assured if death occurs specifically due to an accident",
    payout: "Rider Sum Assured paid in addition to the base policy's standard death benefit",
    eligibility: "Age 18 to 70; attachable to most endowment, money back, and whole life policies",
    keyBenefit: "Provides highly cost-effective supplementary accidental death protection"
  },
  {
    id: "premium_waiver",
    name: "LIC's Premium Waiver Benefit Rider",
    uin: "512B204V04",
    purpose: "Waives all future base policy premiums if the proposer/parent becomes permanently disabled or dies",
    payout: "Policy continues in full force with premium paid by LIC; benefits remain fully intact",
    eligibility: "Age 18 to 55; crucial for child protection plans (Jeevan Tarun, Children Money Back)",
    keyBenefit: "Guarantees that child savings goals are completed even on parent's demise"
  },
  {
    id: "accidental_death_disability",
    name: "LIC's Accidental Death & Disability Benefit Rider",
    uin: "512B209V02",
    purpose: "Pays extra sum on accidental death AND covers total permanent disability from accidents",
    payout: "Death: Rider SA lump sum. Disability: Rider SA paid as equal monthly instalments over 10 years + future premiums waived",
    eligibility: "Age 18 to 65 (cover till age 70); maximum rider SA of ₹1 Crore",
    keyBenefit: "Comprehensive accident shield providing income support and premium waivers"
  },
  {
    id: "new_term_assurance",
    name: "LIC's New Term Assurance Rider",
    uin: "512B210V02",
    purpose: "Adds a layer of pure protection term cover on top of the base plan's standard death benefit",
    payout: "Nominee receives both base Sum Assured and Rider Sum Assured on death, doubling protection",
    eligibility: "Age 18+; attachable ONLY at inception of endowment or money-back plans",
    keyBenefit: "Very cost-effective way to heavily boost death coverage without a separate standalone policy"
  },
  {
    id: "linked_accidental_death",
    name: "LIC's Linked Accidental Death Benefit Rider",
    uin: "512A211V02",
    purpose: "Adds accidental death protection exclusively to Unit Linked Insurance Plans (ULIPs)",
    payout: "Rider Sum Assured paid in addition to the ULIP fund value on accidental death",
    eligibility: "Depends on underlying ULIP base plan; premium deducted from ULIP premiums",
    keyBenefit: "Accidental protection tailored specifically for market-linked savers"
  },
  {
    id: "critical_illness_health",
    name: "LIC's Critical Illness Health Rider",
    uin: "512B227V01",
    purpose: "Pays a lump sum upon first diagnosis of any of the covered 15 major critical illnesses",
    payout: "Diagnosis-based lump sum payout; reduces the base sum assured proportionally, policy continues",
    eligibility: "Age 18 to 65 (terminates at 75); attachable to most regular-premium endowment & whole life plans",
    keyBenefit: "Financial cushion for major health crises (cancer, heart attack, stroke, kidney failure)"
  },
  {
    id: "female_critical_illness",
    name: "LIC's Female Critical Illness Benefit Rider",
    uin: "512B226V01",
    purpose: "Specialized critical illness rider exclusively for female policyholders, covering women-specific risks",
    payout: "Lump sum paid on first diagnosis of covered female-specific conditions (breast, ovarian, cervical cancer, etc.)",
    eligibility: "Age 18 to 65; designed to be paired with LIC's Bima Lakshmi Plan 881",
    keyBenefit: "Gender-specific health protection addressing critical risks not covered in standard health riders"
  }
];
