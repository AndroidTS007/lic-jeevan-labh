import { Scene, SalesRegion, BuyerPersona } from "./types";

export const INITIAL_SCENES: Scene[] = [
  {
    id: 1,
    title: "The Hook — Teen Bade Sapne",
    duration: 12,
    visualDescription: "A loving Indian family of four walks happily toward a glowing golden sunrise. Beautiful floating icons (graduation cap, wedding rings, piggy bank) fade in, representing future dreams.",
    narratorText: "Kya aap apne bacche ki padhai, uski shaadi, aur apna retirement — teeno ke liye plan kar rahe hain? Toh LIC Jeevan Labh aapke liye hi bana hai!",
    textOnScreen: [
      "Bacche ki Padhai? Shaadi? Retirement?",
      "Ek hi policy — TEEN bade sapne!"
    ],
    icon: "GraduationCap",
    category: "introduction"
  },
  {
    id: 2,
    title: "Introducing LIC Jeevan Labh (Plan 736)",
    duration: 18,
    visualDescription: "A glowing golden scroll unfurls on a deep indigo background. A certified badge sparkles with the text Plan No. 736 (Updated Oct 2024). Standard security seals slide in.",
    narratorText: "LIC Jeevan Labh — ek aisa plan jisme aap premium sirf kuch saalon tak bharte hain, lekin coverage aur benefits poore policy term tak milti hai. Aur yeh stock market se bilkul alag hai — 100% safe!",
    textOnScreen: [
      "LIC Jeevan Labh (Plan No. 736)",
      "Non-Linked, With-Profit Endowment Plan",
      "Limited Premium Paying Scheme",
      "100% Safe (No Stock Market Risk)"
    ],
    icon: "TrendingUp",
    category: "details"
  },
  {
    id: 3,
    title: "What Makes It Special? Comparisons",
    duration: 25,
    visualDescription: "A clear interactive comparison screen. Traditional plans on the left have red crosses; LIC Jeevan Labh on the right features glowing green checkmarks sliding in sequentially.",
    narratorText: "Is plan ki sabse badi khaasiyat yeh hai ki aap premium payment term puri nahi bharte — sirf 10, 15, ya 16 saal bharo, aur policy 16, 21, ya 25 saal tak chalti rehti hai!",
    textOnScreen: [
      "Traditional Plans: Pay premiums for FULL term",
      "LIC Jeevan Labh: Pay for FEWER years, enjoy FULL coverage",
      "With-Profit Sharing: Bonus profits shared directly with you!"
    ],
    icon: "Award",
    category: "features"
  },
  {
    id: 4,
    title: "Age Eligibility & Rules",
    duration: 25,
    visualDescription: "A graphic linear timeline representing ages 8 to 75. A toddler avatar transitions into a professional, then a warm retiree, moving across the gold timeline with highlighted limits.",
    narratorText: "Aap apne bachche ko sirf 8 saal ki umra mein bhi is plan mein enroll kar sakte hain! Aur entry maximum 59 saal tak hai. Maturity age maximum 75 saal tak hoti hai.",
    textOnScreen: [
      "Minimum Entry Age: 8 Years",
      "Maximum Entry Age: 59 Years",
      "Maximum Maturity Age: 75 Years",
      "Minimum Sum Assured: ₹2,00,000",
      "Maximum Sum Assured: No Upper Limit!"
    ],
    icon: "Smile",
    category: "eligibility"
  },
  {
    id: 5,
    title: "Three Key Combinations",
    duration: 25,
    visualDescription: "Three aesthetic, highly polished cards slide-in side-by-side with rich color themes. They spin or flip open to reveal their primary life milestone application.",
    narratorText: "Teen combinations hain — aap apni zaroorat ke hisaab se choose kar sakte hain: bachche ki padhai ke liye 16 saal, shaadi ke liye 21 saal, ya retirement ke liye 25 saal ka plan!",
    textOnScreen: [
      "Option 1: 16-Year Plan ➜ Pay only 10 years (Education)",
      "Option 2: 21-Year Plan ➜ Pay only 15 years (Marriage)",
      "Option 3: 25-Year Plan ➜ Pay only 16 years (Retirement Corpus)"
    ],
    icon: "Layers",
    category: "combinations"
  },
  {
    id: 6,
    title: "Benefits Breakdown",
    duration: 25,
    visualDescription: "Interactive cards explode into view. A treasure chest pops up raining gold coins (Maturity benefit), followed by a sturdy gold umbrella shielding a family of four (Death protection benefit).",
    narratorText: "Maturity pe aapko Basic Sum Assured ke saath saath bonus bhi milta hai. Aur agar life assured ki death policy term mein hoti hai, toh nominee ko full death benefit milta hai — jisme 105% premiums guaranteed hain.",
    textOnScreen: [
      "Maturity: Sum Assured + Reversionary Bonus + Final Bonus",
      "Death Benefit: Higher of 7x Premium OR Sum Assured + Bonuses",
      "Loan Facility: Available after 2 full premium years paid",
      "Section 80C Tax benefits eligible on premium payments!"
    ],
    icon: "ShieldCheck",
    category: "benefits"
  },
  {
    id: 7,
    title: "Real Life Example: Rahul",
    duration: 20,
    visualDescription: "An animated father figure, Rahul (Age 30), appears on screen. An interactive timeline bar graphs his contributions over 16 years and the subsequent 9 years of free coverage, building up to a massive payout.",
    narratorText: "Rahul sirf 16 saal premium bharta hai — lekin policy 25 saal chalti hai. Maturity mein usse ₹9–10 lakh tak mil sakte hain — aur beech mein kuch hua toh family ko full benefit!",
    textOnScreen: [
      "Rahul (30 Yrs) | Sum Assured: ₹5,00,000",
      "Pays ₹23,500/year for 16 Years (Total Paid ~₹3.76L)",
      "Years 17-25: ₹0 Premiums, 100% Active Shield Protection",
      "Maturity at Age 55: Receives ₹9,00,000 to ₹10,000,000"
    ],
    icon: "UserCheck",
    category: "example"
  },
  {
    id: 8,
    title: "Geographic Hotspots in India",
    duration: 25,
    visualDescription: "A glowing interactive heatmap of India. High demand states flash in orange and deep blue. Dynamic hover bubbles reveal regional preference trends with icons of schools and marriage halls.",
    narratorText: "Uttar Pradesh aur Maharashtra mein is plan ki sabse zyada bikri hoti hai — UP mein rural families bacchon ki padhai aur shaadi ke liye, aur Maharashtra mein urban salaried class ke beech. Bihar, Bengal, aur Tamil Nadu bhi top markets mein hain.",
    textOnScreen: [
      "Uttar Pradesh: #1 in Child Education Planning (Rural)",
      "Maharashtra: Highly popular among Urban Corporate Employees",
      "Bihar & West Bengal: Traditional savers planning for daughter's marriage",
      "Tamil Nadu & Delhi: Safe savings & disciplined long-term wealth"
    ],
    icon: "Compass",
    category: "heatmap"
  },
  {
    id: 9,
    title: "Ideal Target Buyer Profiles",
    duration: 15,
    visualDescription: "Five circular avatars slide onto a rotating carousel—Parents, Salaried Workers, Rural Pros, Business owners, and pre-retirement individuals, paired with their respective core motivations.",
    narratorText: "Yeh plan har us insaan ke liye hai jo apne bacchon ka future secure karna chahta hai — ya apne liye ek safe retirement corpus banana chahta hai — bina kisi market risk ke!",
    textOnScreen: [
      "Parents planning education & marriage safety",
      "Salaried workers seeking tax reduction & stable ROI",
      "Rural savers aiming for guaranteed wealth backing",
      "Business owners needing a solid debt-free backing"
    ],
    icon: "Users2",
    category: "demographics"
  },
  {
    id: 10,
    title: "Key Takeaways Summary",
    duration: 15,
    visualDescription: "A high-impact checklist is stamped with beautiful golden checkmarks and sound effects. Key parameters are highlighted in ultra-bold text over a clean blue brand card.",
    narratorText: "LIC Jeevan Labh is extremely unique. It offers premium payment flexibility, attractive bonus yields of ₹55 per ₹1000 sum assured, dynamic loan facilities, and unparalleled national trust.",
    textOnScreen: [
      "Plan: LIC Jeevan Labh (Plan 736 - Formerly 936)",
      "Limited PPT: 10, 15, or 16 Years only",
      "Terms: 16, 21, or 25 Years of long-term buffer",
      "Bonus Rate: High Bonus of ₹55/₹1000 Sum Assured",
      "Tax Shield: Standard Section 80C exemptions"
    ],
    icon: "FileCheck",
    category: "summary"
  },
  {
    id: 11,
    title: "Call To Action",
    duration: 10,
    visualDescription: "An elegant LIC corporate branch morphs into a mobile app icon, then a friendly local LIC advisor. A golden pulsing tagline writes itself: Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi.",
    narratorText: "LIC Jeevan Labh ke saath — apne aur apni family ke sapne puri karein. Aaj hi apne LIC agent seic sampark karein!",
    textOnScreen: [
      "Secure Your Children's Dreams Today!",
      "Contact your licensed local LIC agent or visit the nearest branch",
      "'Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi'"
    ],
    icon: "PhoneCall",
    category: "cta"
  }
];

