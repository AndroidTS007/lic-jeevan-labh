-- 1. Run this first block to add the missing columns to the existing lic_catalog table
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS maturity_benefit TEXT;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS death_benefit TEXT;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS best_for TEXT;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS premium_modes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS loan_facility TEXT;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS tax_benefits TEXT;

ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS payout TEXT;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS eligibility TEXT;
ALTER TABLE lic_catalog ADD COLUMN IF NOT EXISTS key_benefit TEXT;

-- 2. Run this second block to update details for all 45 catalog products based on their actual database IDs

-- ----------------------------------------------------
-- Flagship & Endowment Plans
-- ----------------------------------------------------
UPDATE lic_catalog SET
  maturity_benefit = 'Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus (if any)',
  death_benefit = 'After risk commencement: Sum Assured + accrued bonuses. Before commencement: refund of single premium (excl. taxes)',
  best_for = 'Lump-sum savers wanting risk cover and profit-sharing without recurring payment worries',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'Available after completing one policy year; surrender value available from year one',
  tax_benefits = 'Premium eligible for Sec 80C; maturity and death proceeds tax-free under Sec 10(10D)'
WHERE id = 'single_premium_endowment';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + Vested Bonuses + Final Additional Bonus (if any) paid as lump sum',
  death_benefit = 'Higher of (Sum Assured + bonuses), OR 7x annualised premium, OR 105% of all premiums paid to date',
  best_for = 'Long-term goal planning like children''s education, marriage, or retirement corpus building',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly (ECS)"]'::jsonb,
  loan_facility = 'Available after payment of at least 1 full year''s premium',
  tax_benefits = 'Premium deduction under Sec 80C; benefits tax-exempt under Sec 10(10D)'
WHERE id = 'new_endowment_plan';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus at end of term',
  death_benefit = 'During term: Higher of Sum Assured on Death + bonuses, OR 7x annualised premium, OR 105% of premiums. Post-maturity: Basic Sum Assured paid on death',
  best_for = 'Breadwinners seeking a combination of lump sum savings on survival and permanent heritage protection',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly (ECS)"]'::jsonb,
  loan_facility = 'Available after paying 3 full years'' premiums; policy can be surrendered after 3 years',
  tax_benefits = 'Deductions under Sec 80C on premiums; Sec 10(10D) exemption on proceeds'
WHERE id = 'new_jeevan_anand';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + accrued Simple Reversionary Bonuses + Final Additional Bonus',
  death_benefit = 'Annual income (10% of SA) paid till maturity date + Sum Assured on maturity + vested bonuses at maturity date',
  best_for = 'Parents who want to guarantee annual school/college funding and a final lump-sum for kids even in their absence',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after at least 2 full years'' premiums paid',
  tax_benefits = 'Premium deduction under Sec 80C; maturity/death benefits exempt under Sec 10(10D)'
WHERE id = 'jeevan_lakshya';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus at end of policy term',
  death_benefit = 'Higher of Sum Assured on Death (7x annual premium or SA), OR 105% of all premiums paid - plus accrued bonuses',
  best_for = 'Investors seeking high guaranteed yields and shorter pay cycles for key major life milestones',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after at least 2 full years'' premiums paid',
  tax_benefits = 'Sec 80C on premium savings; Sec 10(10D) tax exemptions on maturity'
WHERE id = 'jeevan_labh_plan';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + Accumulated Guaranteed Additions',
  death_benefit = 'Sum Assured + Accumulated Guaranteed Additions paid to child''s nominee/guardian on death',
  best_for = 'Parents and grandparents planning child higher education or career start capital',
  premium_modes = '["Single", "Limited Pay (Yearly, Half-yearly, Quarterly, Monthly)"]'::jsonb,
  loan_facility = 'Available after policy acquires surrender value (typically after 2 years)',
  tax_benefits = 'Premiums deductible under Sec 80C; maturity proceeds exempt under Sec 10(10D)'
