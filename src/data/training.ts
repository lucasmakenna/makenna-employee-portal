import { TrainingStation } from '@/types';

/**
 * Makenna Koffee training curriculum — 11 sections.
 *
 * Sourced from the "Brain Blend" Employee Training & Onboarding Plan v1.1
 * (May 2026). Competency criteria match the Training Checklist Completion
 * table (page 75) and the Food Handler checkbox table — NOT bullet points.
 *
 * Section → Brain Blend day mapping:
 *   0.  Before Day 1 — Pre-Boarding
 *   1.  Compliance & Culture          (Day 1)
 *   2.  Food Safety & POS             (Day 2)
 *   3.  Barista Basics I              (Days 3–4)
 *   4.  Barista Basics II             (Days 5–6)
 *   5.  Opening Operations & Service  (Day 7)
 *   6.  Beginner Barista Bar Routine   (Day 8)
 *   7.  Peak Prep & Rush Hour         (Day 9)
 *   8.  Closing Operations            (Day 10)
 *   9.  Supervised Practice           (Days 11–13)
 *   10. Final Review & Sign-Off       (Day 14)
 */

export const STATIONS: TrainingStation[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'pre-boarding',
    name: 'Before Day 1',
    description: "Section 0 — Pre-boarding tasks completed by the Store Manager before the new hire's first day.",
    order: 0,
    contentVersion: 2,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'pb-1',
        name: 'Add to timekeeping & scheduling system',
        description: 'Add New Hire to the timekeeping and scheduling system immediately.',
        estimatedMinutes: 5,
        competencyCriteria: ['New Hire added to timekeeping and scheduling system'],
      },
      {
        id: 'pb-2',
        name: 'Availability entered — training shifts scheduled',
        description: 'Instruct New Hire to input their availability so training shifts can be scheduled. Notify them once added.',
        estimatedMinutes: 5,
        competencyCriteria: ['Availability entered in scheduling system; training shifts scheduled and communicated to New Hire'],
      },
      {
        id: 'pb-3',
        name: 'Dress code policy sent',
        description: 'Provide dress code policy and notify New Hire that company-issued Makenna shirts will be provided on Day 1.',
        estimatedMinutes: 5,
        competencyCriteria: ['Dress code policy provided (Makenna_DressCode.pdf); New Hire notified shirts are provided on Day 1'],
      },
      {
        id: 'pb-4',
        name: 'I-9 eligibility documents requested',
        description: 'Require New Hire to bring 2 work eligibility documents on Day 1 (e.g., passport + Social Security card — see Form I-9 page 2 for all options).',
        estimatedMinutes: 5,
        competencyCriteria: ['New Hire notified to bring 2 eligibility documents on Day 1 (per Form I-9 page 2)'],
      },
      {
        id: 'pb-5',
        name: 'Work permit collected (if under 18)',
        description: 'If New Hire is under 18, require a school work permit before the first shift.',
        estimatedMinutes: 5,
        competencyCriteria: ['Work permit on file — OR — confirmed New Hire is 18 or older (N/A)'],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'compliance-culture',
    name: 'Compliance & Culture',
    description: 'Section 1 (Day 1) — Compliance paperwork, food handler enrollment, handbook & labor law, harassment training, Makenna culture, and Aspects of Success.',
    order: 1,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'cc-compliance',
        name: '1.1 & 1.3 — Compliance Paperwork, Handbook & NDA',
        description: 'Complete all Day 1 paperwork, confirm handbook read, sign NDA, review dress code, and issue uniform.',
        estimatedMinutes: 65,
        steps: [
          'Employee Profile Form in Homebase — CRITICAL: do NOT select "use cash out."',
          'W-4 Federal Tax Withholding — complete and file.',
          'I-9 — verify 2 acceptable eligibility documents (see I-9 page 2); retain copies.',
          'Employee Handbook Acknowledgment — signed and filed.',
          'Harassment Policy Review & Signature — signed and filed.',
          'Work permit — collect and file if under 18; mark N/A if 18+.',
          'Manager scans all originals into Homebase and files in binder.',
          'Confirm New Hire has read the Employee Handbook; answer any questions.',
          'Review and sign the Makenna NDA (Makenna Nondisclosure Agreement.pdf); file in Homebase.',
          'Review dress code: footwear, headwear, jewelry standards acknowledged.',
          'Issue 2 shirts + 1 hoodie/sweater; use Employee on-clock discount to mark out at $0.',
        ],
        competencyCriteria: [
          'All Day 1 compliance documents completed and filed (Profile Form, W-4, I-9, Handbook Acknowledgment, Harassment Policy, NDA); dress code reviewed; uniform issued',
        ],
      },
      {
        id: 'cc-food-handler',
        name: '1.2 — Food Handler Certification',
        description: 'Enroll New Hire in California Food Handler (ServSafe) on Day 1. Card must be filed within 30 days.',
        estimatedMinutes: 10,
        steps: [
          'Provide ServSafe link and enroll New Hire on Day 1.',
          'Confirm 1 hour of paid time allocated for the course.',
          'Set 30-day reminder — Manager prints and files certificate when complete.',
          'Card is valid for 3 years; must be maintained throughout employment.',
        ],
        competencyCriteria: [
          'Enrolled in California Food Handler course Day 1; ServSafe link provided; 1 hr paid time confirmed',
          'California Food Handler Card filed within 30 days of hire',
        ],
      },
      {
        id: 'cc-labor-culture',
        name: '1.3–1.4 — CA Labor Law, Harassment, Culture & Day 1 Review',
        description: 'Cover CA labor law (clocking, breaks, OT, scheduling), harassment training, Makenna culture, all 6 Aspects of Success, and Day 1 end-of-day review.',
        estimatedMinutes: 200,
        steps: [
          'Clocking: demonstrate clock-in/out and meal break clock-out. No work off the clock — ever. Missed punches reported same day.',
          'Overtime: 1.5x triggers (8 hrs/day, 40 hrs/week, 7th day first 8 hrs); 2x triggers (12 hrs/day, 8 hrs on 7th day). 10-hr rest standard between shifts.',
          'Rest breaks: tiers (0/1/2/3 based on hours). Cannot be waived. Do NOT clock out for 10-min breaks.',
          'Meal break: must start before end of 5th hour. Clock out for 30-min break. Attestation form filled every shift accurately.',
          'Meal Period Waiver: only on shifts 6 hrs or less, 100% voluntary. If "no meal" shift extends past 6 hrs, take break immediately.',
          'Illness: 5 mandatory reporting conditions. Call Manager before the shift.',
          'Scheduling app: log in, enter availability, understand time-off requests vs. availability.',
          'Attendance: 2-hr minimum call-out notice; opening shifts call Store Manager cell directly.',
          'Benefits: on-clock drinks (1 before, 1 per break, 1 after — ring with label); 50% off-clock discount.',
          'Define harassment (unwelcome behavior tied to a protected category) with real-world examples.',
          'Define bullying and retaliation — illegal under CA FEHA; its own violation.',
          'Reporting paths: (1) Shift Lead/Kona Lead/Manager; (2) different Manager if issue involves Store Manager; (3) mafiasupport@makennakoffee.com; (4) Workplace Concern Form (QR code).',
          'Customer harassment: step off bar immediately, tell Shift Lead or Manager. Document before end of shift.',
          'Assign and complete CA Harassment Training (Baristas: 1 hr; Managers/Shift Leads: 2 hrs). Save/print certificate.',
          'Company history: established 2019, Simi Valley CA, Hawaiian-themed.',
          'Watch Customer Service video; discuss key takeaways.',
          'All 6 Aspects of Success (give pocket card): Customer Service, Consistent Quality Product, Proactive Ownership, Immaculate Environment, Accountability & Reliability, Vibes.',
          'Provide study materials: store menu, training menu guide, POS Essentials card, Aspects/Register Protocol pocket card.',
          'Day 1 End-of-Day Review — at least 5 of 7 correct: call-out notice, opening shift contact, meal break rule, rest break waiver, Aspects of Success, on-clock drink benefit, split shift approval.',
        ],
        competencyCriteria: [
          'CA Labor Law: clocking/breaks/OT rules understood; CA Harassment Training completed and certificate filed; all 6 Aspects of Success named from memory; Day 1 review passed (5 of 7)',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'food-safety-pos',
    name: 'Food Safety & POS',
    description: 'Section 2 (Day 2) — Temperature logs, 3-compartment sink, sanitizer, allergen control, FIFO, breakfast items, employee health, and Square POS operations.',
    order: 2,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'fs-food-safety',
        name: '2.1 — Food Safety: Temps, 3-Sink, Sanitizer, Allergens & FIFO',
        description: 'Cold-hold at 41F, 3-comp sink procedure, sanitizer prep, allergen awareness, FIFO, and breakfast item thaw protocol.',
        estimatedMinutes: 75,
        steps: [
          'Temperature: cold hold must be 41F or below. Never leave milk/dairy out longer than 1 hour cumulative.',
          '3-Comp Sink (4 steps): Rinse residue off first → Wash (hot soapy water) → Rinse (clean water) → Sanitize → Air-dry only, never towel-dry.',
          'Sanitizer: target 100 ppm with Clorox (acceptable 50–200 ppm). New Hire prepares a bucket and verifies with test strip.',
          'RED bucket (counter): fill to line 2, 1 rag. WHITE bucket (steam wand): fill to line 1, 1 rag. Replace every 2 hours or when cloudy/greasy.',
          'Allergens at Makenna: Milk, Eggs, Wheat, Soy, Peanut butter. Not nut-free or gluten-free facility.',
          'Use dedicated blue/marked blender cup for allergen-sensitive orders.',
          'FIFO: new product placed behind older product on all perishables.',
          'Sandwich thaw: 12-hr thaw, pull 4–6 PM daily. Burrito thaw: 24-hr thaw, pull 6:30–8 AM daily.',
        ],
        competencyCriteria: [
          '3-sink/sanitizer proficiency achieved; all allergens named; FIFO demonstrated',
        ],
      },
      {
        id: 'fs-pos',
        name: '2.2 — POS, Register Greeting & Customer Service',
        description: '5-step register greeting, menu knowledge, POS payments, voids, cash handling, and complaint role-play.',
        estimatedMinutes: 105,
        steps: [
          'Greeting (5 steps in order): (1) Warm greeting; (2) Ask about well-being; (3) Initiate transaction; (4) Personal connection; (5) Warm conclusion.',
          'Menu categories: Supreme, Chillers, Cold Brew, Americano, Freeze, Energy, Shaken Espresso, Smoothies, Soda, Chai/Tea.',
          'Shot counts: S=1, M=2, L=2+1 free optional, XL=4. Americano/Shaken: S=2, M=3, L=4+1 free, XL=6.',
          'Maui Milk: secret recipe, dairy-based (most critical for allergy). Never reveal ingredients.',
          'Payments: tap/insert/swipe. Apply forced modifiers before completing order.',
          'Cash: keep large bills out until change is handed. Spot counterfeit bills.',
          'Voids: all voids require Manager or Shift Lead approval. Over/short threshold is plus or minus $5.',
          'Complaint role-play: Listen → Apologize → Remake → Ensure they are happy.',
          'Day 2 End-of-Day Review — at least 7 of 9 correct: 3-comp sink steps, sanitizer ppm, FIFO, allergens, 5-step greeting, Supreme and Maui Milk definitions.',
        ],
        competencyCriteria: [
          '5-step register greeting delivered; voids/refunds procedure reviewed and demonstrated; Day 2 review passed (7 of 9)',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'barista-basics-1',
    name: 'Barista Basics I',
    description: 'Section 3 (Days 3–4) — Station setup, specialty product prep, food heating, expo, cleaning, coffee theory, espresso execution, iced/blended/hot drinks, energy drinks, and milk steaming.',
    order: 3,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'bb1-station-prep',
        name: '3.1 — Station Setup, Prep & Brewing',
        description: 'Station setup from scratch, food heating and expo, Kona Cloud, Maui Milk, Cold Brew, drip, teas, and energy slushy.',
        estimatedMinutes: 160,
        steps: [
          'Ice: bucket labeled "ICE," not cracked. Any ice on the floor pushed to drain — slip hazard.',
          'Cups/lids: locate sizes, stock correctly, never touch mouth opening.',
          '3-comp sink reset, pastry case FIFO, syrups, beans.',
          'Ovens: remove promptly or item burns. Pastry bags for most pastries. Burritos: parchment paper, press "Single Burrito" preset.',
          "Expo: tap off each item on the expo screen as it\'s completed. Gather ALL items before calling order name.",
          'Sticker stoppers on pick-up drink lids. Lobby check: wipe tables, check condiment area, check restroom.',
          'Kona Cloud: squeeze-test cartons, shake until liquidy, Use By Date = 2 weeks from made date, refrigerate.',
          'Maui Milk Toddy: syrup first then can, FIFO exception (back of line for half-and-half), Use By Date = H&H expiration.',
          'Cold Brew: coarse grind, filter bag, fill with drinking water (1-inch room at top), Ready By Date = current time + 14 hrs, leave at room temp. Use By Date = 5 days.',
          "Drip: select correct grinder side (Yellow = Drippin\' / Pink = Kona Blend), grind, press Large or Medium and hold until machine locks.",
          'Green tea: 8 bags, brew on Large. Black tea: 1 bag, brew on Large. Hibiscus: ice first, 1.5 scoops, brew on Medium. All: Use By Date = 2 days.',
          'Energy slushy: 14 cans pitcher 1, dissolve 12 oz sugar in 24 oz hot water pitcher 2, add 32 oz cold water, tom-tom both pitchers until uniform color. Use By Date = 7 days.',
        ],
        competencyCriteria: [
          'Station set up without prompting; all prep items made correctly (Kona Cloud, Maui Milk, Cold Brew, teas, slushy mix)',
        ],
      },
      {
        id: 'bb1-espresso-drinks',
        name: '3.2 & Day 4 — Espresso Execution, Iced Supremes, Chillers & Energy Drinks',
        description: 'Grind, dose, tamp, pull espresso. Build iced Supremes, Blended Chillers, and Makenna Energy drinks.',
        estimatedMinutes: 150,
        steps: [
          'Grinder: rotate hopper clockwise. Knock out old grounds, wipe with dedicated dry rag.',
          'Place portafilter in scale at slight forward angle, let go. Do NOT touch during grinding. Target dose: 16–18g.',
          'Tamp: apply even pressure, clear stray grounds from rim/handle.',
          'Flush group head (whirlpool button, 1 second). Align portafilter, twist to lock.',
          'Pull double shot. Target time: 10–15 sec. Under 9 sec = adjust finer. Over 18 sec = adjust coarser. Dead shot (crema gone) = discard immediately.',
          'Iced order of ops: flavors → espresso → whisk (if powder/sauce) → H&H or Maui Milk → milk to fill-to → pour over ice → TOM-TOM → drizzle.',
          'Chiller order of ops: blender — heaping ice → powders → sauces. Measuring cup — syrups → espresso → milk. Pour measuring cup into blender, blend on #4.',
          'Energy (iced, M/L/XL only): flavor → 1 can (M), 1.5 cans (L), 2 cans (XL) → ice top-off. Milk + carbonated: pour slow, NO TOM-TOM.',
          'Energy (slushy): flavor amounts are HALF the iced version. Mix to uniform color.',
        ],
        competencyCriteria: [
          'Espresso shot time consistently 10–15 sec; iced Supreme, Chiller, and energy drink built correctly',
        ],
      },
      {
        id: 'bb1-milk-steaming',
        name: '3.3 — Milk Steaming, Hot Supremes & Day 3–4 Review',
        description: 'Pitcher selection, wand position, air intro, temperature targets, latte vs. cappuccino, hot Supremes, cold brew drinks, and Day 3–4 end-of-day review.',
        estimatedMinutes: 70,
        steps: [
          'Pitcher size: smallest = cortado/steamed milk; medium = S or M hot drink; large = L hot drink.',
          'Wand prep: white sanitizing bucket under wand, wipe, purge into drain grill, pull forward.',
          'Air intro: tip just below milk surface, "tsch tsch" paper-ripping sound = correct. Latte: ~20% volume increase. Cappuccino: ~50% increase.',
          'Shut off 10–15 degrees before target: kids 120F, regular 150F, extra hot 160F.',
          'Wand cleanup: purge and wipe immediately after every steam. Tap pitcher, swirl until milk looks like wet paint.',
          'Hot Supreme order: flavors → espresso → whisk → steam milk → pour into cup → drizzle on top. Double-cup all hot drinks.',
          'Cold brew drinks: TOM-TOM after adding cold brew. Kona Cloud: add flavor, whisk until uniform, pour on top.',
          'Day 3–4 End-of-Day Review — at least 7 of 9 correct: sanitizing bucket levels, syrup replacement rule, Cold Brew Toddy steps, espresso target range, Grind/Dose/Tamp purpose.',
        ],
        competencyCriteria: [
          'Milk steamed to wet-paint texture at target temperature; hot Supreme and cold brew drink built correctly; Day 3–4 review passed (7 of 9)',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'barista-basics-2',
    name: 'Barista Basics II',
    description: 'Section 4 (Days 5–6) — Americanos, Shaken Espresso, Freezes, Smoothies, and standard recipe mastery of the top 21 drinks.',
    order: 4,
    contentVersion: 3,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'bb2-all',
        name: 'Days 5–6 — Americanos, Shaken Espresso, Freezes, Smoothies & Recipe Mastery',
        description: 'Higher shot counts, all new drink categories, and mastery of the 21 most popular drinks.',
        estimatedMinutes: 210,
        steps: [
          'Americano shot count: S=2, M=3, L=4+1 free optional, XL=6 (iced and hot).',
          'Iced Americano: measuring cup — flavor → espresso → whisk (powder/sauce only) → cold water to fill-to. Pour over ice, TOM-TOM.',
          'Hot Americano: hot cup — flavor → espresso → whisk → fill with hot water to rim. Double-cup. No XL for hot.',
          'Shaken Espresso: shaker cup — flavor → espresso → swirl → level ice → lid → SHAKE (listen for rattle) → pour → splash milk in shaker → pour into cup.',
          'Freezes: same powder scoop count as chillers (S=2, M=3, L=4, XL=6). Fill-to 1 oz more than chillers (no espresso).',
          'Smoothies: heaping ice in drink cup, shake smoothie mix, add to rim of cup, pour into blender, blend on #4, pour back.',
          '21 core drinks: Maui Latte, Sandy Blonde, The Legend, Cabo San Lucas, Cookie Butter Iced, The Ben, Maui Vanilla, Summer Latte, Brown Sugar Cinnamon Cold Brew, White Chocolate Mac Cold Brew, Shaken Brown Sugar Oat Milk, Vanilla Caramel Chiller, Sandy Kisses Chiller, PB No J Chiller, Oreo Chiller, The Vacation, Starburst, Local Juice, Skittles, Matcha, Spiced/Vanilla Chai.',
          'New Hire builds each drink to spec from Mela; trainer coaches for accuracy and speed.',
        ],
        competencyCriteria: [
          'All 21 core drinks built accurately from memory without coaching on measurements',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'opening',
    name: 'Opening Operations & Service',
    description: 'Section 5 (Day 7) — Step-by-step opening checklist, equipment startup, cash setup, and mid-point execution quizzes.',
    order: 5,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'op-all',
        name: 'Day 7 — Opening Checklist & Mid-Point Quizzes',
        description: 'Complete all opening tasks in order, then complete mid-point POS, bar, and prep quizzes.',
        estimatedMinutes: 180,
        steps: [
          'Fill back sinks: soapy water (wash) and sanitizer (sanitize). Fill sanitizing buckets and add rags.',
          'Turn on ovens: tap power icon → tap temperature in lower left corner.',
          'Turn on slushy machine: switch on right side. Turn light switch in middle to the right.',
          'Make drip coffee.',
          'Remove powder lids and add measuring scoops to each.',
          'Put out pastries: arrange by type, give gluten-free extra space or separate.',
          'Update POS inventory for all delivered items.',
          'Place whisks and mixing spoons in whisk well; open water spout.',
          'Fill ice bin.',
          'Place $300 cash in register (recount). Bring down chairs and stools. Put out cake pops if available.',
          'Check restroom: toilet paper, paper towels, hand soap.',
          'Set timers: sanitizing buckets every 2 hrs, lobby/restroom check every 30 min.',
          'Mid-point POS Quiz: ring in multiple orders accurately, including modifiers, voids with approval, and one cash transaction.',
          'Mid-point Bar Quiz: milk steam to target temp, espresso shot within 10–15 sec, 2+ core beverages built correctly.',
          'Mid-point Prep Quiz: correct measurements, labeling/dating, mise en place.',
        ],
        competencyCriteria: [
          'Opening checklist completed independently in correct order; mid-point POS, bar, and prep quizzes passed',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'bar-routine',
    name: 'Beginner Barista Bar Routine',
    description: 'Section 6 (Day 8) — FOH + bar integration, the 3-role model, first supervised live bar shift, and custom drink orders.',
    order: 6,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'br-all',
        name: 'Day 8 — Supervised Bar Shift & Custom Orders',
        description: 'Full supervised shift rotating through Order Taker, Drink Preparer, and Floor Manager roles. Custom and complex drink orders.',
        estimatedMinutes: 540,
        steps: [
          '3-Role Model: (1) Order Taker — accurate register, bar communication; (2) Drink Preparer — build drinks in queue order; (3) Floor Manager — lobby, customer support, expo.',
          'New Hire works independently with trainer supervising and answering questions only.',
          'Working toward the 4-minute drink goal.',
          'Substitutions and dairy swaps: correctly swap milk type, adjust Maui Milk ratio.',
          'Off-menu requests: plain cold brew, drip, cappuccino, cortado, espresso shots — find on register and build correctly.',
        ],
        competencyCriteria: [
          'Full supervised bar shift completed rotating through all 3 roles; custom drink orders entered and built correctly',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'peak-prep',
    name: 'Peak Prep & Rush Hour',
    description: 'Section 7 (Day 9) — The 7–9 AM peak, pre-rush staging, defined roles under pressure, batch brewing during rush, and post-rush recovery.',
    order: 7,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'pp-rush-workflow',
        name: 'Day 9 — Peak Hour Workflow',
        description: 'New Hire placed on floor during 7–9 AM peak. Defined roles, queue management, staying calm under pressure.',
        estimatedMinutes: 480,
        steps: [
          'Defined roles during rush: prevents bottlenecks and dropped tasks.',
          'Queue management: drink sequencing to keep lines moving. Stay calm, accurate, and quality-focused even during high volume.',
          "If a mistake happens: remain calm, apologize to customer, correct quickly. Never send out incorrect drinks just because it\'s busy.",
          'Batch brewing during rush: refresh drip as needed.',
          'Post-rush recovery: reset station, restock as needed, assess what ran low.',
        ],
        competencyCriteria: [
          'Peak hour shift completed; defined role maintained; drinks accurate and sent without shortcuts under pressure',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'closing',
    name: 'Closing Operations',
    description: 'Section 8 (Day 10) — Full step-by-step closing checklist: restocking, cleaning, equipment shutdown, batching, dating/labeling, and final checks.',
    order: 8,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'cl-all',
        name: 'Day 10 — Full Closing: Restock, Clean & Food Safety',
        description: 'Complete all closing tasks: restock, batch prep, full clean, food safety audit, dating, and final fridge check.',
        estimatedMinutes: 230,
        steps: [
          'Restock cups, syrups, drizzle bottles, milk fridge. Rotate milks FIFO. Rotate Kona (thawed side forward).',
          'Brew all three teas, iced drip, Maui Milk, Kona Cloud. Make slushy mix. Brew Cold Brew (leave at room temp — do NOT refrigerate).',
          'Restock sugars, straws, napkins, utensils, powders. Log out-of-stock items for manager.',
          'Wipe counters, cabinets, fridges. Clean whisk well, glass, syrup rack, espresso machine, drip pots.',
          'Sweep. Mop (including under fridges/freezers/shelves). Clean bathroom and toilet.',
          'Drains: covers, dish tray, hot soapy water and scrub.',
          'Turn off oven and clean. Turn off slushy machine and clean front plus tray.',
          'Clean sanitizing buckets. Plug in iPads. Take trash out. Wipe furniture.',
          'Audit all prep containers: discard past Use By Date. Label any unlabeled items.',
          'FIFO all prepped items. Final fridge temperature check: 41F or below.',
        ],
        competencyCriteria: [
          'Closing checklist completed independently (restock, batch prep, full clean, food safety dating, fridge temperature at 41F or below)',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'supervised-practice',
    name: 'Supervised Practice',
    description: 'Section 9 (Days 11–13) — Three full supervised shifts in multiple roles. Focus on confidence, efficiency, and completing all duties independently.',
    order: 9,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'sp-supervised-shifts',
        name: 'Days 11–13 — Three Supervised Practice Shifts',
        description: 'New Hire works 3 full supervised shifts rotating through all roles. Focus: confidence, efficiency, food safety routines, and break compliance.',
        estimatedMinutes: 1440,
        steps: [
          'Day 11: supervised shift as fully integrated bar role.',
          'Day 12: supervised shift rotating into register/order taker role.',
          'Day 13: supervised shift rotating into floor manager/support role.',
          'All shifts: complete hourly cleaning tasks without prompting; log breaks accurately; sustain 4-minute drink goal.',
        ],
        competencyCriteria: [
          'Three supervised practice shifts completed across bar, register, and floor roles',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'final-review',
    name: 'Final Review & Sign-Off',
    description: 'Section 10 (Day 14) — Comprehensive practical exam, roles/responsibility, 30–90 day proficiency check, schedule review, and Training Certification Form signed.',
    order: 10,
    contentVersion: 4,
    updatedAt: '2026-05-28T00:00:00Z',
    skills: [
      {
        id: 'fr-all',
        name: 'Day 14 — Final Review & Certification',
        description: 'Practical exam, roles clarification, proficiency check timeline, schedule review, and Training Certification Form signed by all parties.',
        estimatedMinutes: 100,
        steps: [
          'Manager presents a realistic multi-drink, multi-task order. Assess: espresso shot timing, milk temp, recipe accuracy, speed, cup cleanliness.',
          'Roles & responsibility clarification: review Barista and Shift Lead job expectations.',
          '30–90 day proficiency check: explain timeline, consequences of not meeting expectations at reassessment.',
          'Schedule review: cover first permanent schedule, break compliance, CA Minor Work Rules if applicable.',
          'Confirm all required training station sign-offs are complete.',
          'Trainee signs the Trainee Statement. Trainer signs the Trainer Statement. Manager signs with date. Copy given to New Hire; original filed.',
        ],
        competencyCriteria: [
          'Practical exam passed; Training Certification Form signed by Trainee, Trainer, and Manager',
        ],
      },
    ],
  },
];

export function getStation(id: string) {
  return STATIONS.find((s) => s.id === id);
}

/** Total skills in the curriculum — used for progress percentages. */
export function totalSkills() {
  return STATIONS.reduce((sum, s) => sum + s.skills.length, 0);
}

/** Returns skills completed across all stations for an employee. */
export function completedSkillsCount(progress: Record<string, { skillsCompleted: string[] }>) {
  return Object.values(progress).reduce((sum, p) => sum + p.skillsCompleted.length, 0);
}