export const REGIONAL_SALES_REGIONS: SalesRegion[] = [
  {
    id: "UP",
    state: "Uttar Pradesh",
    demand: 5,
    buyer: "Rural / Semi-urban families",
    reason: "Primary focus is child education planning, wedding expenses, and safe asset backing.",
    color: "#e11d48", // Rose Red
    coordinates: { x: 50, y: 38 }
  },
  {
    id: "MH",
    state: "Maharashtra",
    demand: 5,
    buyer: "Salaried urban professionals",
    reason: "High concentration of corporate savers in Mumbai/Pune seeking stable returns, 80C tax relief, and zero-market-volatility wealth.",
    color: "#f59e0b", // Amber Gold
    coordinates: { x: 34, y: 55 }
  },
  {
    id: "TN",
    state: "Tamil Nadu",
    demand: 4,
    buyer: "Traditional risk-averse savers",
    reason: "A strong traditional market with high density of LIC state loyalty, choosing 25-yr terms for retirement corpus planning.",
    color: "#3b82f6", // Royal Blue
    coordinates: { x: 42, y: 82 }
  },
  {
    id: "WB",
    state: "West Bengal",
    demand: 4,
    buyer: "Middle-class & savings-oriented families",
    reason: "A very loyal LIC user base in Kolkata and adjacent tier-2 cities. High preference for Jeevan Labh due to limited premium cycle.",
    color: "#10b981", // Emerald
    coordinates: { x: 68, y: 46 }
  },
  {
    id: "BR",
    state: "Bihar & Jharkhand",
    demand: 4,
    buyer: "Agricultural and local trading households",
    reason: "Heavily utilized to secure long-term funds to finance ancestral marriages, farming buffer funds, and child education.",
    color: "#6366f1", // Indigo
    coordinates: { x: 60, y: 40 }
  },
  {
    id: "DL",
    state: "Delhi NCR",
    demand: 4,
    buyer: "Nuclear double-income families",
    reason: "Preferred as a secondary guaranteed retirement bucket alongside traditional volatile mutual funds and equity portfolios.",
    color: "#8b5cf6", // Purple
    coordinates: { x: 44, y: 30 }
  },
  {
    id: "RJ",
    state: "Rajasthan",
    demand: 3,
    buyer: "Farmers & Small business owners",
    reason: "Appreciated because of the Loan Facility after 2 years. Solves liquidity bottlenecks during sowing/harvesting seasons.",
    color: "#ec4899", // Pink
    coordinates: { x: 30, y: 35 }
  },
  {
    id: "MP",
    state: "Madhya Pradesh",
    demand: 3,
    buyer: "Tier-2 household earners",
    reason: "Consistent preference for the 21-yr option, serving intermediate children requirements with limited premium payment cycles.",
    color: "#14b8a6", // Teal
    coordinates: { x: 45, y: 48 }
  },
  {
    id: "KA",
    state: "Karnataka & Andhra",
    demand: 3,
    buyer: "IT engineers and young parents",
    reason: "Actively choose the 16-yr option for early kid educational targets while hedging standard corporate high-growth assets.",
    color: "#f43f5e", // Rose
    coordinates: { x: 38, y: 70 }
  },
  {
    id: "GJ",
    state: "Gujarat",
    demand: 3,
    buyer: "Business class & merchant communities",
    reason: "Valued for stable compound bonuses + guaranteed payout. Re-invested back into long-term commercial assets.",
    color: "#06b6d4", // Cyan
    coordinates: { x: 23, y: 45 }
  }
];