WHERE id = 'amritbaal';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + Total Guaranteed Additions accumulated over full policy term',
  death_benefit = 'Sum Assured on Death (higher of 10x annual premium or SA) + Accrued Guaranteed Additions',
  best_for = 'Conservative savers seeking fixed, guaranteed returns with zero market volatility',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly (ECS)"]'::jsonb,
  loan_facility = 'Available after at least 2 full years'' premiums paid',
  tax_benefits = 'Sec 80C on premiums; Sec 10(10D) on maturity and death proceeds'
WHERE id = 'bima_jyoti';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + total accrued Guaranteed Additions at end of term',
  death_benefit = 'Sum Assured + Guaranteed Additions accrued to date of death',
  best_for = 'Individuals wanting guaranteed, inflation-proof savings for a 25-year horizon',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available once policy acquires surrender value',
  tax_benefits = 'Sec 80C on premium payments; Sec 10(10D) on maturity/death proceeds'
WHERE id = 'nav_jeevan_shree';

UPDATE lic_catalog SET
  maturity_benefit = 'Lump sum maturity benefit paid at end of term = SA + all accrued Guaranteed Additions + survival benefit balance',
  death_benefit = 'Sum Assured on Death + Accrued Guaranteed Additions paid to nominee',
  best_for = 'Women seeking guaranteed savings with periodic cash flows and specialized health critical riders',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available once policy acquires surrender value',
  tax_benefits = 'Sec 80C on premiums; Sec 10(10D) on maturity and death proceeds'
WHERE id = 'bima_lakshmi';

UPDATE lic_catalog SET
  maturity_benefit = 'Sum Assured + all accrued Guaranteed Additions paid if both spouses survive to maturity',
  death_benefit = 'First Death: Sum Assured + accrued GAs paid, policy continues with premium waiver. Second Death: Sum Assured + accrued GAs paid again',
  best_for = 'Couples wanting joint safety and dual protection payouts from a single, one-time investment',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'Available after policy acquires surrender value (post 1 year)',
  tax_benefits = 'Sec 80C deduction on single premium; tax-exempt maturity under Sec 10(10D)'
WHERE id = 'new_jeevan_sathi_single';

UPDATE lic_catalog SET
  maturity_benefit = 'Sum Assured + total accrued Guaranteed Additions paid in a lump sum on survival',
  death_benefit = 'First Death: Sum Assured + GAs paid, future premium burden is waived. Second Death: Full Sum Assured + GAs paid to nominee',
  best_for = 'Married couples wanting joint life security with spread-out limited premium structures',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after minimum required premiums paid and surrender value is acquired',
  tax_benefits = 'Sec 80C deductions; Sec 10(10D) tax exemptions on all death and maturity proceeds'
WHERE id = 'new_jeevan_sathi_limited';

-- ----------------------------------------------------
-- Whole Life Plans
-- ----------------------------------------------------
UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured on Maturity + Vested Simple Reversionary Bonuses + Final Additional Bonus at age 100',
  death_benefit = 'Higher of 10x annual premium or Basic SA + accrued bonuses; paid on death anytime during the policy',
  best_for = 'Retirement pension planning, legacy wealth creation, and lifelong income security',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after completing at least 2 years of premium payments',
  tax_benefits = 'Sec 80C on premium; Sec 10(10D) on all annual payouts, death, and maturity claims'
WHERE id = 'jeevan_umang';

UPDATE lic_catalog SET
  maturity_benefit = 'Sum Assured + Total Accrued Guaranteed Additions (payable at age 100)',
  death_benefit = 'Sum Assured on Death + Accrued Guaranteed Additions paid as lump sum or instalments',
  best_for = 'Salaried workers seeking a guaranteed annual pension with a short premium paying commitment',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after completing 1 year of premium payments',
  tax_benefits = 'Premium deductible under 80C; tax-free guaranteed income and death benefits under 10(10D)'
WHERE id = 'jeevan_utsav';

