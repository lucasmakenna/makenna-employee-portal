export interface StudyQuestion {
  question: string;
  answer: string;
}

export interface StudyDeck {
  id: string;
  sectionName: string;
  emoji: string;
  passingScore: number;
  questions: StudyQuestion[];
}

export const STUDY_DECKS: StudyDeck[] = [
  {
    id: 'compliance-culture',
    sectionName: 'Section 1 — Compliance & Culture',
    emoji: '📋',
    passingScore: 5,
    questions: [
      {
        question: 'What is the minimum notice required when calling out before a shift, and who do you call?',
        answer: 'Give the minimum advance notice set by the store before your shift starts, and call the store manager directly — not just text or message.',
      },
      {
        question: 'For opening shifts, who must the New Hire call if they cannot make their shift?',
        answer: 'The manager directly — not just text or message.',
      },
      {
        question: 'Explain the California meal break rule: when must it begin, and under what condition can it be waived?',
        answer: 'The meal period must begin before the end of the 5th hour of work. It can only be waived for shifts of 6 hours or less AND only if both the employee and manager agree in writing (Meal Period Waiver form).',
      },
      {
        question: 'Can a 10-minute rest break be waived? Why or why not?',
        answer: 'No — rest breaks cannot be waived. They are a California legal right. Employees are always entitled to their 10-minute paid rest breaks and cannot give them up.',
      },
      {
        question: 'Name 4 out of the 6 Aspects of Success at Makenna Koffee.',
        answer: 'Any 4 of: Customer Service, Consistent Quality, Proactive Ownership, Immaculate Environment, Accountability & Reliability, Vibes.',
      },
      {
        question: 'What are the New Hire drink benefits while on the clock?',
        answer: 'One free drink per shift while on the clock. 50% discount on drinks when off the clock.',
      },
      {
        question: 'What is a split shift and when must it be pre-approved?',
        answer: 'A split shift has an unpaid break longer than a standard meal period between two work segments in the same day. Split shifts must always be pre-approved by a manager before scheduling.',
      },
    ],
  },
  {
    id: 'food-safety-pos',
    sectionName: 'Section 2 — Food Safety & POS',
    emoji: '🧼',
    passingScore: 7,
    questions: [
      {
        question: 'List the 4 steps of the 3-Compartment Sink procedure in the correct order.',
        answer: '1) Rinse off residue → 2) Wash in warm soapy water (fill wash sink to the line) → 3) Rinse in the rinse sink (water only, no soap) → 4) Sanitize (fill to line with correct bleach ratio) → Air dry completely. Never skip a step or change the order.',
      },
      {
        question: 'What sanitizer concentration are you targeting for the counter sanitizing bucket, and how do you test it?',
        answer: '100 ppm Clorox bleach. Use a test strip to verify the concentration every time you make a new bucket. If it doesn\'t test correctly, discard and remake.',
      },
      {
        question: 'How often must sanitizing buckets be emptied, rinsed, and refilled? What triggers an early change?',
        answer: 'Every 2 hours. Change early any time the water looks cloudy, greasy, or dirty — regardless of the timer.',
      },
      {
        question: 'What does FIFO stand for and why is it important for food safety?',
        answer: 'First In First Out. Always move older product to the front so it gets used first. Newer product goes to the back. Prevents expiration and reduces the risk of serving spoiled food.',
      },
      {
        question: 'Name all major allergens currently carried at Makenna Koffee.',
        answer: 'Milk, Eggs, Wheat, Soy, Peanut butter. Makenna Koffee is NOT a nut-free or gluten-free facility.',
      },
      {
        question: 'Walk through the 5-step register greeting sequence in order.',
        answer: '1) Greet with a smile and warm welcome → 2) Take the order, repeat it back to confirm → 3) Enter the order correctly in Square POS → 4) Confirm the total and process payment → 5) Thank the customer and let them know when their order will be ready.',
      },
      {
        question: 'What is a Supreme drink? What two choices does the customer make when ordering one?',
        answer: 'A Supreme is an espresso-based latte with flavored syrups/sauces and milk. Two customer choices: 1) Milk type (Whole Milk is standard; Oat, Almond, etc. at upcharge). 2) Style — Iced, Hot, or Blended Chiller.',
      },
      {
        question: 'What is Maui Milk and what is the single most important thing to communicate to a customer about it?',
        answer: 'Maui Milk is a secret recipe. The MOST IMPORTANT thing: it is DAIRY-BASED — communicate this clearly to any customer with lactose intolerance or dairy allergy. Tastes like melted vanilla ice cream. Never reveal or speculate about ingredients.',
      },
      {
        question: 'What is Kona Cloud, what does it contain, and what is its Use By Date once opened?',
        answer: 'Kona Cloud is Makenna\'s sweet cold foam that sits on top of drinks and slowly mixes in. Contains dairy (oat version available — must be specified). Use By Date: 2 weeks from the date it was made. Always check the date on the dispenser lid.',
      },
    ],
  },
  {
    id: 'barista-basics-1',
    sectionName: 'Section 3 — Barista Basics I',
    emoji: '☕',
    passingScore: 7,
    questions: [
      {
        question: 'What is the correct fill level for the RED counter sanitizing bucket vs. the WHITE steaming wand bucket?',
        answer: 'RED counter sanitizing bucket = fill to LINE 2. WHITE steam wand bucket = fill to LINE 1.',
      },
      {
        question: 'When must a sanitizing bucket be changed early, regardless of the timer?',
        answer: 'When the water becomes cloudy or greasy — regardless of how long it has been since the last change.',
      },
      {
        question: 'When should a syrup bottle be replaced, and what do you do if a bottle is nearly empty during a rush?',
        answer: 'Replace ONLY when the pump can no longer extract any liquid. If nearly empty during a rush, discard the remaining syrup into another bottle of the exact same flavor — do not mix different flavors.',
      },
      {
        question: 'Walk through the steps for preparing a Cold Brew Toddy from start to finish.',
        answer: 'Place the plastic stand inside the Toddy → set grinder to COARSE → place a bag behind the grinder outlet → grind Cold Brew Beans → place filter bag with grinds into the Toddy → fill with drinking water using a clean pitcher (leave 1 inch at top) → write the Ready By Date (current time + 14 hours) → leave out at room temperature. Do NOT put in the fridge.',
      },
      {
        question: 'What is the target espresso shot extraction time range?',
        answer: '10–15 seconds is the target. 9 seconds is usable but adjust finer immediately. 8 seconds or below: discard. 16–18 seconds is usable but adjust coarser immediately. 19+ seconds: discard.',
      },
      {
        question: 'Describe the purpose of each step in sequence: Grind, Dose, and Tamp.',
        answer: 'Grind: breaks down beans to a specific particle size for proper water flow. Dose: grinder weighs a precise amount (16–18g) into the portafilter for consistency. Tamp: applies even, firm pressure (~30 lbs) to create a level, compact puck so water flows evenly through all the grounds.',
      },
      {
        question: 'How do you properly clean a portafilter before dosing, and what tool do you use?',
        answer: 'Knock used grounds out on the knock box crossbar. Then wipe the portafilter with the dedicated DRY RAG stored near the knock box. Remove excess grounds only — deep cleaning is not required at this step.',
      },
      {
        question: 'What happens if the grounds in the portafilter are tamped unevenly?',
        answer: 'Water follows the path of least resistance and slides to the lower end instead of flowing evenly. This causes channeling — uneven extraction that makes the shot taste off and produces an unreliable pull time.',
      },
      {
        question: 'What should you do if the stream of grounds from the grinder is not coming out centered?',
        answer: 'An off-center grounds stream indicates a clog in the grinder. Stop using it and clean the grinder, or follow the troubleshooting guide. Do not continue pulling shots with a clogged grinder.',
      },
    ],
  },
];