export const BUYER_PERSONAS: BuyerPersona[] = [
  {
    id: "bp1",
    profile: "Young Parents (Age 25-45)",
    goal: "Secure Child's Higher Education & Marriage",
    icon: "GraduationCap",
    suitability: "Highly suitable under 21-year term (pay 15 years) or 25-year term (pay 16 years). Guarantees massive lump sum money when children reach critical career ages."
  },
  {
    id: "bp2",
    profile: "Salaried Employees (Age 25-50)",
    goal: "Section 80C Tax Savings + Safe Asset Mix",
    icon: "Layers",
    suitability: "Excellent for building a secure base that is 100% insulated from mutual fund fluctuations, yielding clean, tax-exempt returns."
  },
  {
    id: "bp3",
    profile: "Rural Families & Agriculturists",
    goal: "A disciplined wealth pot & Loan backup",
    icon: "ShieldCheck",
    suitability: "Appealing because of the 10-year short premium paying options, providing safety with low commitment, and easy crop loan borrowing privileges."
  },
  {
    id: "bp4",
    profile: "Pre-Retirees (Age 45-55)",
    goal: "Create a stable retirement corpus quickly",
    icon: "Award",
    suitability: "The 16-year term (pay 10 years only) matures cleanly right at retirement age, giving peaceful capital preservation."
  }
];

export const DEFAULT_PROMPT_METADATA = {
  aspectRatio: "16:9",
  resolution: "1080p (Full HD)",
  fps: "60 FPS",
  musicGenre: "Upbeat Corporate Sitar and Acoustical Fusion",
  narratorVoice: "Warm Hinglish Male/Female Professional Duo",
  overallVibe: "Aesthetic flat infographics, bold vector assets, brand blue and gold accent tones"
};