UPDATE lic_catalog SET
  maturity_benefit = 'Sum Assured + all accrued Guaranteed Additions at age 100',
  death_benefit = 'Sum Assured + Accrued Guaranteed Additions paid to nominee',
  best_for = 'NRIs, windfall recipients, or business owners wanting to park lump sums for lifelong guaranteed income',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'Available after 1 policy year from date of commencement',
  tax_benefits = 'Deduction on premium under Sec 80C; proceeds exempt under Sec 10(10D)'
WHERE id = 'jeevan_utsav_single';

-- ----------------------------------------------------
-- Money Back Plans
-- ----------------------------------------------------
UPDATE lic_catalog SET
  maturity_benefit = 'Remaining sum assured + Vested Simple Reversionary Bonuses + Final Additional Bonus at term end',
  death_benefit = 'Full Sum Assured + accrued bonuses paid without deducting money-back cashbacks already paid',
  best_for = 'High-value investors desiring structural liquidity intervals alongside wealth creation',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after paying 2 full years'' premiums',
  tax_benefits = 'Sec 80C deductions; Sec 10(10D) tax exemption on all payouts'
WHERE id = 'bima_shree';

UPDATE lic_catalog SET
  maturity_benefit = '40% of Basic SA + Vested Bonuses + Final Additional Bonus at year 20',
  death_benefit = 'Full Sum Assured + accrued bonuses paid to nominee (no deduction of survival benefits already paid)',
  best_for = 'Savers needing liquidity every 5 years for business cycles, household goals, or vehicle purchases',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after completing 3 full years'' premium payments',
  tax_benefits = 'Premium deduction under 80C; survival and death claims tax-free under 10(10D)'
WHERE id = 'new_money_back_20_years';

UPDATE lic_catalog SET
  maturity_benefit = '40% of Basic SA + Vested Simple Reversionary Bonuses + Final Additional Bonus at year 25',
  death_benefit = 'Full Sum Assured + accrued bonuses paid to nominee (no deduction of money-back cashbacks)',
  best_for = 'Individuals wanting a longer 25-year life cover while accessing regular cash-ins at 5-year intervals',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after pay of 3 full years'' premiums',
  tax_benefits = 'Deductions under Sec 80C; survival cash and maturity exempt under Sec 10(10D)'
WHERE id = 'new_money_back_25_years';

UPDATE lic_catalog SET
  maturity_benefit = 'Remaining 40% of Basic SA + accrued bonuses paid at child''s age 25',
  death_benefit = 'Full Sum Assured + accrued bonuses paid to child''s nominee (if death happens during term)',
  best_for = 'Parents who want to guarantee milestones like higher education and wedding fees without stressing household liquidity',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly (ECS)"]'::jsonb,
  loan_facility = 'Available after policy secures surrender value (usually post 2 full premium years)',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax exemptions on all payouts'
WHERE id = 'new_childrens_money_back';

UPDATE lic_catalog SET
  maturity_benefit = 'Maturity payout paid when the child reaches age 25 (includes remaining Sum Assured + bonuses)',
  death_benefit = 'Full Sum Assured + accrued bonuses paid to child''s guardian, premiums waived',
  best_for = 'Parents wishing to secure targeted child milestone funds with customized payouts options',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after completing 2 policy years',
  tax_benefits = 'Sec 80C premium deductions; Sec 10(10D) tax-exempt proceeds'
WHERE id = 'jeevan_tarun';

-- ----------------------------------------------------
-- Term Insurance Plans
-- ----------------------------------------------------
UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Pure protection cover)',
  death_benefit = 'Chosen sum assured paid as a lump sum to nominee on death during the policy term',
  best_for = 'Tech-savvy individuals seeking convenient online-only life protection with lower premium rates',
  premium_modes = '["Yearly", "Half-yearly"]'::jsonb,
  loan_facility = 'NIL (No loans available on pure term)',
  tax_benefits = 'Premiums deductible under Sec 80C; death proceeds tax-exempt under Sec 10(10D)'
WHERE id = 'digi_term';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Pure credit protection cover)',
  death_benefit = 'Decreasing sum assured specifically designed to clear outstanding loan liability upon policyholder''s death',
  best_for = 'Borrowers seeking to insulate their families from debt burdens in case of sudden death',
  premium_modes = '["Single", "Limited Pay"]'::jsonb,
  loan_facility = 'NIL (No loans available)',
  tax_benefits = 'Premiums deductible under Sec 80C; death benefits exempt under Sec 10(10D)'
WHERE id = 'digi_credit_life';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Pure credit protection cover)',
  death_benefit = 'Decreasing loan-linked protection cover; clears outstanding loan liability on death',
  best_for = 'Young professionals seeking cheap credit protection for mortgage, auto, or educational loans',
  premium_modes = '["Single", "Limited Pay"]'::jsonb,
  loan_facility = 'NIL (No loan facility)',
  tax_benefits = 'Premiums deductible under Sec 80C; benefits tax-exempt under Sec 10(10D)'
WHERE id = 'yuva_credit_life';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Pure protection cover)',
  death_benefit = 'Full sum assured paid to nominee on death during the policy term',
  best_for = 'Young wage earners wanting high protective cover at low cost with local agent guidance',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL (No loans available on pure term)',
  tax_benefits = 'Premiums qualify for Sec 80C; death benefit exempt under Sec 10(10D)'
WHERE id = 'yuva_term';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Pure protection cover)',
  death_benefit = 'Chosen sum assured paid to nominee (lump sum, monthly instalments, or combination)',
  best_for = 'Tech-savvy individuals seeking high protection umbrellas with flexible premium schedules',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL (No loan facility)',
  tax_benefits = 'Sec 80C tax rebates on premium; 100% tax-free death claim under Sec 10(10D)'
WHERE id = 'new_tech_term';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL',
  death_benefit = 'Level or Increasing Sum Assured paid as lump sum or monthly instalments to nominee',
  best_for = 'Individuals wanting maximum cover with personalized LIC agent support and physical paperwork',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax-exempt proceeds'
WHERE id = 'new_jeevan_amar';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL',
  death_benefit = 'Basic Sum Assured paid as a lump sum to nominee upon death',
  best_for = 'First-time buyers or low-income households wanting standard, hassle-free life protection',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL',
  tax_benefits = 'Deductions under Sec 80C; death claims tax-exempt under Sec 10(10D)'
WHERE id = 'saral_jeevan_bima';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL',
  death_benefit = 'Sum Assured (level or increased by event options) paid as claim to nominee',
  best_for = 'Young adults who want their life protection to automatically expand with milestone responsibilities',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL',
  tax_benefits = 'Sec 80C premium deductions; Sec 10(10D) tax-exempt death payouts'
WHERE id = 'bima_kavach';

-- ----------------------------------------------------
-- Riders (Supplemental Riders)
-- ----------------------------------------------------
UPDATE lic_catalog SET
  purpose = 'Provides additional lump sum sum assured if death occurs specifically due to an accident',
  payout = 'Rider Sum Assured paid in addition to the base policy''s standard death benefit',
  eligibility = 'Age 18 to 70; attachable to most endowment, money back, and whole life policies',
  key_benefit = 'Provides highly cost-effective supplementary accidental death protection'
WHERE id = 'accident_benefit_rider';

UPDATE lic_catalog SET
  purpose = 'Waives all future base policy premiums if the proposer/parent becomes permanently disabled or dies',
  payout = 'Policy continues in full force with premium paid by LIC; benefits remain fully intact',
  eligibility = 'Age 18 to 55; crucial for child protection plans (Jeevan Tarun, Children Money Back)',
  key_benefit = 'Guarantees that child savings goals are completed even on parent''s demise'
WHERE id = 'premium_waiver_benefit_rider';

UPDATE lic_catalog SET
  purpose = 'Pays extra sum on accidental death AND covers total permanent disability from accidents',
  payout = 'Death: Rider SA lump sum. Disability: Rider SA paid as equal monthly instalments over 10 years + future premiums waived',
  eligibility = 'Age 18 to 65 (cover till age 70); maximum rider SA of ₹1 Crore',
  key_benefit = 'Comprehensive accident shield providing income support and premium waivers'
WHERE id = 'accidental_death_disability_rider';

UPDATE lic_catalog SET
  purpose = 'Adds a layer of pure protection term cover on top of the base plan''s standard death benefit',
  payout = 'Nominee receives both base Sum Assured and Rider Sum Assured on death, doubling protection',
  eligibility = 'Age 18+; attachable ONLY at inception of endowment or money-back plans',
  key_benefit = 'Very cost-effective way to heavily boost death coverage without a separate standalone policy'
WHERE id = 'new_term_assurance_rider';

UPDATE lic_catalog SET
  purpose = 'Adds accidental death protection exclusively to Unit Linked Insurance Plans (ULIPs)',
  payout = 'Rider Sum Assured paid in addition to the ULIP fund value on accidental death',
  eligibility = 'Depends on underlying ULIP base plan; premium deducted from ULIP premiums',
  key_benefit = 'Accidental protection tailored specifically for market-linked savers'
WHERE id = 'linked_accidental_death_rider';

UPDATE lic_catalog SET
  purpose = 'Pays a lump sum upon first diagnosis of any of the covered 15 major critical illnesses',
  payout = 'Diagnosis-based lump sum payout; reduces the base sum assured proportionally, policy continues',
  eligibility = 'Age 18 to 65 (terminates at 75); attachable to most regular-premium endowment & whole life plans',
  key_benefit = 'Financial cushion for major health crises (cancer, heart attack, stroke, kidney failure)'
WHERE id = 'critical_illness_health_rider';

UPDATE lic_catalog SET
  purpose = 'Specialized critical illness rider exclusively for female policyholders, covering women-specific risks',
  payout = 'Lump sum paid on first diagnosis of covered female-specific conditions (breast, ovarian, cervical cancer, etc.)',
  eligibility = 'Age 18 to 65; designed to be paired with LIC''s Bima Lakshmi Plan 881',
  key_benefit = 'Gender-specific health protection addressing critical risks not covered in standard health riders'
WHERE id = 'female_critical_illness_rider';

-- ----------------------------------------------------
-- Pension Plans
-- ----------------------------------------------------
UPDATE lic_catalog SET
  maturity_benefit = 'Unit Fund Value at vesting (pension start). Annuitant can withdraw up to 60% as tax-free cash and purchase annuity with the rest.',
  death_benefit = 'Higher of the Unit Fund Value or 105% of the total premiums paid to date.',
  best_for = 'Salaried or self-employed individuals looking to build a flexible retirement corpus through market-linked funds.',
  premium_modes = '["Single", "Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL (Partial withdrawals allowed up to 25% of fund value after 5-year lock-in period)',
  tax_benefits = 'Premiums eligible for tax deductions under Section 80CCC.'
WHERE id = 'new_pension_plus';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Immediate annuity pension payout continues for life)',
  death_benefit = 'Depends on the selected option; Options F & J return 100% of the Purchase Price to the nominee.',
  best_for = 'Retirees looking for instant, guaranteed lifelong regular pension payouts with zero market risks.',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'Available after 3 months (restricted to options with Return of Purchase Price)',
  tax_benefits = 'Purchase price eligible for Sec 80CCC; annuity pension payout is fully taxable under slab rates.'
WHERE id = 'jeevan_akshay_vii';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Deferred annuity starts regular pension payout after selected deferment period of 1 to 12 years)',
  death_benefit = 'Purchase Price + Accrued Guaranteed Additions minus annuity payments already made (if any) paid to nominee.',
  best_for = 'Professionals aged 30-79 planning early retirement, wishing to lock in high pension yields in advance.',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'Available after 3 months from policy inception',
  tax_benefits = 'Sec 80CCC deduction on single investment; pension received is taxable.'
WHERE id = 'new_jeevan_shanti';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Immediate standard lifelong pension payouts)',
  death_benefit = '100% of the Purchase Price is returned to the nominee upon death of the annuitant(s).',
  best_for = 'Individuals seeking a simple, standardized, no-frills immediate annuity plan approved by IRDAI.',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'Available after 6 months from policy commencement',
  tax_benefits = 'Sec 80CCC premium benefits; pension received is taxable.'
WHERE id = 'saral_pension';

UPDATE lic_catalog SET
  maturity_benefit = 'NIL (Immediate life pension payouts)',
  death_benefit = 'Nominee receives purchase price or accumulated pension value based on selected payout options.',
  best_for = 'Retirees looking for flexible immediate annuity configurations and higher returns.',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'Available after 3 months (on options with Return of Purchase Price)',
  tax_benefits = 'Sec 80CCC premium deductions; pension received is taxable.'
WHERE id = 'smart_pension';

-- ----------------------------------------------------
-- Unit Linked Plans (ULIPs)
-- ----------------------------------------------------
UPDATE lic_catalog SET
  maturity_benefit = 'Unit Fund Value at the end of the policy term.',
  death_benefit = 'Higher of basic Sum Assured or Unit Fund Value.',
  best_for = 'Aggressive investors wanting equity market growth index tracking with a life insurance cover.',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL (Partial withdrawals allowed after 5-year lock-in)',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax-exempt proceeds (subject to annual premium under ₹2.5 Lakhs).'
WHERE id = 'index_plus';

UPDATE lic_catalog SET
  maturity_benefit = 'Unit Fund Value at the end of the term.',
  death_benefit = 'Higher of basic Sum Assured or Unit Fund Value.',
  best_for = 'Lump-sum savers wanting single premium convenience along with high market-linked returns.',
  premium_modes = '["Single"]'::jsonb,
  loan_facility = 'NIL (Partial withdrawals allowed after 5 years)',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax exemptions on maturity.'
WHERE id = 'nivesh_plus';

UPDATE lic_catalog SET
  maturity_benefit = 'Unit Fund Value + Refund of total mortality charges deducted during the policy term.',
  death_benefit = 'Higher of basic Sum Assured or Unit Fund Value.',
  best_for = 'Salaried individuals looking for systematic long-term wealth creation with cost refunds.',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL (Partial withdrawals allowed after 5 years)',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax-free maturity.'
WHERE id = 'siip';

UPDATE lic_catalog SET
  maturity_benefit = 'Unit Fund Value at the end of the term + Refund of all mortality charges.',
  death_benefit = 'Highest of Basic Sum Assured (minus withdrawals), Base Premium Fund Value, or 105% of premiums paid.',
  best_for = 'HNIs seeking high cover and wealth creation combo with mortality fee protection.',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'NIL (Partial withdrawals allowed after 5 years)',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax-free proceeds.'
WHERE id = 'protection_plus';

-- ----------------------------------------------------
-- Micro Insurance Plans
-- ----------------------------------------------------
UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + Loyalty Additions (if any) paid at maturity.',
  death_benefit = 'Basic Sum Assured on Death + Loyalty Additions (if any) paid to nominee.',
  best_for = 'Low-income households and micro-savers seeking capital protection and life cover at minimal cost.',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after payment of at least 3 full years'' premiums',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax exemptions.'
WHERE id = 'micro_bachat';

UPDATE lic_catalog SET
  maturity_benefit = 'Basic Sum Assured + Guaranteed Additions accrued over the term.',
  death_benefit = 'Basic Sum Assured on Death + accrued Guaranteed Additions.',
  best_for = 'First-time buyers looking for simple micro-savings and a life protection umbrella.',
  premium_modes = '["Yearly", "Half-yearly", "Quarterly", "Monthly"]'::jsonb,
  loan_facility = 'Available after payment of at least 1 full year''s premium',
  tax_benefits = 'Sec 80C premium benefits; Sec 10(10D) tax exemptions.'
WHERE id = 'jan_suraksha';
