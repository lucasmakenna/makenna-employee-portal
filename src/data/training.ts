import { TrainingStation } from '@/types';

/**
 * Makenna Koffee training curriculum — 11 sections.
 *
 * Sourced from the "Brain Blend" Employee Training & Onboarding Plan v1.1
 * (April 2026). Sub-sections from the document map to individual skills.
 * Each skill has `steps` (the trainer's procedure guide) and
 * `competencyCriteria` (the sign-off checkboxes).
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
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      // ── 1.1 Compliance Documentation ────────────────────────────────────
      {
        id: 'cc-1a',
        name: '1.1 Employee Profile Form (Homebase) — Completed & Filed',
        description: 'New Hire completes Employee Profile Form in Homebase. Do NOT select "use cash out" — causes payroll delays.',
        estimatedMinutes: 10,
        steps: [
          'Open Homebase and walk New Hire through the Employee Profile Form.',
          'CRITICAL: Do NOT select "use cash out" — this causes delays with payroll.',
          'Confirm all fields are completed and saved.',
          'Manager scans/files completed form in the New Hire Paperwork File.',
        ],
        competencyCriteria: ['Employee Profile Form completed in Homebase; "use cash out" NOT selected; filed'],
      },
      {
        id: 'cc-1b-1',
        name: '1.1 W-4 Federal Tax Withholding — Completed & Filed',
        description: 'New Hire completes IRS Form W-4 for federal tax withholding and the original is filed.',
        estimatedMinutes: 10,
        onboardingDocId: 'w4',
        steps: [
          'Complete W-4 Federal Withholding form with New Hire.',
          'Manager retains original and scans a copy into the employee file.',
        ],
        competencyCriteria: ['W-4 completed and filed'],
      },
      {
        id: 'cc-1b-2',
        name: '1.1 I-9 Employment Eligibility — 2 Documents Verified & Filed',
        description: 'New Hire completes Form I-9 with 2 acceptable eligibility documents verified by the manager.',
        estimatedMinutes: 10,
        onboardingDocId: 'i9',
        steps: [
          'Complete Form I-9: verify the New Hire brought 2 acceptable eligibility documents (see I-9 page 2 for full list).',
          'Manager inspects originals and retains copies in the employee file.',
        ],
        competencyCriteria: ['I-9 completed with 2 valid eligibility documents verified and on file'],
      },
      {
        id: 'cc-1c',
        name: '1.1 Employee Handbook Acknowledgment — Signed & Filed',
        description: 'New Hire reviews and signs the Employee Handbook Acknowledgment form.',
        estimatedMinutes: 10,
        onboardingDocId: 'handbook',
        steps: [
          'Confirm New Hire has read (or is reading) the handbook.',
          'Have New Hire sign the Employee Handbook Acknowledgment form.',
          'Manager scans and files in Homebase; original in binder.',
        ],
        competencyCriteria: ['Employee Handbook Acknowledgment signed and filed'],
      },
      {
        id: 'cc-1d',
        name: '1.1 Harassment Policy Review & Signature — Filed',
        description: 'New Hire reviews and signs the Harassment Policy Review form.',
        estimatedMinutes: 10,
        onboardingDocId: 'harassment_attestation',
        steps: [
          'Walk New Hire through the Harassment Policy.',
          'Have New Hire sign the Harassment Policy Review Form.',
          'Manager scans and files in Homebase; original in binder.',
        ],
        competencyCriteria: ['Harassment Policy Review form signed and filed'],
      },
      {
        id: 'cc-1e',
        name: '1.1 Work Permit Filed (if under 18)',
        description: 'If New Hire is a minor, collect and file a valid school work permit before first shift.',
        estimatedMinutes: 5,
        steps: [
          'If New Hire is under 18: verify a valid school work permit is in hand.',
          'File the work permit in the Minor Work Permit File.',
          'If New Hire is 18 or older: mark N/A.',
        ],
        competencyCriteria: ['Work permit on file (minor) — OR — confirmed 18 or older (N/A)'],
      },
      // ── 1.2 Food Handler Certification ──────────────────────────────────
      {
        id: 'cc-2a',
        name: '1.2 Food Handler Course — Enrolled on Day 1',
        description: 'Enroll New Hire in the California Food Handler course (ServSafe) on Day 1. 1 hr paid; course cost ($11.99) paid by Makenna.',
        estimatedMinutes: 5,
        steps: [
          'Enroll New Hire in the ServSafe Food Handler course on Day 1.',
          'Confirm enrollment is complete and course is accessible.',
        ],
        competencyCriteria: ['New Hire enrolled in Food Handler course on Day 1'],
      },
      {
        id: 'cc-2b',
        name: '1.2 ServSafe Link Provided — 1 Hr Paid Time Allocated',
        description: 'Manager provides the pre-approved ServSafe course link to New Hire. Confirm 1 hour of paid time allocated.',
        estimatedMinutes: 5,
        steps: [
          'Provide the ServSafe link to New Hire.',
          'Confirm New Hire can access the course (mobile or computer).',
          'Confirm 1 hour of paid time is allocated for course completion.',
        ],
        competencyCriteria: ['ServSafe link provided; New Hire confirmed access; 1 hr paid time allocated'],
      },
      {
        id: 'cc-2c',
        name: '1.2 California Food Handler Card — Filed (within 30 days)',
        description: 'New Hire must obtain California Food Handler Card within 30 days of hire. Manager prints and files certificate.',
        estimatedMinutes: 5,
        steps: [
          'Set a 30-day reminder to confirm Food Handler Card receipt.',
          'When complete: Manager prints and files certificate in employee file.',
          'Card is valid for 3 years and must be maintained throughout employment.',
        ],
        competencyCriteria: ['California Food Handler Card filed within 30 days of hire'],
      },
      // ── 1.3 Handbook & New Hire Basics ──────────────────────────────────
      {
        id: 'cc-3a-1',
        name: '1.3 Employee Handbook — Confirmed Read',
        description: 'Confirm New Hire has read the Employee Handbook before the NDA is signed.',
        estimatedMinutes: 5,
        steps: [
          'Confirm New Hire has read the Employee Handbook (or is reading it during Day 1).',
          'Answer any questions before proceeding to the NDA.',
        ],
        competencyCriteria: ['Handbook confirmed read'],
      },
      {
        id: 'cc-3a-2',
        name: '1.3 Makenna NDA — Signed & Filed',
        description: 'New Hire signs the Makenna Koffee Nondisclosure Agreement. Filed in Homebase.',
        estimatedMinutes: 10,
        onboardingDocId: 'nda',
        steps: [
          'Review and sign the Makenna Nondisclosure Agreement (Makenna Nondisclosure Agreement.pdf).',
          'File signed NDA in Homebase.',
        ],
        competencyCriteria: ['Makenna NDA signed and filed'],
      },
      {
        id: 'cc-3b-1',
        name: '1.3 Dress Code Standards — Reviewed & Acknowledged',
        description: 'Review dress code: black shirt, dark pants, closed-toe non-slip shoes, hair tied back. Cover footwear, headwear, and jewelry standards.',
        estimatedMinutes: 8,
        steps: [
          'Review dress code standards: black shirt, dark pants, closed-toe non-slip shoes, hair tied back.',
          'Cover footwear, headwear, and jewelry standards.',
          'New Hire acknowledges dress code standards in writing.',
        ],
        competencyCriteria: ['Dress code standards reviewed and acknowledged'],
      },
      {
        id: 'cc-3b-2',
        name: '1.3 2 Shirts + 1 Hoodie/Sweater — Issued on Day 1',
        description: 'Issue New Hire 2 Makenna shirts and 1 hoodie or sweater on Day 1. Use Employee on-the-clock discount to mark out at $0.',
        estimatedMinutes: 5,
        steps: [
          'Issue 2 shirts + 1 hoodie/sweater.',
          'For high-frequency schedules, up to 5 t-shirts may be requested.',
          'Use Employee "on the clock" discount to mark out at $0.',
        ],
        competencyCriteria: ['2 shirts + 1 hoodie/sweater issued on Day 1'],
      },
      {
        id: 'cc-3c-1',
        name: '1.3 Attendance: 2-Hour Minimum Call-Out Notice Understood',
        description: 'All call-outs require a minimum of 2 hours notice prior to shift start. Call the Store Manager directly.',
        estimatedMinutes: 5,
        steps: [
          'All call-outs require a strict minimum of 2 hours notice prior to shift start time.',
          'Call the Store Manager directly. If unavailable, speak with the Shift Lead.',
        ],
        competencyCriteria: ['States 2-hour minimum call-out notice requirement'],
      },
      {
        id: 'cc-3c-2',
        name: '1.3 Attendance: Opening Shifts — Call Store Manager Cell Directly',
        description: 'For opening shifts specifically, New Hire must call the Store Manager\'s cell phone — no exceptions.',
        estimatedMinutes: 3,
        steps: [
          'OPENING SHIFTS: must call the Store Manager\'s cell phone — no exceptions.',
          'This is different from other shifts. Confirm New Hire has the Store Manager\'s cell number.',
        ],
        competencyCriteria: ['States opening shifts require calling the Store Manager cell directly'],
      },
      {
        id: 'cc-3c-3',
        name: '1.3 Attendance: Tardiness & Irregular Attendance Can Result in Separation',
        description: 'Punctuality is critical. Failure to arrive on time results in disciplinary action up to and including separation.',
        estimatedMinutes: 3,
        steps: [
          'Emphasize: punctuality is critical to operations.',
          'Failure to arrive on time results in disciplinary action up to and including separation.',
          'Irregular attendance can also affect employment.',
          'Ensure availability and time-off requests are kept updated.',
        ],
        competencyCriteria: ['Understands tardiness and irregular attendance can result in separation'],
      },
      {
        id: 'cc-3d-1',
        name: '1.3 Timekeeping: Clocking In & Out — Demonstrated',
        description: 'New Hire demonstrates clocking in and out in the timekeeping system.',
        estimatedMinutes: 5,
        steps: [
          'Show New Hire how to clock in and clock out in the timekeeping system.',
          'Have New Hire perform a test clock-in and clock-out.',
        ],
        competencyCriteria: ['Demonstrates clocking in and out in the timekeeping system'],
      },
      {
        id: 'cc-3d-2',
        name: '1.3 Timekeeping: Clocking In/Out for 30-Min Meal Break — Demonstrated',
        description: 'New Hire demonstrates clocking in/out specifically for the 30-minute unpaid meal break.',
        estimatedMinutes: 5,
        steps: [
          'Show how to clock in/out for the 30-minute meal break specifically.',
          'Have New Hire perform a test clock-out and clock-in for the meal break.',
        ],
        competencyCriteria: ['Demonstrates clocking in/out for the 30-minute meal break'],
      },
      {
        id: 'cc-3d-3',
        name: '1.3 No Work Off the Clock — Stated in Own Words',
        description: 'No work off the clock — ever. No prep, clean-up, paperwork, or texts unless punched in.',
        estimatedMinutes: 5,
        steps: [
          'NO WORK OFF THE CLOCK — ever. No prep, no clean-up, no paperwork, no answering a manager text about a shift unless punched in and being paid.',
          'Ask New Hire to explain this rule back in their own words.',
        ],
        competencyCriteria: ['States the no-work-off-the-clock rule in own words'],
      },
      {
        id: 'cc-3d-4',
        name: '1.3 Timekeeping: Missed Punches — Report to Shift Lead or Manager Same Day',
        description: 'If a punch is missed, New Hire tells the Shift Lead or Manager that same day so it gets corrected.',
        estimatedMinutes: 3,
        steps: [
          'If a punch is missed: tell the Shift Lead or Manager that same day so it gets corrected on the timesheet.',
          'Confirm New Hire understands this is their responsibility to report — not to wait.',
        ],
        competencyCriteria: ['Knows to report missed punches to Shift Lead or Manager the same day'],
      },
      {
        id: 'cc-3e-1',
        name: '1.3 Overtime: 1.5× Triggers Stated Correctly',
        description: '1.5× triggers: over 8 hrs/day; over 40 hrs/week; first 8 hours on the 7th consecutive workday.',
        estimatedMinutes: 5,
        steps: [
          'Overtime 1.5× pay triggers: over 8 hours in one workday; over 40 hours in one workweek; first 8 hours on the 7th consecutive workday.',
        ],
        competencyCriteria: ['States the 1.5× overtime triggers correctly (8 hrs/day, 40 hrs/week, 7th consecutive day first 8 hrs)'],
      },
      {
        id: 'cc-3e-2',
        name: '1.3 Overtime: 2× Double-Time Triggers Stated Correctly',
        description: '2× triggers: over 12 hrs/day; over 8 hours on the 7th consecutive workday.',
        estimatedMinutes: 5,
        steps: [
          'Double time 2× pay triggers: over 12 hours in one day; over 8 hours on the 7th consecutive workday.',
        ],
        competencyCriteria: ['States the 2× double-time triggers correctly (12 hrs/day, 8 hrs on 7th consecutive day)'],
      },
      {
        id: 'cc-3e-3',
        name: '1.3 Overtime: Makenna\'s 10-Hour Rest Standard Between Shifts Stated',
        description: 'Makenna schedules at least 10 hours off between end of one shift and start of the next.',
        estimatedMinutes: 3,
        steps: [
          'Rest between shifts: Makenna schedules at least 10 hours off between end of one shift and start of the next.',
        ],
        competencyCriteria: ['States Makenna\'s 10-hour rest standard between shifts'],
      },
      {
        id: 'cc-3f-1',
        name: '1.3 Rest Breaks: Tiers Stated Correctly (0 / 1 / 2 / 3 Based on Hours Worked)',
        description: 'Under 3.5 hrs = 0 breaks. 3.5–6 hrs = 1 break. 6–10 hrs = 2 breaks. 10–14 hrs = 3 breaks.',
        estimatedMinutes: 8,
        steps: [
          'Under 3.5 hours worked → 0 rest breaks.',
          '3.5 to 6 hours worked → 1 rest break (10 min paid).',
          'Over 6 to 10 hours worked → 2 rest breaks.',
          'Over 10 to 14 hours worked → 3 rest breaks.',
          'Rest breaks should land roughly in the middle of each work period.',
          'Example (8 AM–4:30 PM): first rest ~10 AM, meal break ~12 PM, second rest ~2 PM.',
        ],
        competencyCriteria: ['States rest break tiers correctly (0 / 1 / 2 / 3 based on hours worked)'],
      },
      {
        id: 'cc-3f-2',
        name: '1.3 Rest Breaks Cannot Be Waived',
        description: '10-minute paid rest breaks cannot be waived by the employee or management.',
        estimatedMinutes: 3,
        steps: [
          'Employees CANNOT waive a 10-minute rest break.',
          'Missed or late rest breaks are subject to corrective action.',
        ],
        competencyCriteria: ['States rest breaks cannot be waived'],
      },
      {
        id: 'cc-3f-3',
        name: '1.3 Rest Breaks: Do NOT Clock Out for 10-Minute Rest Breaks',
        description: 'The 10-minute rest break is paid — do NOT clock out. Only clock out for the 30-minute meal break.',
        estimatedMinutes: 3,
        steps: [
          'Do NOT clock out for 10-minute rest breaks.',
          'DO clock out for the 30-minute meal break.',
        ],
        competencyCriteria: ['States NOT to clock out for 10-minute rest breaks'],
      },
      {
        id: 'cc-3f-4',
        name: '1.3 Rest Breaks: Break Sticker Location Identified',
        description: 'New Hire can identify where the break sticker is located in the store.',
        estimatedMinutes: 2,
        steps: [
          'Show New Hire where the break sticker is located.',
          'New Hire confirms they know where to find it.',
        ],
        competencyCriteria: ['Can identify where the break sticker is located'],
      },
      {
        id: 'cc-3g-1',
        name: '1.3 Meal Break: 5th-Hour Rule Stated (Must Start Before End of 5th Hour)',
        description: 'California law: the 30-minute unpaid meal break must START before the end of the 5th hour of work.',
        estimatedMinutes: 5,
        steps: [
          'California law: the 30-minute unpaid meal break must start before the end of the 5th hour of work.',
          'Missed or late meal breaks are subject to corrective action up to separation.',
        ],
        competencyCriteria: ['States the 5th-hour meal break rule (must start before end of 5th hour)'],
      },
      {
        id: 'cc-3g-2',
        name: '1.3 Meal Break: Clock Out for the 30-Minute Break',
        description: 'The 30-minute meal break is unpaid — New Hire must clock out and clock back in.',
        estimatedMinutes: 3,
        steps: [
          'DO clock out for the 30-minute meal break.',
          'DO clock back in when returning from the meal break.',
        ],
        competencyCriteria: ['States to clock out for the 30-minute meal break'],
      },
      {
        id: 'cc-3g-3',
        name: '1.3 Meal Break: Timing Calculated from Actual Clock-In Time',
        description: 'If the New Hire clocks in early, the 5th-hour deadline shifts earlier. Timing is from actual clock-in.',
        estimatedMinutes: 3,
        steps: [
          'Break timing is calculated from the actual clock-in time — if the New Hire clocks in early, the 5th-hour deadline shifts earlier.',
        ],
        competencyCriteria: ['Knows break timing is calculated from actual clock-in time'],
      },
      {
        id: 'cc-3h-1',
        name: '1.3 Meal Period Waiver: Applies Only on Shifts ≤ 6 Hours',
        description: 'The Meal Period Waiver only applies to shifts of 6 hours or less. It does not apply to longer shifts.',
        estimatedMinutes: 5,
        steps: [
          'The Meal Period Waiver is a proactive, standing agreement allowing the option to skip the 30-min meal break — only on shifts 6 hours or less.',
          'If a "no meal" shift extends past 6 hours: call the 30-min break immediately.',
        ],
        competencyCriteria: ['States Meal Period Waiver applies only on shifts ≤ 6 hours'],
      },
      {
        id: 'cc-3h-2',
        name: '1.3 Meal Period Waiver: Signing Is 100% Voluntary — Cannot Be Pressured',
        description: 'Signing the waiver is completely voluntary. No one can pressure the New Hire to sign. The job does not depend on signing.',
        estimatedMinutes: 5,
        steps: [
          'Signing is 100% voluntary. No one (Trainer, Shift Lead, Manager) can pressure New Hire to sign. The job does not depend on signing.',
        ],
        competencyCriteria: ['States signing is 100% voluntary and cannot be pressured'],
      },
      {
        id: 'cc-3h-3',
        name: '1.3 Meal Period Waiver: Having the Waiver Does Not Mean Break Must Always Be Skipped',
        description: 'The waiver gives the OPTION to skip — not the obligation. The choice belongs to the employee each shift.',
        estimatedMinutes: 3,
        steps: [
          'Having a waiver on file does NOT mean the employee must skip their break every shift. The choice is the employee\'s, every single shift.',
          'If employee is hungry, tired, or wants the break — take the break. No questions, no pushback from leadership.',
        ],
        competencyCriteria: ['States the waiver does not mean the break must always be skipped'],
      },
      {
        id: 'cc-3h-4',
        name: '1.3 Meal Period Waiver: If "No Meal" Shift Extends Past 6 Hours — Take Break Immediately',
        description: 'If a shift expected to be ≤ 6 hours goes longer, the meal break must be provided immediately.',
        estimatedMinutes: 3,
        steps: [
          'If a "no meal" shift extends past 6 hours: call the 30-min break immediately.',
          'If the 5th hour has already passed, the shop owes a 1-hour meal break premium.',
        ],
        competencyCriteria: ['States what happens if a "no meal" shift extends past 6 hours'],
      },
      {
        id: 'cc-3h-doc',
        name: '1.3 Meal Period Waiver — Signed (if applicable)',
        description: 'If the New Hire chooses to sign the Meal Period Waiver, capture the e-signature here. Completely voluntary.',
        estimatedMinutes: 5,
        documentId: 'meal_period_waiver',
        steps: [
          'Offer the Meal Period Waiver to New Hire. Remind them it is 100% optional.',
          'If they choose to sign: have them sign using the document button below.',
          'If they decline: skip this skill — it is not required.',
        ],
        competencyCriteria: ['Meal Period Waiver signed (voluntary) — OR — New Hire declined (N/A)'],
      },
      {
        id: 'cc-3i-1',
        name: '1.3 Meal Break Attestation Form — Location Identified',
        description: 'New Hire has seen the California Meal Break Attestation Form and knows where to find it.',
        estimatedMinutes: 5,
        steps: [
          'Show New Hire the California Meal Break Attestation Form (7Shifts/Homebase/In-House App).',
          'The form is a daily affirmation that all required breaks were provided and taken.',
        ],
        competencyCriteria: ['Has seen the Meal Break Attestation Form and knows where to find it'],
      },
      {
        id: 'cc-3i-2',
        name: '1.3 Meal Break Attestation: Must Be Filled Out Every Shift, Accurately',
        description: 'The attestation is a mandatory legal time-tracking requirement filled out every shift.',
        estimatedMinutes: 3,
        steps: [
          'It is a mandatory legal time-tracking requirement.',
          'New Hire fills it out every shift, accurately. If a break was missed, late, or short — record it honestly.',
        ],
        competencyCriteria: ['States it must be filled out every shift, accurately'],
      },
      {
        id: 'cc-3i-3',
        name: '1.3 Meal Break Attestation: Falsifying the Form Is a Separate Violation',
        description: 'Marking a shift compliant when it was not is its own separate violation — not just a mistake.',
        estimatedMinutes: 3,
        steps: [
          'Do NOT mark a shift compliant when it was not. Falsifying the form is a separate violation on top of the missed break.',
        ],
        competencyCriteria: ['States falsifying the form is a separate violation'],
      },
      {
        id: 'cc-3j-1',
        name: '1.3 Split Shift: Defined Correctly (2 Shifts, 60+ Min Off Between)',
        description: 'A split shift is two shifts in one day with more than 60 minutes off the clock between them.',
        estimatedMinutes: 3,
        steps: [
          'Define a Split Shift: two shifts in one day with more than 60 minutes off the clock between them.',
        ],
        competencyCriteria: ['Defines a split shift correctly (2 shifts, 60+ min off between them)'],
      },
      {
        id: 'cc-3j-2',
        name: '1.3 Split Shifts Require Store Manager Pre-Approval',
        description: 'Split shifts are generally prohibited at Makenna. Must be approved by the Store Manager before being worked.',
        estimatedMinutes: 3,
        steps: [
          'Split shifts are generally prohibited at Makenna.',
          'Must be approved by the Store Manager before being scheduled or worked.',
        ],
        competencyCriteria: ['States split shifts require Store Manager pre-approval'],
      },
      {
        id: 'cc-3k',
        name: '1.3 Minor Work Rules Reviewed & Acknowledged (if applicable)',
        description: 'Ages 16–17: school in session max 4 hrs/day, work 5 AM–10 PM on school nights. Out of session max 8 hrs/day.',
        estimatedMinutes: 10,
        steps: [
          'If New Hire is 18 or older, mark this N/A.',
          'School in session: max 4 hours per day on a school day; work between 5:00 AM and 10:00 PM on school nights; may work until 12:30 AM on non-school nights (Fri/Sat/before holiday).',
          'Out of session: max 8 hours/day; max 48 hours/week; may work between 5:00 AM and 12:30 AM any night.',
        ],
        competencyCriteria: ['Minor work rules reviewed and acknowledged (or N/A — employee is 18+)'],
      },
      {
        id: 'cc-3l-1',
        name: '1.3 Illness Reporting: All 5 Mandatory Conditions Listed',
        description: 'New Hire can list all 5 mandatory reportable conditions: Vomiting, Diarrhea, Fever with sore throat, Jaundice, Diagnosed foodborne illness.',
        estimatedMinutes: 5,
        steps: [
          'Review the 5 mandatory health reporting conditions: (1) Vomiting, (2) Diarrhea, (3) Fever with sore throat, (4) Jaundice, (5) Diagnosed foodborne illness.',
        ],
        competencyCriteria: ['Lists all 5 mandatory reportable conditions'],
      },
      {
        id: 'cc-3l-2',
        name: '1.3 Illness Reporting: Call Store Manager Before the Shift (Not After Arriving)',
        description: 'Protocol: call the Store Manager BEFORE the shift if any symptom is present — not after arriving.',
        estimatedMinutes: 3,
        steps: [
          'Protocol: call the Store Manager before the shift if any symptom is present.',
          'Manager excludes employee from work if symptomatic, documents the incident, and follows county health guidance.',
        ],
        competencyCriteria: ['States to call Store Manager before the shift (not after arriving)'],
      },
      {
        id: 'cc-3m-1',
        name: '1.3 Scheduling App — Logged In Successfully',
        description: 'New Hire logs in to the scheduling app (Deputy or 7Shifts) and can access their profile.',
        estimatedMinutes: 5,
        steps: [
          'Open the scheduling app (Deputy or 7Shifts) with New Hire.',
          'Have New Hire log in and confirm they can access the app.',
        ],
        competencyCriteria: ['Can log in to the scheduling app'],
      },
      {
        id: 'cc-3m-2',
        name: '1.3 Scheduling App — Availability Entered',
        description: 'New Hire enters their availability in the scheduling app (availability only, not preferences).',
        estimatedMinutes: 8,
        steps: [
          'Walk through how to enter availability — note: enter availability only, not preferred times.',
          'Have New Hire enter their actual availability.',
        ],
        competencyCriteria: ['Enters their availability in the app'],
      },
      {
        id: 'cc-3m-3',
        name: '1.3 Scheduling App — Availability vs. Time-Off Request Difference Stated',
        description: 'New Hire understands the difference between entering availability and submitting a time-off request.',
        estimatedMinutes: 5,
        steps: [
          'Explain: availability entry = general weekly availability. Time-off request = specific dates you cannot work.',
          'Show how to request time off in the app.',
        ],
        competencyCriteria: ['States the difference between availability entry and time-off requests'],
      },
      {
        id: 'cc-3m-4',
        name: '1.3 Scheduling App — Opening vs. Closing Shift Difference Stated',
        description: 'New Hire can explain the difference between opening and closing shifts, including that closing includes cleaning.',
        estimatedMinutes: 5,
        steps: [
          'Explain the difference between opening shifts and closing shifts (closing shifts include staying later to clean).',
        ],
        competencyCriteria: ['States the difference between opening and closing shifts'],
      },
      {
        id: 'cc-3n-1',
        name: '1.3 Benefits: On-Clock Drink Benefit Stated (1 Before, 1 Per Break, 1 After)',
        description: 'Free drinks on shift: 1 before shift, 1 during each break, 1 after shift. Must be rung as employee drink with label on cup.',
        estimatedMinutes: 5,
        steps: [
          'FREE DRINKS ON SHIFT: 1 before shift, 1 during each break, 1 after shift.',
          'Must be rung as employee drink with label on cup (for waste/inventory tracking).',
        ],
        competencyCriteria: ['States on-clock drink benefit (1 before, 1 per break, 1 after; must be rung with label)'],
      },
      {
        id: 'cc-3n-2',
        name: '1.3 Benefits: Off-Clock 50% Discount for Employee and Friends',
        description: 'Off-clock: 50% discount for the employee and friends when the employee pays.',
        estimatedMinutes: 3,
        steps: [
          'OFF-CLOCK DISCOUNT: 50% discount for employee and friends when employee pays.',
          'RETAIL: 50% off all retail merchandise.',
          'PAY: State minimum wage plus tips. Cash tips distributed by day and hours worked.',
        ],
        competencyCriteria: ['States off-clock 50% discount applies to employee and friends'],
      },
      {
        id: 'cc-3n-3',
        name: '1.3 Benefits: 2 Shirts + 1 Hoodie/Sweater — Confirmed Received',
        description: 'Confirm New Hire has received their 2 shirts and 1 hoodie/sweater.',
        estimatedMinutes: 2,
        steps: [
          'Confirm 2 shirts + 1 hoodie/sweater received.',
          'For high-frequency schedules, up to 5 t-shirts may be requested.',
        ],
        competencyCriteria: ['Confirmed 2 shirts + 1 hoodie/sweater received'],
      },
      {
        id: 'cc-3o-1',
        name: '1.3 Harassment Defined with 2+ Real-World Examples',
        description: 'New Hire can define workplace harassment and give at least 2 real-world examples.',
        estimatedMinutes: 8,
        steps: [
          'HARASSMENT: unwelcome behavior tied to a protected category (race, gender, gender identity, sexual orientation, religion, age, national origin, disability, pregnancy, etc.) that is severe or repeated enough to make work unbearable.',
          'Examples: slurs/jokes about protected categories; unwanted touching; sexual comments/texts/gestures; sharing offensive images; repeatedly asking a coworker out after being told no.',
        ],
        competencyCriteria: ['Defines harassment with at least 2 real-world examples'],
      },
      {
        id: 'cc-3o-2',
        name: '1.3 Bullying Defined with 2+ Real-World Examples',
        description: 'New Hire can define workplace bullying and give at least 2 real-world examples.',
        estimatedMinutes: 5,
        steps: [
          'BULLYING: repeated behavior that demeans, intimidates, or excludes a coworker, even without a protected category tie.',
          'Examples: yelling/mocking in front of others; spreading rumors; freezing a coworker out; sabotaging shifts; group chats targeting a coworker; threats or physical aggression.',
        ],
        competencyCriteria: ['Defines bullying with at least 2 real-world examples'],
      },
      {
        id: 'cc-3o-3',
        name: '1.3 Retaliation Defined with 2+ Examples',
        description: 'New Hire can define retaliation and give at least 2 examples of what retaliation looks like.',
        estimatedMinutes: 5,
        steps: [
          'RETALIATION: punishing someone for reporting harassment, bullying, a labor concern, or cooperating with an investigation.',
          'Examples: cutting hours; assigning worst shifts; excluding from team chats; writing up the reporter for things others do without consequence.',
        ],
        competencyCriteria: ['Defines retaliation with at least 2 examples'],
      },
      {
        id: 'cc-3o-4',
        name: '1.3 Retaliation Is Illegal & Its Own Reportable Violation — Understood',
        description: 'Retaliation is illegal under CA FEHA and is a separate violation even if the original complaint is unproven.',
        estimatedMinutes: 5,
        steps: [
          'RETALIATION is illegal under CA FEHA and Labor Code.',
          'It is a separate violation even if the original complaint is unproven.',
          'Reiterate: every report is taken seriously, investigated, and the reporter is protected from retaliation. Period.',
        ],
        competencyCriteria: ['Understands retaliation is illegal and is its own reportable violation'],
      },
      {
        id: 'cc-3p-1',
        name: '1.3 Reporting Paths: At Least 3 of 4 Paths Stated from Memory',
        description: 'New Hire can name at least 3 of the 4 reporting paths for harassment, bullying, or labor concerns.',
        estimatedMinutes: 8,
        steps: [
          'Path 1: Tell the Shift Lead, Kona Lead, or Store Manager directly in person, by call, or by text.',
          'Path 2: Tell a different Manager if the issue involves the Store Manager.',
          'Path 3: Email Makenna directly — mafiasupport@makennakoffee.com, haley@makennakoffee.com, sabrina@makennakoffee.com.',
          'Path 4: Submit a written report using the Workplace Concern Form (QR code posted in store).',
        ],
        competencyCriteria: ['States at least 3 of the 4 reporting paths from memory'],
      },
      {
        id: 'cc-3p-2',
        name: '1.3 Reporting Paths: Verbal Reports Count — No Writing Required',
        description: 'Reports do not have to be in writing. A verbal report counts. Whoever is told writes it down.',
        estimatedMinutes: 3,
        steps: [
          'Reports do not have to be in writing. A verbal report counts.',
          'Whoever the New Hire tells writes it down.',
        ],
        competencyCriteria: ['States reports do not need to be in writing — verbal counts'],
      },
      {
        id: 'cc-3p-3',
        name: '1.3 Reporting Paths: Go to a Different Manager If Issue Involves Store Manager',
        description: 'If the issue involves the Store Manager, New Hire goes to a different Manager or directly to ownership.',
        estimatedMinutes: 3,
        steps: [
          'If the issue involves the Store Manager: go to a different Manager, or email ownership directly.',
        ],
        competencyCriteria: ['Knows to go to a different Manager if the issue involves their Store Manager'],
      },
      {
        id: 'cc-3q-1',
        name: '1.3 Customer Harassment: Protocol — Step Off Bar Immediately & Tell Shift Lead or Manager',
        description: 'If a customer is harassing an employee: step off the bar immediately and tell the Shift Lead or Manager.',
        estimatedMinutes: 5,
        steps: [
          'Customer harassment is just as serious. New Hire does not have to "just take it."',
          'What counts: sexual comments; slurs; unwanted photos; following after shift; threats or aggression.',
          'Protocol: step off the work area immediately and tell the Shift Lead or Manager.',
          'Shift Lead/Manager takes over the interaction. If threatening or won\'t leave, call police.',
        ],
        competencyCriteria: ['States the protocol: step off bar immediately, tell Shift Lead or Manager'],
      },
      {
        id: 'cc-3q-2',
        name: '1.3 Customer Harassment: Documentation Must Happen Before End of Shift',
        description: 'All customer harassment incidents must be documented before the employee leaves — time, description, what happened.',
        estimatedMinutes: 3,
        steps: [
          'Document before end of shift: time, customer description, what happened, who was affected.',
        ],
        competencyCriteria: ['States documentation must happen before end of shift'],
      },
      {
        id: 'cc-3q-3',
        name: '1.3 Customer Harassment: Repeat Offenders Are Banned (Store Manager Has Final Say)',
        description: 'Repeat offenders are 86\'d/banned from the store. Store Manager has final authority on banning.',
        estimatedMinutes: 3,
        steps: [
          'Repeat offenders are 86\'d/banned — Store Manager has final say.',
        ],
        competencyCriteria: ['States repeat offenders are banned (Store Manager final say)'],
      },
      {
        id: 'cc-3q-4',
        name: '1.3 Customer Harassment: Employee May Leave Early (Still Paid) If Incident Warrants',
        description: 'After a harassment incident, the employee can be offered a break, early out (still paid), or a conversation with the Manager.',
        estimatedMinutes: 3,
        steps: [
          'Check in with the affected New Hire before they leave the shift.',
          'Offer a break, early out (still paid), or to speak with the Store Manager.',
          'Customer satisfaction does not override New Hire safety.',
        ],
        competencyCriteria: ['Knows New Hire may leave early (still paid) if the incident warrants it'],
      },
      {
        id: 'cc-3r',
        name: '1.3 California Harassment Training — Completed & Certificate Filed',
        description: 'Baristas: 1-hour course. Managers/Shift Leads: 2-hour course. Required within 6 months of hire. Certificate saved — CRD cannot email a replacement.',
        estimatedMinutes: 60,
        steps: [
          'Assign and allow New Hire to complete California Harassment Training during Day 1.',
          'Baristas: 1 hour. Managers and Shift Leads: 2 hours.',
          'At the end, New Hire enters their information to generate a certificate.',
          'New Hire must save/print/screenshot/photograph the certificate. CRD CANNOT email a replacement.',
          'Manager files a copy in the employee record.',
        ],
        competencyCriteria: ['California Harassment Training completed; certificate saved and copy filed'],
      },
      // ── 1.4 History, Culture & Aspects of Success ───────────────────────
      {
        id: 'cc-4a-1',
        name: '1.4 Company History Covered (2019, Simi Valley, Hawaiian Theme)',
        description: 'New Hire has been briefed on Makenna Koffee\'s founding story — established 2019, Simi Valley, CA, Hawaiian-themed.',
        estimatedMinutes: 5,
        steps: [
          'COMPANY HISTORY: Makenna Koffee established in 2019 in Simi Valley, CA. Hawaiian-themed coffee shop based on the owner\'s love and relationships with the island\'s vibe and culture.',
        ],
        competencyCriteria: ['Company history covered (2019, Simi Valley, Hawaiian theme)'],
      },
      {
        id: 'cc-4a-2',
        name: '1.4 Fundraiser Culture Explained (20% of Day\'s Sales)',
        description: 'When customers mention a fundraiser, 20% of that day\'s sales go to the fundraiser.',
        estimatedMinutes: 3,
        steps: [
          'CULTURE: Community fundraisers — when customers mention a fundraiser, 20% of that day\'s sales go to the fundraiser.',
        ],
        competencyCriteria: ['Fundraiser culture explained (20% of day\'s sales)'],
      },
      {
        id: 'cc-4a-3',
        name: '1.4 Introduced to Current Team Members',
        description: 'New Hire has been introduced to current team members on Day 1.',
        estimatedMinutes: 5,
        steps: [
          'Make introductions to current team members to promote a supportive team environment.',
        ],
        competencyCriteria: ['Introduced to current team members'],
      },
      {
        id: 'cc-4a-4',
        name: '1.4 Customer Service Video Watched',
        description: 'New Hire has watched the Makenna Koffee Customer Service video on Day 1.',
        estimatedMinutes: 10,
        steps: [
          'Show Customer Service video.',
          'Discuss key takeaways after viewing.',
        ],
        competencyCriteria: ['Customer service video watched'],
      },
      {
        id: 'cc-4b-1',
        name: '1.4 Customer Service: "Customer Is Right" Default Stated with Real Examples',
        description: 'New Hire can explain the customer-first philosophy with concrete examples.',
        estimatedMinutes: 5,
        steps: [
          'Customer service and quality are our top priorities.',
          'Always give the customer the benefit of the doubt.',
          'If their drink is wrong — remake it. If they come in 5 minutes after closing — take their order. If they have an expired free drink card — honor it.',
          'Honor the request first, then notify upper management.',
        ],
        competencyCriteria: ['States the "customer is right/benefit of the doubt" default with real examples'],
      },
      {
        id: 'cc-4b-2',
        name: '1.4 Customer Service: Would Remake Drink, Take Late Order & Honor Expired Card',
        description: 'New Hire confirms they would remake a drink, take an order within 5 min after closing, and honor an expired card without hesitation.',
        estimatedMinutes: 3,
        steps: [
          'Confirm: "If a customer says their drink is wrong, what do you do?" — Remake it.',
          'Confirm: "If a customer comes in 5 minutes after closing, what do you do?" — Take their order.',
          'Confirm: "If a customer has an expired free drink card, what do you do?" — Honor it.',
        ],
        competencyCriteria: ['Confirms they would remake a drink, take a late order, and honor an expired card without hesitation'],
      },
      {
        id: 'cc-4c',
        name: '1.4 Aspect 1 — Customer Service: Greeting Demonstrated',
        description: 'Greet upon entrance: smile, eye contact, say hello within 5 seconds. Ask how their day is going. Resolve concerns. Thank them.',
        estimatedMinutes: 5,
        steps: [
          'Always greet the customer upon entrance: smile, eye contact, say hello.',
          'Ask how their day is going.',
          'Resolve any concerns they may have.',
          'Always thank them for coming in.',
          'If there is any confusion whatsoever — the customer is right.',
        ],
        competencyCriteria: ['Demonstrates Aspect 1 Customer Service greeting: smile, eye contact, hello within 5 seconds'],
      },
      {
        id: 'cc-4d',
        name: '1.4 Aspect 2 — Consistent Quality Product: Accurate Recipes, Full Cup, Clean Cup/Lid',
        description: 'Follow recipes accurately. Every drink: full to the top, clean cup and lid, fresh kona or whipped cream.',
        estimatedMinutes: 5,
        steps: [
          'Always follow the recipes accurately and precisely — look at the iPad recipe book for accuracy.',
          'Take pride in what is handed out.',
          'Every drink must be: full to the top; cup and lid clean; kona or whipped cream fresh and presented beautifully.',
        ],
        competencyCriteria: ['States Aspect 2 elements: accurate recipes, full cup, clean cup/lid, fresh kona/whip'],
      },
      {
        id: 'cc-4e',
        name: '1.4 Aspect 3 — Proactive Ownership: Spotting & Correcting Problems Without Being Asked',
        description: 'Never mindlessly miss a problem. Take proactive ownership of the space and ensure a flawless experience.',
        estimatedMinutes: 5,
        steps: [
          'We never mindlessly miss a problem or fail to correct a mistake.',
          'Take proactive ownership of your space and ensure a flawless experience for every Makenna guest.',
        ],
        competencyCriteria: ['Explains Aspect 3 in own words: proactively spotting and correcting problems without being asked'],
      },
      {
        id: 'cc-4f',
        name: '1.4 Aspect 4 — Immaculate Environment: Never Walk Past a Problem',
        description: 'If you see a mess, clean it up. Do not pass a trash can, dirty table, or spill without handling it.',
        estimatedMinutes: 5,
        steps: [
          'If a New Hire sees a mess — clean it up.',
          'Do not pass by a trash can, dirty table, or any spill (lobby or behind the bar) without handling it.',
          'It is everyone\'s job, at all times, to keep the shop clean.',
        ],
        competencyCriteria: ['States Aspect 4: every team member cleans up messes regardless of role; never walks past a problem'],
      },
      {
        id: 'cc-4g',
        name: '1.4 Aspect 5 — Accountability & Reliability: Shows Up Ready, Takes Initiative',
        description: 'Show up ready. Take initiative. Follow through. Take responsibility. Trust your team.',
        estimatedMinutes: 5,
        steps: [
          'Every Makenna Mafia member takes full ownership of their responsibilities.',
          'Show up ready. Take initiative. Follow through. Take responsibility. Trust your team.',
        ],
        competencyCriteria: ['Explains Aspect 5: shows up ready, takes initiative, follows through, takes responsibility'],
      },
      {
        id: 'cc-4h',
        name: '1.4 Aspect 6 — Vibes: Be Happy, Kind, and the Best You',
        description: 'Be happy. Treat co-workers and customers with kindness and respect. Have a good time. Be the best you.',
        estimatedMinutes: 5,
        steps: [
          'Be happy.',
          'Treat co-workers with kindness and respect.',
          'Treat customers the way you would want to be treated.',
          'Have a good time — life is short, happiness is everything.',
          'Be the best you at all times.',
          'The Makenna Mafia is a TEAM!',
        ],
        competencyCriteria: ['Can state all 6 Aspects of Success without prompting (pocket card given)'],
      },
      {
        id: 'cc-4i-1',
        name: '1.4 Study Materials: Store Menu — Provided',
        description: 'New Hire has been given the store\'s menu to take home and study.',
        estimatedMinutes: 2,
        steps: ['Provide the store\'s menu to the New Hire to take home and study.'],
        competencyCriteria: ['Store menu provided'],
      },
      {
        id: 'cc-4i-2',
        name: '1.4 Study Materials: Training Menu Guide — Provided',
        description: 'New Hire has been given the Training Menu guide.',
        estimatedMinutes: 2,
        steps: ['Provide the Training Menu guide.'],
        competencyCriteria: ['Training menu provided'],
      },
      {
        id: 'cc-4i-3',
        name: '1.4 Study Materials: POS Essentials Card — Provided',
        description: 'New Hire has been given the POS Essentials card.',
        estimatedMinutes: 2,
        steps: ['Provide the POS Essentials card.'],
        competencyCriteria: ['POS Essentials card provided'],
      },
      {
        id: 'cc-4i-4',
        name: '1.4 Study Materials: Aspects of Success / Register Protocol Pocket Card — Provided',
        description: 'New Hire has been given the Aspects of Success / Register Protocol pocket card.',
        estimatedMinutes: 2,
        steps: ['Provide the Aspects of Success / Register Protocol pocket card.'],
        competencyCriteria: ['Aspects of Success / Register Protocol pocket card provided'],
      },
      {
        id: 'cc-4j-1',
        name: '1.4 Day 1 Review Q1: Call-Out Notice & Who to Call — Answered Correctly',
        description: 'Trainer asks: "What is the minimum notice required when calling out, and who do you call?"',
        estimatedMinutes: 2,
        steps: ['Q: What is the minimum notice required when calling out before a shift, and who do you call?', 'A: 2-hour minimum notice; call the Store Manager directly.'],
        competencyCriteria: ['States 2-hour minimum call-out and who to call (Store Manager / Shift Lead)'],
      },
      {
        id: 'cc-4j-2',
        name: '1.4 Day 1 Review Q2: Opening Shifts — Call Store Manager Cell — Answered Correctly',
        description: 'Trainer asks: "For opening shifts, who must you call if you cannot make it?"',
        estimatedMinutes: 2,
        steps: ['Q: For opening shifts, who must the New Hire call if they cannot make their shift?', 'A: Call the Store Manager\'s cell directly — no exceptions.'],
        competencyCriteria: ['States opening shifts call Store Manager cell'],
      },
      {
        id: 'cc-4j-3',
        name: '1.4 Day 1 Review Q3: Meal Break Rule & Waiver Condition — Answered Correctly',
        description: 'Trainer asks: "Explain the California meal break rule — when must it begin, and under what condition can it be waived?"',
        estimatedMinutes: 2,
        steps: ['Q: Explain the California meal break rule: when must it begin, and under what condition can it be waived?', 'A: Must begin before the end of the 5th hour; can be waived only on shifts of 6 hours or less (voluntary).'],
        competencyCriteria: ['Explains meal break rule and waiver condition (≤ 6 hrs, voluntary)'],
      },
      {
        id: 'cc-4j-4',
        name: '1.4 Day 1 Review Q4: 10-Min Rest Breaks Cannot Be Waived — Answered Correctly',
        description: 'Trainer asks: "Can a 10-minute rest break be waived? Why or why not?"',
        estimatedMinutes: 2,
        steps: ['Q: Can a 10-minute rest break be waived? Why or why not?', 'A: No. Rest breaks cannot be waived — they are a California labor law requirement.'],
        competencyCriteria: ['States rest breaks cannot be waived'],
      },
      {
        id: 'cc-4j-5',
        name: '1.4 Day 1 Review Q5: At Least 4 of 6 Aspects of Success Named',
        description: 'Trainer asks: "Name 4 out of the 6 Aspects of Success at Makenna Koffee."',
        estimatedMinutes: 2,
        steps: ['Q: Name 4 out of the 6 Aspects of Success at Makenna Koffee.', 'A: Customer Service, Consistent Quality Product, Proactive Ownership, Immaculate Environment, Accountability & Reliability, Vibes.'],
        competencyCriteria: ['Names at least 4 of the 6 Aspects of Success without prompting'],
      },
      {
        id: 'cc-4j-6',
        name: '1.4 Day 1 Review Q6: On-Clock Drink Benefit Stated Correctly',
        description: 'Trainer asks: "What are your drink benefits while on the clock?"',
        estimatedMinutes: 2,
        steps: ['Q: What are the New Hire drink benefits while on the clock?', 'A: 1 before the shift, 1 during each break, 1 after the shift. Must be rung with a label.'],
        competencyCriteria: ['States on-clock drink benefit (before shift, per break, after shift)'],
      },
      {
        id: 'cc-4j-7',
        name: '1.4 Day 1 Review Q7: Split Shift Defined & Pre-Approval Stated',
        description: 'Trainer asks: "What is a split shift, and when must it be pre-approved?"',
        estimatedMinutes: 2,
        steps: ['Q: What is a split shift and when must it be pre-approved?', 'A: Two shifts in one day with 60+ minutes off between them. Must be pre-approved by the Store Manager.'],
        competencyCriteria: ['Defines split shift and pre-approval requirement'],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'food-safety-pos',
    name: 'Food Safety & POS',
    description: 'Section 2 (Day 2) — Temperature logs, 3-compartment sink, sanitizer buckets, allergen control, FIFO rotation, breakfast item thaw protocol, employee health reporting, and Square POS operations.',
    order: 2,
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      // ── 2.1 Food Safety ──────────────────────────────────────────────────
      // fs-1 split: 3 criteria → fs-1-1, fs-1-2, fs-1-3
      {
        id: 'fs-1-1',
        name: '2.1 Temperature & Cold-Hold — 41°F Limit',
        description: 'Cold holding must be 41°F or below at all times.',
        estimatedMinutes: 5,
        steps: [
          'Demonstrate how to check cold-holding temperatures in the fridges.',
          'Critical point: cold holding must be 41°F or below at all times.',
          'Show how to verify thermometers are working and confirm none are missing.',
          'Never leave milk and dairy out longer than 1 hour cumulative.',
          'If shift lead: show how to use a probe thermometer to verify temperatures.',
        ],
        competencyCriteria: [
          'States the 41°F cold-hold limit',
        ],
      },
      {
        id: 'fs-1-2',
        name: '2.1 Temperature & Cold-Hold — Thermometer Verification',
        description: 'Demonstrate how to verify a fridge thermometer is reading correctly.',
        estimatedMinutes: 5,
        steps: [
          'Show how to verify thermometers are working and confirm none are missing.',
          'If shift lead: show how to use a probe thermometer to verify temperatures.',
        ],
        competencyCriteria: [
          'Demonstrates how to verify a fridge thermometer is reading correctly',
        ],
      },
      {
        id: 'fs-1-3',
        name: '2.1 Temperature & Cold-Hold — 1-Hour Dairy-Out Rule',
        description: 'Never leave milk and dairy out longer than 1 hour cumulative.',
        estimatedMinutes: 5,
        steps: [
          'Never leave milk and dairy out longer than 1 hour cumulative.',
        ],
        competencyCriteria: [
          'States the 1-hour cumulative dairy-out rule',
        ],
      },
      // fs-2 split: 3 criteria → fs-2-1, fs-2-2, fs-2-3
      {
        id: 'fs-2-1',
        name: '2.1 3-Compartment Sink — 4-Step Order (Wash → Rinse → Sanitize → Air-Dry)',
        description: 'Performs the 4 steps in correct order: wash → rinse → sanitize → air-dry.',
        estimatedMinutes: 7,
        steps: [
          'Before washing: demonstrate rinsing off residue first.',
          'Step 1 — Wash: hot soapy water.',
          'Step 2 — Rinse: clean water.',
          'Step 3 — Sanitize: correct concentration.',
          'Step 4 — Air dry. NEVER towel-dry.',
          'Hands-on practice: New Hire fills and empties each sink.',
        ],
        competencyCriteria: [
          'Performs the 4 steps in correct order: wash → rinse → sanitize → air-dry',
        ],
      },
      {
        id: 'fs-2-2',
        name: '2.1 3-Compartment Sink — Rinse Residue Before Washing',
        description: 'Rinse off residue before placing items in the wash sink.',
        estimatedMinutes: 7,
        steps: [
          'Before washing: demonstrate rinsing off residue first.',
        ],
        competencyCriteria: [
          'Rinses off residue before washing',
        ],
      },
      {
        id: 'fs-2-3',
        name: '2.1 3-Compartment Sink — Air-Dry Only, Never Towel-Dry',
        description: 'Air-dries only; never towel-dries after the sanitize step.',
        estimatedMinutes: 6,
        steps: [
          'Step 4 — Air dry. NEVER towel-dry.',
        ],
        competencyCriteria: [
          'Air-dries only; never towel-dries',
        ],
      },
      // fs-3 split: 3 criteria → fs-3-1, fs-3-2, fs-3-3
      {
        id: 'fs-3-1',
        name: '2.1 Sanitizer Prep — Mix to 100 ppm with Clorox',
        description: 'Mixes sanitizer bucket to 100 ppm using Clorox.',
        estimatedMinutes: 5,
        steps: [
          'New Hire prepares a sanitizer bucket targeting 100 ppm concentration using Clorox.',
          'Use a test strip to verify correct concentration before any use.',
          'Chlorine: 50–200 ppm range.',
          'Quaternary ammonia: follow manufacturer instructions.',
          'Show New Hire where test strips are stored.',
        ],
        competencyCriteria: [
          'Mixes sanitizer bucket to 100 ppm using Clorox',
        ],
      },
      {
        id: 'fs-3-2',
        name: '2.1 Sanitizer Prep — Test Strip Verification (50–200 ppm)',
        description: 'Verifies sanitizer concentration with a test strip within the 50–200 ppm chlorine range.',
        estimatedMinutes: 5,
        steps: [
          'Use a test strip to verify correct concentration before any use.',
          'Chlorine: 50–200 ppm range.',
        ],
        competencyCriteria: [
          'Verifies concentration with a test strip (chlorine 50–200 ppm range)',
        ],
      },
      {
        id: 'fs-3-3',
        name: '2.1 Sanitizer Prep — Test Strip Storage Location',
        description: 'Knows where test strips are stored in the store.',
        estimatedMinutes: 5,
        steps: [
          'Show New Hire where test strips are stored.',
        ],
        competencyCriteria: [
          'Knows where test strips are stored',
        ],
      },
      // fs-4a unchanged (1 criterion)
      {
        id: 'fs-4a',
        name: '2.1 Sanitizing Bucket Setup — RED (Counter)',
        description: 'RED bucket: counter sanitizing. Fill to line 2 (~⅔ full). One rag per bucket.',
        estimatedMinutes: 5,
        steps: [
          'Locate the RED sanitizing bucket.',
          'Fill to line 2 — approximately ⅔ full — with sanitizer solution.',
          'Place ONE rag per bucket. Use new rags at the start of every day.',
        ],
        competencyCriteria: ['RED bucket filled to line 2 (~⅔ full) with correct sanitizer; one rag placed'],
      },
      // fs-4b unchanged (1 criterion)
      {
        id: 'fs-4b',
        name: '2.1 Sanitizing Bucket Setup — WHITE (Steam Wand)',
        description: 'WHITE bucket: steaming wand sanitizing. Fill to line 1 (~⅓ full). Replace every 30 minutes if possible.',
        estimatedMinutes: 5,
        steps: [
          'Locate the WHITE sanitizing bucket.',
          'Fill to line 1 — approximately ⅓ full — with sanitizer solution.',
          'Place ONE rag per bucket.',
          'The steam wand bucket should be replaced every 30 minutes if possible.',
        ],
        competencyCriteria: ['WHITE bucket filled to line 1 (~⅓ full) with correct sanitizer; one rag placed'],
      },
      // fs-4c split: 5 criteria → fs-4c-1 through fs-4c-5
      {
        id: 'fs-4c-1',
        name: '2.1 Sanitizing Bucket Replacement — 2-Hour Minimum Rule',
        description: 'States the 2-hour minimum replacement rule for all sanitizing buckets and rags.',
        estimatedMinutes: 2,
        steps: [
          'All sanitizing buckets must be emptied, rinsed, and refilled every 2 hours minimum.',
          'Rags must also be rinsed and reused every 2 hours minimum.',
          'EARLY REPLACEMENT TRIGGER: if water looks cloudy, greasy, or dirty — replace immediately regardless of the timer.',
          'Immediately discard and replace any rag that is soiled, greasy, or has touched an unsanitized surface (e.g., the floor).',
          'Reset timers every time a bucket or rag is refreshed.',
          'Chemicals must be stored away from all food preparation areas.',
        ],
        competencyCriteria: [
          'States the 2-hour minimum replacement rule for buckets and rags',
        ],
      },
      {
        id: 'fs-4c-2',
        name: '2.1 Sanitizing Bucket Replacement — Early Trigger (Cloudy/Greasy/Dirty)',
        description: 'States the early replacement trigger: replace immediately if water is cloudy, greasy, or dirty — ignore the timer.',
        estimatedMinutes: 2,
        steps: [
          'EARLY REPLACEMENT TRIGGER: if water looks cloudy, greasy, or dirty — replace immediately regardless of the timer.',
        ],
        competencyCriteria: [
          'States early replacement trigger: cloudy/greasy/dirty water — replace immediately, ignore the timer',
        ],
      },
      {
        id: 'fs-4c-3',
        name: '2.1 Sanitizing Bucket Replacement — Discard Rag After Floor Contact',
        description: 'States to discard a rag immediately if it touches the floor or any unsanitized surface.',
        estimatedMinutes: 2,
        steps: [
          'Immediately discard and replace any rag that is soiled, greasy, or has touched an unsanitized surface (e.g., the floor).',
        ],
        competencyCriteria: [
          'States to discard a rag immediately if it touches the floor or an unsanitized surface',
        ],
      },
      {
        id: 'fs-4c-4',
        name: '2.1 Sanitizing Bucket Replacement — Reset Timer After Every Change',
        description: 'Resets the timer every time a bucket or rag is refreshed.',
        estimatedMinutes: 2,
        steps: [
          'Reset timers every time a bucket or rag is refreshed.',
        ],
        competencyCriteria: [
          'Resets timer after every bucket or rag change',
        ],
      },
      {
        id: 'fs-4c-5',
        name: '2.1 Sanitizing Bucket Replacement — Chemical Storage Away from Food Prep',
        description: 'Knows that chemicals must be stored away from all food preparation areas.',
        estimatedMinutes: 2,
        steps: [
          'Chemicals must be stored away from all food preparation areas.',
        ],
        competencyCriteria: [
          'Knows chemicals must be stored away from food prep areas',
        ],
      },
      // fs-5 split: 3 criteria → fs-5-1, fs-5-2, fs-5-3
      {
        id: 'fs-5-1',
        name: '2.1 Allergen Control — Name All 5 Major Allergens',
        description: 'Names all 5 major allergens carried at Makenna: Milk, Eggs, Wheat, Soy, and Peanut butter.',
        estimatedMinutes: 5,
        steps: [
          'Review Major Allergens carried at Makenna: Milk (dairy), Eggs (in breakfast items), Wheat (in pastries), Soy (in soy milk), Peanut butter (in Pb No J and protein shakes).',
          'Demonstrate how to use separate utensils when possible.',
          'Show the dedicated blue and/or marked blender cup — used for allergen-sensitive drinks.',
          'Tell customers clearly: Makenna is NOT a nut-free or gluten-free facility.',
        ],
        competencyCriteria: [
          'Names all 5 major allergens carried at Makenna (Milk, Eggs, Wheat, Soy, Peanut butter)',
        ],
      },
      {
        id: 'fs-5-2',
        name: '2.1 Allergen Control — Use the Dedicated Blue/Marked Blender Cup',
        description: 'Demonstrates use of the dedicated blue/marked blender cup for allergen-sensitive orders.',
        estimatedMinutes: 5,
        steps: [
          'Show the dedicated blue and/or marked blender cup — used for allergen-sensitive drinks.',
          'Demonstrate how to use separate utensils when possible.',
        ],
        competencyCriteria: [
          'Demonstrates use of the dedicated blue/marked blender cup for allergen orders',
        ],
      },
      {
        id: 'fs-5-3',
        name: '2.1 Allergen Control — Inform Customers: Not Nut-Free or Gluten-Free',
        description: 'Can accurately inform a customer that Makenna is not a nut-free or gluten-free facility.',
        estimatedMinutes: 5,
        steps: [
          'Tell customers clearly: Makenna is NOT a nut-free or gluten-free facility.',
        ],
        competencyCriteria: [
          'Can accurately inform a customer that Makenna is not nut-free or gluten-free',
        ],
      },
      // fs-6 split: 3 criteria → fs-6-1, fs-6-2, fs-6-3
      {
        id: 'fs-6-1',
        name: '2.1 FIFO Rotation — New Product Goes Behind Old',
        description: 'Demonstrates FIFO restock for milk, syrups, and pastries by placing new products behind older products.',
        estimatedMinutes: 5,
        steps: [
          'Discuss the importance of First In, First Out (FIFO).',
          'New Hire demonstrates FIFO for milk, syrups, and pastries — new products behind older products.',
          'SYRUP RULE: Continue using a syrup bottle until the pump can no longer extract liquid. Do not replace a bottle with usable product remaining.',
          'If a bottle is nearly empty during a rush, you may discard the remaining syrup into another bottle of the EXACT same flavor.',
        ],
        competencyCriteria: [
          'Demonstrates FIFO restock for milk, syrups, and pastries (new behind old)',
        ],
      },
      {
        id: 'fs-6-2',
        name: '2.1 FIFO Rotation — Do Not Replace a Syrup Bottle with Usable Product',
        description: 'States not to replace a syrup bottle that still has usable product remaining.',
        estimatedMinutes: 5,
        steps: [
          'SYRUP RULE: Continue using a syrup bottle until the pump can no longer extract liquid. Do not replace a bottle with usable product remaining.',
        ],
        competencyCriteria: [
          'States not to replace a syrup bottle that still has usable product',
        ],
      },
      {
        id: 'fs-6-3',
        name: '2.1 FIFO Rotation — Rush Exception: Combine Same-Flavor Syrup Bottles',
        description: 'States the emergency exception: during a rush, may combine same-flavor syrup bottles to avoid waste.',
        estimatedMinutes: 5,
        steps: [
          'If a bottle is nearly empty during a rush, you may discard the remaining syrup into another bottle of the EXACT same flavor.',
        ],
        competencyCriteria: [
          'States the emergency exception: may combine same-flavor syrup bottles during a rush',
        ],
      },
      // fs-7a split: 4 criteria → fs-7a-1 through fs-7a-4
      {
        id: 'fs-7a-1',
        name: '2.1 Breakfast Item FIFO — Shift Lead Verifies Delivery Against Invoice',
        description: 'States that the Shift Lead must verify the delivery against the invoice and initial it.',
        estimatedMinutes: 3,
        steps: [
          'Breakfast items are delivered frozen and stored in the freezer.',
          'SHIFT LEAD DELIVERY PROTOCOL: Upon delivery, verify shipment against the invoice. Initial paperwork/receipt and leave in the hanging wall file.',
          'Count cases in storage fridge and thawing fridge. Refill from freezer, placing new cases BEHIND existing cases (FIFO).',
          'Before placing new cases, check the label for "Good for X days after thawing." Write the Use By Date on the box (e.g., thawed 03/29, good 7 days → "Use By: 04/05").',
          'Every morning: check storage fridge, replenish as needed, toss expired items.',
          'After restocking: note quantities added in POS to update inventory for accurate mobile ordering.',
        ],
        competencyCriteria: [
          'States Shift Lead must verify delivery against the invoice and initial it',
        ],
      },
      {
        id: 'fs-7a-2',
        name: '2.1 Breakfast Item FIFO — Write Use By Date on Boxes After Thawing',
        description: 'Correctly writes the Use By Date on breakfast item boxes after thawing.',
        estimatedMinutes: 3,
        steps: [
          'Before placing new cases, check the label for "Good for X days after thawing." Write the Use By Date on the box (e.g., thawed 03/29, good 7 days → "Use By: 04/05").',
        ],
        competencyCriteria: [
          'Correctly writes Use By Date on boxes after thawing',
        ],
      },
      {
        id: 'fs-7a-3',
        name: '2.1 Breakfast Item FIFO — New Cases Behind Existing Cases',
        description: 'Demonstrates correct FIFO placement by putting new cases behind existing cases in the fridge.',
        estimatedMinutes: 2,
        steps: [
          'Count cases in storage fridge and thawing fridge. Refill from freezer, placing new cases BEHIND existing cases (FIFO).',
        ],
        competencyCriteria: [
          'Demonstrates FIFO placement (new cases behind existing)',
        ],
      },
      {
        id: 'fs-7a-4',
        name: '2.1 Breakfast Item FIFO — Update POS Inventory After Restocking',
        description: 'States to update POS inventory after restocking to keep mobile ordering accurate.',
        estimatedMinutes: 2,
        steps: [
          'After restocking: note quantities added in POS to update inventory for accurate mobile ordering.',
        ],
        competencyCriteria: [
          'States to update POS inventory after restocking',
        ],
      },
      // fs-7b unchanged (1 criterion)
      {
        id: 'fs-7b',
        name: '2.1 Breakfast Item Thaw — Sandwiches',
        description: 'Sandwiches: cut top flaps, stay in original box. Thaw time: 12 hours. Pull time: 4–6 PM daily. Write expiration date on box.',
        estimatedMinutes: 5,
        steps: [
          'Cut the top flaps of the sandwich box.',
          'Sandwiches can remain in their original box while thawing.',
          'Write the expiration date on the box.',
          'Thaw time: 12 hours.',
          'Pull time: between 4 PM and 6 PM daily.',
        ],
        competencyCriteria: ['States sandwich thaw protocol: 12-hour thaw, pull 4–6 PM, date written on box'],
      },
      // fs-7c unchanged (1 criterion)
      {
        id: 'fs-7c',
        name: '2.1 Breakfast Item Thaw — Burritos',
        description: 'Burritos: remove from box, spread out in thawing fridge (not touching). Thaw time: 24 hrs (48 hrs if cannot spread). Pull time: 6:30–8 AM daily.',
        estimatedMinutes: 5,
        steps: [
          'Remove burritos from the box and spread out in the thawing fridge.',
          'Burritos must NOT be in close proximity or on top of each other — they need airflow to thaw faster.',
          'Write the last day to use on the box and place note on top of the box.',
          'Thaw time: 24 hours. If unable to spread burritos, thaw time is 48 hours.',
          'Pull time: between 6:30 AM and 8 AM daily.',
          'After thawing: if storage fridge and thawing fridge are different, move items to storage fridge.',
        ],
        competencyCriteria: ['States burrito thaw protocol: spread out, 24-hr thaw (48 if not spread), pull 6:30–8 AM, date on box'],
      },
      // fs-8 split: 2 criteria → fs-8-1, fs-8-2
      {
        id: 'fs-8-1',
        name: '2.1 Employee Health Reporting — List All 5 Mandatory Reportable Conditions',
        description: 'Lists all 5 mandatory reportable conditions: Vomiting, Diarrhea, Fever with sore throat, Jaundice, Diagnosed foodborne illness.',
        estimatedMinutes: 5,
        steps: [
          'The 5 mandatory reportable conditions: (1) Vomiting, (2) Diarrhea, (3) Fever with sore throat, (4) Jaundice, (5) Diagnosed foodborne illness.',
          'If any symptom is present: call the Store Manager BEFORE the shift — do not come in.',
          'Manager excludes the employee from work, documents the incident, and follows county health guidance.',
        ],
        competencyCriteria: [
          'Lists all 5 mandatory reportable conditions',
        ],
      },
      {
        id: 'fs-8-2',
        name: '2.1 Employee Health Reporting — Call Store Manager BEFORE the Shift',
        description: 'States to call the Store Manager BEFORE the shift, not after arriving.',
        estimatedMinutes: 5,
        steps: [
          'If any symptom is present: call the Store Manager BEFORE the shift — do not come in.',
        ],
        competencyCriteria: [
          'States to call Store Manager BEFORE the shift, not after arriving',
        ],
      },
      // ── 2.2 POS System Operations ─────────────────────────────────────────
      // fs-9 split: 3 criteria → fs-9-1, fs-9-2, fs-9-3
      {
        id: 'fs-9-1',
        name: '2.2 Register Greeting — Delivers All 5 Steps in Order',
        description: 'Delivers all 5 greeting steps in correct order without prompting.',
        estimatedMinutes: 7,
        steps: [
          'Step 1 — Warm Greeting: "Hey, what\'s up" / "Good morning/afternoon" / "Great to see you guys"',
          'Step 2 — Ask about their Well-Being: "How are you?" / "How\'s your day?"',
          'Step 3 — Initiate the Transaction: "What can we get you?" / "What are we doing for you today?"',
          'Step 4 — Personal Connection (MANDATORY, best after giving total): Offer a compliment (clothing, jewelry, nails, hair — must be appropriate) OR ask an engaging question ("What do you guys have planned for the weekend?")',
          'Step 5 — Kindly Conclude: "Thank you so much!" / "Have an amazing day!" / "Hope you guys have fun!"',
          'Role-play the full 5-step greeting with New Hire. Trainer gives feedback.',
        ],
        competencyCriteria: [
          'Delivers all 5 steps in correct order without prompting',
        ],
      },
      {
        id: 'fs-9-2',
        name: '2.2 Register Greeting — Genuine Personal Connection at the Right Moment (Step 4)',
        description: 'Delivers a genuine personal connection (Step 4) at the appropriate moment in the greeting.',
        estimatedMinutes: 7,
        steps: [
          'Step 4 — Personal Connection (MANDATORY, best after giving total): Offer a compliment (clothing, jewelry, nails, hair — must be appropriate) OR ask an engaging question ("What do you guys have planned for the weekend?")',
          'Role-play the full 5-step greeting with New Hire. Trainer gives feedback.',
        ],
        competencyCriteria: [
          'Delivers a genuine personal connection (Step 4) at the appropriate moment',
        ],
      },
      {
        id: 'fs-9-3',
        name: '2.2 Register Greeting — Warm and Genuine Conclusion (Step 5)',
        description: 'Concludes the greeting warmly and genuinely with Step 5.',
        estimatedMinutes: 6,
        steps: [
          'Step 5 — Kindly Conclude: "Thank you so much!" / "Have an amazing day!" / "Hope you guys have fun!"',
          'Role-play the full 5-step greeting with New Hire. Trainer gives feedback.',
        ],
        competencyCriteria: [
          'Concludes warmly and genuinely (Step 5)',
        ],
      },
      // fs-10a split: 4 criteria → fs-10a-1 through fs-10a-4
      {
        id: 'fs-10a-1',
        name: '2.2 Espresso Drinks — Supreme vs. Americano Distinction',
        description: 'Distinguishes a Supreme (latte, iced/hot) from an Americano (espresso + water).',
        estimatedMinutes: 5,
        steps: [
          'SUPREME: contain espresso/coffee; can be decaf or half-caf. Choices: Size + Iced or Hot. Vast majority of orders — these are lattes.',
          'AMERICANOS: espresso + water; can be decaf or half-caf. Choices: Size + Iced or Hot.',
          '"Made As Normal" on the register/ticket = whole milk (sometimes splash of half/half or Maui Milk).',
        ],
        competencyCriteria: [
          'Distinguishes Supreme (latte, iced/hot) from Americano (espresso+water)',
        ],
      },
      {
        id: 'fs-10a-2',
        name: '2.2 Espresso Drinks — Chillers Are Blended; Shaken Espresso Is Always Iced',
        description: 'States that Chillers are always blended and Shaken Espresso is always iced.',
        estimatedMinutes: 5,
        steps: [
          'CHILLERS: blended with espresso/coffee; can be decaf or half-caf. Choices: Size + Whip Cream or No Whip Cream.',
          'HAND SHAKEN ESPRESSO: contain espresso/coffee; can be decaf or half-caf. Size only — always iced (shaken with flavors and ice, cannot be hot).',
        ],
        competencyCriteria: [
          'States Chillers are always blended; Shaken Espresso is always iced',
        ],
      },
      {
        id: 'fs-10a-3',
        name: '2.2 Espresso Drinks — No Decaf/Half-Caf for Drip or Cold Brew',
        description: 'States that decaf and half-caf options are not available for Drip or Cold Brew.',
        estimatedMinutes: 5,
        steps: [
          'None of the above applies to Drip or Cold Brew — always caffeinated, no decaf/half-caf option.',
        ],
        competencyCriteria: [
          'States decaf/half-caf is not available for Drip or Cold Brew',
        ],
      },
      {
        id: 'fs-10a-4',
        name: '2.2 Espresso Drinks — What "Made As Normal" Means',
        description: 'States what "Made As Normal" means on the register/ticket (whole milk, sometimes half-and-half or Maui Milk).',
        estimatedMinutes: 5,
        steps: [
          '"Made As Normal" on the register/ticket = whole milk (sometimes splash of half/half or Maui Milk).',
        ],
        competencyCriteria: [
          'States what "Made As Normal" means',
        ],
      },
      // fs-10b split: 5 criteria → fs-10b-1 through fs-10b-5
      {
        id: 'fs-10b-1',
        name: '2.2 Non-Coffee Drinks — Slushy Energy Cannot Be Sugar Free',
        description: 'States that a Slushy Energy drink cannot be made sugar free.',
        estimatedMinutes: 4,
        steps: [
          'MAKENNA ENERGY: contains caffeine. Choices: Size + Iced or Slushy. SLUSHY CANNOT BE SUGAR FREE. Iced Red Bull only in Medium–XL; Slushy available in all sizes.',
        ],
        competencyCriteria: [
          'States Slushy Energy cannot be made sugar free',
        ],
      },
      {
        id: 'fs-10b-2',
        name: '2.2 Non-Coffee Drinks — Default Tea Is Green Tea',
        description: 'States that when no tea is specified by the customer, the default is Green Tea.',
        estimatedMinutes: 4,
        steps: [
          'CHAI/TEAS/REFRESHERS: no coffee (but may contain caffeine). Chais/Matchas: Size + Iced or Hot. Teas/Refreshers: Size + Tea choice (default = Green Tea if not specified).',
          'Available teas: Green (caffeinated), Black (caffeinated), Hibiscus (non-caffeinated). Hot teas also available.',
        ],
        competencyCriteria: [
          'States default tea when none specified (Green Tea)',
        ],
      },
      {
        id: 'fs-10b-3',
        name: '2.2 Non-Coffee Drinks — Drink Sizes, Ounces, and Shot Counts',
        description: 'Recites drink sizes, ounces, and shot counts for all 4 sizes: Small, Medium, Large, and X-tra Large.',
        estimatedMinutes: 4,
        steps: [
          'Drink sizes: Small 12oz (1 shot), Medium 16oz (2 shots), Large 24oz iced/20oz hot (2 shots + free 3rd), X-tra Large 32oz iced only (4 shots).',
        ],
        competencyCriteria: [
          'Recites drink sizes, ounces, and shot counts for all 4 sizes',
        ],
      },
      {
        id: 'fs-10b-4',
        name: '2.2 Non-Coffee Drinks — Free 3rd Shot on Large Drinks',
        description: 'Explains that Large drinks include a free 3rd shot of espresso.',
        estimatedMinutes: 4,
        steps: [
          'Drink sizes: Small 12oz (1 shot), Medium 16oz (2 shots), Large 24oz iced/20oz hot (2 shots + free 3rd), X-tra Large 32oz iced only (4 shots).',
        ],
        competencyCriteria: [
          'Explains the free 3rd shot on Large drinks',
        ],
      },
      {
        id: 'fs-10b-5',
        name: '2.2 Non-Coffee Drinks — No Decaf/Half-Caf/No-Coffee for Drip or Cold Brew',
        description: 'States that decaf, half-caf, and no-coffee customizations are not available for Drip or Cold Brew.',
        estimatedMinutes: 4,
        steps: [
          'Customizations: Decaf (very little caffeine), Half-Caf (half caffeine), No Coffee (no caffeine). Do NOT apply to Drip or Cold Brew.',
        ],
        competencyCriteria: [
          'States decaf/half-caf/no-coffee customizations are not available for Drip or Cold Brew',
        ],
      },
      // fs-10c split: 4 criteria → fs-10c-1 through fs-10c-4
      {
        id: 'fs-10c-1',
        name: '2.2 Maui Milk — Recite All 4 Talking Points',
        description: 'Recites all 4 Maui Milk talking points without prompting: secret recipe, melted vanilla ice cream, sweet, dairy-based.',
        estimatedMinutes: 3,
        steps: [
          'MAUI MILK — 4 talking points only (never reveal actual ingredients):',
          '  1. It\'s a secret recipe.',
          '  2. It tastes like melted vanilla ice cream.',
          '  3. It\'s sweet.',
          '  4. "Dairy-based" — MOST IMPORTANT for customers with lactose intolerance or dairy allergy.',
          'Never say "oh it looks like it\'s…" — only describe using the 4 points above.',
          'Maui Chillers and all drinks with Maui Milk contain dairy. Non-dairy substitutes: Maui Latte → suggest regular latte; Maui Mocha Chiller → suggest Mocha Chiller.',
        ],
        competencyCriteria: [
          'Recites all 4 Maui Milk talking points without prompting',
        ],
      },
      {
        id: 'fs-10c-2',
        name: '2.2 Maui Milk — "Dairy-Based" Is the Critical Allergy Point',
        description: 'States "dairy-based" as the most critical talking point for customers with allergy concerns.',
        estimatedMinutes: 3,
        steps: [
          '  4. "Dairy-based" — MOST IMPORTANT for customers with lactose intolerance or dairy allergy.',
        ],
        competencyCriteria: [
          'States "dairy-based" as the most critical point for allergy customers',
        ],
      },
      {
        id: 'fs-10c-3',
        name: '2.2 Maui Milk — Never Reveal Actual Ingredients',
        description: 'Knows not to reveal actual Maui Milk ingredients under any circumstances.',
        estimatedMinutes: 2,
        steps: [
          'Never say "oh it looks like it\'s…" — only describe using the 4 points above.',
        ],
        competencyCriteria: [
          'Knows NOT to reveal actual ingredients under any circumstances',
        ],
      },
      {
        id: 'fs-10c-4',
        name: '2.2 Maui Milk — Non-Dairy Substitutes for Maui Milk Drinks',
        description: 'States the non-dairy substitutes for Maui Milk drinks (Maui Latte → regular latte; Maui Mocha Chiller → Mocha Chiller).',
        estimatedMinutes: 2,
        steps: [
          'Maui Chillers and all drinks with Maui Milk contain dairy. Non-dairy substitutes: Maui Latte → suggest regular latte; Maui Mocha Chiller → suggest Mocha Chiller.',
        ],
        competencyCriteria: [
          'States the non-dairy substitutes for Maui Milk drinks',
        ],
      },
      // fs-10d split: 4 criteria → fs-10d-1 through fs-10d-4
      {
        id: 'fs-10d-1',
        name: '2.2 Specialty Items — Kona Cloud (Sweet Cold Foam, Dairy, Oat Option)',
        description: 'Describes Kona Cloud correctly: sweet cold foam, contains dairy, Oat version available on request.',
        estimatedMinutes: 5,
        steps: [
          'KONA CLOUD: sweet cold foam on top of any drink; slowly mixes in. Contains dairy. Non-dairy Oat Kona Cloud available but must be specified. Use By Date: 2 weeks from made date (written on dispenser lid).',
          'BREVE: half and half.',
          'OREGON CHAI: combination of Vanilla Chai and Spice Chai — half and half of each.',
          'SUMMER LATTE: our vanilla latte.',
          'WARM COCOA: our hot chocolate. Kid\'s temperature available.',
          'TEMPERATURES: Kid\'s = 120°F, Regular = 150°F, Extra Hot = 160°F.',
          'HEART ATTACK: 4 shots in Medium and Large; 6 shots in X-tra Large. NO Small Heart Attack available.',
          'HIPPIE GOAT: lavender and vanilla latte with lavender buds on top. Always ask customer if they are OK with lavender buds. If no buds, type in drink notes section.',
          'WHERE DO OUR BEANS COME FROM? Central America, South America, and occasionally other regions.',
        ],
        competencyCriteria: [
          'Describes Kona Cloud correctly (sweet cold foam, dairy; Oat version available on request)',
        ],
      },
      {
        id: 'fs-10d-2',
        name: '2.2 Specialty Items — 3 Drink Temperatures (120°F / 150°F / 160°F)',
        description: 'States the 3 drink temperature levels: Kid\'s = 120°F, Regular = 150°F, Extra Hot = 160°F.',
        estimatedMinutes: 5,
        steps: [
          'TEMPERATURES: Kid\'s = 120°F, Regular = 150°F, Extra Hot = 160°F.',
        ],
        competencyCriteria: [
          'States the 3 drink temperatures (120°F / 150°F / 160°F)',
        ],
      },
      {
        id: 'fs-10d-3',
        name: '2.2 Specialty Items — Heart Attack Shot Counts (4 for M/L; 6 for XL; No Small)',
        description: 'States Heart Attack shot counts correctly: 4 shots for Medium and Large, 6 shots for X-tra Large, no Small available.',
        estimatedMinutes: 5,
        steps: [
          'HEART ATTACK: 4 shots in Medium and Large; 6 shots in X-tra Large. NO Small Heart Attack available.',
        ],
        competencyCriteria: [
          'States Heart Attack shot counts correctly (4 for M/L; 6 for XL; no Small)',
        ],
      },
      {
        id: 'fs-10d-4',
        name: '2.2 Specialty Items — Hippie Goat Lavender Bud Protocol',
        description: 'States the Hippie Goat lavender bud protocol: always ask the customer; note if no buds in the drink notes section.',
        estimatedMinutes: 5,
        steps: [
          'HIPPIE GOAT: lavender and vanilla latte with lavender buds on top. Always ask customer if they are OK with lavender buds. If no buds, type in drink notes section.',
        ],
        competencyCriteria: [
          'States the Hippie Goat lavender bud protocol (always ask; notes if no buds)',
        ],
      },
      // fs-10e split: 2 criteria → fs-10e-1, fs-10e-2
      {
        id: 'fs-10e-1',
        name: '2.2 Just Espresso on Register — Select Both Milk Type AND Ounces',
        description: 'Knows to select both milk type AND ounces for Just Espresso milk add-ons or the customer is not charged.',
        estimatedMinutes: 5,
        steps: [
          'JUST ESPRESSO on the register: if customer wants milk, scroll down to the milk section.',
          'Must select BOTH milk type AND ounces — otherwise customer is not charged for milk.',
          'Milk options: Non-dairy milks, Maui Milk, Dairy milks (including half/half).',
          'Non-dairy milks offered: Oat, Almond, Coconut, Macadamia, Soy.',
          'CUSTOMIZATIONS: Decaf, Half-Caf, No Coffee — not available for Drip or Cold Brew.',
          'PROTEIN SHAKES: nonfat milk, one size only.',
        ],
        competencyCriteria: [
          'Knows to select both milk type AND ounces for Just Espresso milk add-ons',
        ],
      },
      {
        id: 'fs-10e-2',
        name: '2.2 Just Espresso on Register — List Available Non-Dairy Milks',
        description: 'Lists available non-dairy milk options: Oat, Almond, Coconut, Macadamia, and Soy.',
        estimatedMinutes: 5,
        steps: [
          'Non-dairy milks offered: Oat, Almond, Coconut, Macadamia, Soy.',
        ],
        competencyCriteria: [
          'Lists available non-dairy milks (Oat, Almond, Coconut, Macadamia, Soy)',
        ],
      },
      // fs-11a split: 4 criteria → fs-11a-1 through fs-11a-4
      {
        id: 'fs-11a-1',
        name: '2.2 Register Payments — Process a Card Payment (Tap/Insert/Swipe)',
        description: 'Processes a card payment using tap, insert, or swipe without prompting.',
        estimatedMinutes: 5,
        steps: [
          'PAYMENTS: show where to tap, insert, or swipe a card.',
          'FORCED MODIFIERS: walk through Maui Milk and Kona Cloud forced modifiers on the register.',
          'DISCOUNTS: how to ring a free drink (e.g., when only one loyalty card covers multiple drinks).',
          'CASH — Large Bills: keep large bills out until change has been given to the customer.',
          'CASH — No Change: what to do when a customer does not want their change.',
          'COUNTERFEIT BILLS: how to spot a fake bill. Use counterfeit pens. Review Counterfeit Money Guide.',
          'COINS: once store is out of pennies, Square automatically rounds to nearest nickel on cash transactions only — direction cannot be chosen.',
        ],
        competencyCriteria: [
          'Processes a card payment (tap/insert/swipe) without prompting',
        ],
      },
      {
        id: 'fs-11a-2',
        name: '2.2 Register Payments — Apply a Forced Modifier (Maui Milk or Kona Cloud)',
        description: 'Applies a forced modifier such as Maui Milk or Kona Cloud on the register.',
        estimatedMinutes: 5,
        steps: [
          'FORCED MODIFIERS: walk through Maui Milk and Kona Cloud forced modifiers on the register.',
        ],
        competencyCriteria: [
          'Applies a forced modifier (Maui Milk or Kona Cloud) on the register',
        ],
      },
      {
        id: 'fs-11a-3',
        name: '2.2 Register Payments — Large Bill Protocol (Keep Out Until Change Given)',
        description: 'States the large-bill protocol: keep large bills out until change has been given to the customer.',
        estimatedMinutes: 5,
        steps: [
          'CASH — Large Bills: keep large bills out until change has been given to the customer.',
        ],
        competencyCriteria: [
          'States large-bill protocol (keep out until change is given)',
        ],
      },
      {
        id: 'fs-11a-4',
        name: '2.2 Register Payments — Spot a Counterfeit Bill and Locate Counterfeit Pens',
        description: 'Knows how to spot a counterfeit bill and where the counterfeit pens are located.',
        estimatedMinutes: 5,
        steps: [
          'COUNTERFEIT BILLS: how to spot a fake bill. Use counterfeit pens. Review Counterfeit Money Guide.',
        ],
        competencyCriteria: [
          'Knows how to spot a counterfeit bill and where counterfeit pens are',
        ],
      },
      // fs-11b split: 5 criteria → fs-11b-1 through fs-11b-5
      {
        id: 'fs-11b-1',
        name: '2.2 Gift Cards, Refunds & Rewards — Add Value and Process Gift Card Payment',
        description: 'Adds value to a gift card and processes a payment with it.',
        estimatedMinutes: 3,
        steps: [
          'GIFT CARDS: how to add value, check balance, and process payment with a gift card.',
          'REFUNDS: how to process a refund — requires manager/shift lead approval.',
          'REWARDS PROGRAM: 1 point per drink. 11 points = 1 free drink (any size up to Large, any modifications included).',
          'RECEIPTS: how to print at end of transaction or retrieve a past receipt.',
          'SPLIT PAYMENTS: how to split between cash + card or two cards.',
          'TEAS: remind of iced vs. hot tea ordering flow on the register.',
        ],
        competencyCriteria: [
          'Adds value to and processes payment with a gift card',
        ],
      },
      {
        id: 'fs-11b-2',
        name: '2.2 Gift Cards, Refunds & Rewards — Process a Refund with Manager Approval',
        description: 'Processes a refund with manager or shift lead approval.',
        estimatedMinutes: 3,
        steps: [
          'REFUNDS: how to process a refund — requires manager/shift lead approval.',
        ],
        competencyCriteria: [
          'Processes a refund with manager/shift lead approval',
        ],
      },
      {
        id: 'fs-11b-3',
        name: '2.2 Gift Cards, Refunds & Rewards — Explain the Rewards Program (1 Pt/Drink, 11 = Free)',
        description: 'Explains the rewards program: 1 point per drink, 11 points = 1 free drink up to Large.',
        estimatedMinutes: 3,
        steps: [
          'REWARDS PROGRAM: 1 point per drink. 11 points = 1 free drink (any size up to Large, any modifications included).',
        ],
        competencyCriteria: [
          'Explains the rewards program (1 pt/drink, 11 pts = free drink up to Large)',
        ],
      },
      {
        id: 'fs-11b-4',
        name: '2.2 Gift Cards, Refunds & Rewards — Print and Retrieve Receipts',
        description: 'Prints a receipt at end of transaction and retrieves a past receipt.',
        estimatedMinutes: 3,
        steps: [
          'RECEIPTS: how to print at end of transaction or retrieve a past receipt.',
        ],
        competencyCriteria: [
          'Prints a receipt and retrieves a past receipt',
        ],
      },
      {
        id: 'fs-11b-5',
        name: '2.2 Gift Cards, Refunds & Rewards — Process a Split Payment',
        description: 'Processes a split payment between cash and card, or two cards.',
        estimatedMinutes: 3,
        steps: [
          'SPLIT PAYMENTS: how to split between cash + card or two cards.',
        ],
        competencyCriteria: [
          'Processes a split payment (cash + card or two cards)',
        ],
      },
      // fs-11c split: 3 criteria → fs-11c-1, fs-11c-2, fs-11c-3
      {
        id: 'fs-11c-1',
        name: '2.2 Cash Handling & Voids — Open and Close the Cash Drawer Correctly',
        description: 'Opens and closes the cash drawer correctly.',
        estimatedMinutes: 5,
        steps: [
          'Trainee practices opening and closing the cash drawer.',
          'Manager explains the over/short variance threshold of ±$5.',
          'ALL voids require manager or shift lead approval — no exceptions.',
        ],
        competencyCriteria: [
          'Opens and closes the cash drawer correctly',
        ],
      },
      {
        id: 'fs-11c-2',
        name: '2.2 Cash Handling & Voids — ±$5 Over/Short Variance Threshold',
        description: 'States the over/short variance threshold of ±$5.',
        estimatedMinutes: 5,
        steps: [
          'Manager explains the over/short variance threshold of ±$5.',
        ],
        competencyCriteria: [
          'States the ±$5 over/short variance threshold',
        ],
      },
      {
        id: 'fs-11c-3',
        name: '2.2 Cash Handling & Voids — All Voids Require Manager or Shift Lead Approval',
        description: 'States that all voids require manager or shift lead approval, no exceptions.',
        estimatedMinutes: 5,
        steps: [
          'ALL voids require manager or shift lead approval — no exceptions.',
        ],
        competencyCriteria: [
          'States voids require manager or shift lead approval',
        ],
      },
      // fs-12 split: 3 criteria → fs-12-1, fs-12-2, fs-12-3
      {
        id: 'fs-12-1',
        name: '2.2 Customer Service Role Play — Listen → Apologize → Remake → Ensure Framework',
        description: 'Demonstrates the Listen → Apologize → Remake → Ensure framework during role-play without prompting.',
        estimatedMinutes: 7,
        steps: [
          'Role-play common scenarios: customer complaint about drink quality, a spilled drink, a wrong order.',
          'Framework: Listen → Apologize → Remake → Ensure they are happy when they leave.',
          'Resolution tools: free drink cards, free modifiers on their current drink.',
          'Trainer gives feedback on composure, speed of resolution, and tone.',
          'Remind: "customer is right" default — remake the drink, take the order, honor expired cards.',
          'Provide Barista Cheat Sheet and POS Register Basics Quiz at end of Day 2.',
        ],
        competencyCriteria: [
          'Demonstrates Listen → Apologize → Remake → Ensure during role-play without prompting',
        ],
      },
      {
        id: 'fs-12-2',
        name: '2.2 Customer Service Role Play — Composure and Immediate Resolution Offer',
        description: 'Maintains composure and offers a resolution without hesitation during a customer complaint scenario.',
        estimatedMinutes: 7,
        steps: [
          'Role-play common scenarios: customer complaint about drink quality, a spilled drink, a wrong order.',
          'Trainer gives feedback on composure, speed of resolution, and tone.',
          'Remind: "customer is right" default — remake the drink, take the order, honor expired cards.',
        ],
        competencyCriteria: [
          'Maintains composure and offers resolution without hesitation',
        ],
      },
      {
        id: 'fs-12-3',
        name: '2.2 Customer Service Role Play — Use Free Drink Card or Modifier as Resolution Tool',
        description: 'Correctly uses a free drink card or free modifier as a customer service resolution tool.',
        estimatedMinutes: 6,
        steps: [
          'Resolution tools: free drink cards, free modifiers on their current drink.',
          'Provide Barista Cheat Sheet and POS Register Basics Quiz at end of Day 2.',
        ],
        competencyCriteria: [
          'Correctly uses free drink card or modifier as a resolution tool',
        ],
      },
      // fs-13 split: 10 criteria → fs-13-1 through fs-13-10
      {
        id: 'fs-13-1',
        name: '2.2 Day 2 Review — 3-Sink Steps in Correct Order',
        description: 'Lists 3-Sink steps in correct order: wash → rinse → sanitize → air-dry.',
        estimatedMinutes: 2,
        steps: [
          '1. List the 4 steps of the 3-Compartment Sink procedure in the correct order.',
          '2. What sanitizer concentration are you targeting for the counter sanitizing bucket, and how do you test it?',
          '3. How often must sanitizing buckets be emptied, rinsed, and refilled? What triggers an early change?',
          '4. What does FIFO stand for and why is it important for food safety?',
          '5. Name all major allergens currently carried at Makenna Koffee.',
          '6. Walk through the 5-step register greeting sequence in order.',
          '7. What is a Supreme drink? What two choices does the customer make when ordering one?',
          '8. What is Maui Milk and what is the single most important thing to communicate about it to a customer?',
          '9. What is Kona Cloud, what does it contain, and what is its Use By Date once opened?',
          '10. What are the sandwich and burrito thaw times and pull times?',
        ],
        competencyCriteria: [
          'Lists 3-Sink steps in correct order (wash → rinse → sanitize → air-dry)',
        ],
      },
      {
        id: 'fs-13-2',
        name: '2.2 Day 2 Review — 100 ppm Target; Test with Strip (50–200 ppm)',
        description: 'States the 100 ppm sanitizer target and that concentration is tested with a strip in the 50–200 ppm chlorine range.',
        estimatedMinutes: 2,
        steps: [
          '2. What sanitizer concentration are you targeting for the counter sanitizing bucket, and how do you test it?',
        ],
        competencyCriteria: [
          'States 100 ppm target; test with strip (chlorine 50–200 ppm)',
        ],
      },
      {
        id: 'fs-13-3',
        name: '2.2 Day 2 Review — 2-Hour Replacement Rule and Early Trigger',
        description: 'States the 2-hour bucket replacement rule and the early trigger (cloudy or greasy water).',
        estimatedMinutes: 2,
        steps: [
          '3. How often must sanitizing buckets be emptied, rinsed, and refilled? What triggers an early change?',
        ],
        competencyCriteria: [
          'States 2-hour replacement rule and early trigger (cloudy/greasy)',
        ],
      },
      {
        id: 'fs-13-4',
        name: '2.2 Day 2 Review — Define FIFO and Apply to Makenna Products',
        description: 'Defines FIFO (First In, First Out) and correctly applies the concept to Makenna products.',
        estimatedMinutes: 2,
        steps: [
          '4. What does FIFO stand for and why is it important for food safety?',
        ],
        competencyCriteria: [
          'Defines FIFO and applies it to Makenna products',
        ],
      },
      {
        id: 'fs-13-5',
        name: '2.2 Day 2 Review — Name All 5 Allergens',
        description: 'Names all 5 allergens carried at Makenna: Milk, Eggs, Wheat, Soy, and Peanut butter.',
        estimatedMinutes: 2,
        steps: [
          '5. Name all major allergens currently carried at Makenna Koffee.',
        ],
        competencyCriteria: [
          'Names all 5 allergens (Milk, Eggs, Wheat, Soy, Peanut butter)',
        ],
      },
      {
        id: 'fs-13-6',
        name: '2.2 Day 2 Review — Deliver All 5 Greeting Steps in Order',
        description: 'Delivers all 5 register greeting steps in the correct order.',
        estimatedMinutes: 2,
        steps: [
          '6. Walk through the 5-step register greeting sequence in order.',
        ],
        competencyCriteria: [
          'Delivers all 5 greeting steps in order',
        ],
      },
      {
        id: 'fs-13-7',
        name: '2.2 Day 2 Review — Correctly Describe a Supreme Drink',
        description: 'Correctly describes a Supreme drink as an espresso latte with size and iced/hot choice.',
        estimatedMinutes: 2,
        steps: [
          '7. What is a Supreme drink? What two choices does the customer make when ordering one?',
        ],
        competencyCriteria: [
          'Correctly describes a Supreme drink (espresso latte, size + iced/hot)',
        ],
      },
      {
        id: 'fs-13-8',
        name: '2.2 Day 2 Review — Recite All 4 Maui Milk Talking Points; Dairy-Based Is Most Important',
        description: 'Recites all 4 Maui Milk talking points and states that dairy-based is the most important for allergy customers.',
        estimatedMinutes: 2,
        steps: [
          '8. What is Maui Milk and what is the single most important thing to communicate about it to a customer?',
        ],
        competencyCriteria: [
          'Recites all 4 Maui Milk talking points; states dairy-based is most important',
        ],
      },
      {
        id: 'fs-13-9',
        name: '2.2 Day 2 Review — Describe Kona Cloud (Sweet Cold Foam, Dairy, 2-Week Use-By)',
        description: 'Describes Kona Cloud as sweet cold foam that contains dairy, with a 2-week use-by date after opening.',
        estimatedMinutes: 2,
        steps: [
          '9. What is Kona Cloud, what does it contain, and what is its Use By Date once opened?',
        ],
        competencyCriteria: [
          'Describes Kona Cloud (sweet cold foam, dairy, 2-week use-by after opening)',
        ],
      },
      {
        id: 'fs-13-10',
        name: '2.2 Day 2 Review — Sandwich and Burrito Thaw Protocols',
        description: 'States sandwich thaw protocol (12-hr, pull 4–6 PM) and burrito thaw protocol (24-hr, pull 6:30–8 AM).',
        estimatedMinutes: 2,
        steps: [
          '10. What are the sandwich and burrito thaw times and pull times?',
        ],
        competencyCriteria: [
          'States sandwich (12-hr, 4–6 PM) and burrito (24-hr, 6:30–8 AM) thaw protocols',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'barista-basics-1',
    name: 'Barista Basics I',
    description: 'Section 3 (Days 3–4) — Station setup, specialty product prep, food heating, expo, cleaning, coffee theory, espresso execution, iced/blended/hot drinks, energy drinks, milk steaming, and cold brew drinks.',
    order: 3,
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      // ── Day 3: 3.1 Support, Prep & Setup ─────────────────────────────────
      {
        id: 'bb1-1-1',
        name: '3.1 Station Setup: Ice Safety Rule',
        description: 'If any ice falls to the floor, push it inside the nearest drain or under the ice machine — never leave it as a slip hazard.',
        estimatedMinutes: 5,
        steps: [
          'SAFETY: any time an employee goes to the back of store, be very careful — it can be slippery. Do NOT run.',
          'GETTING ICE: ice bucket should say "ICE" and must not be cracked or broken. If any ice falls to the floor, push it inside the nearest drain or under the ice machine — never leave it as a slip hazard.',
          'CUPS/LIDS: show New Hire where all cup sizes and lids are located. Show how to stock cups properly. Never touch the mouth opening area of cups or lids.',
          '3-COMP SINK RESET: Fill Wash sink to line with appropriate amount of detergent. Leave Rinse sink empty. Fill Sanitize sink to line and add appropriate sanitizer solution or bleach.',
        ],
        competencyCriteria: [
          'States ice safety rule (push fallen ice to drain — never leave on floor)',
        ],
      },
      {
        id: 'bb1-1-2',
        name: '3.1 Station Setup: Ice Bucket Inspection',
        description: 'Verify the ice bucket is not cracked and is labeled "ICE" before use.',
        estimatedMinutes: 5,
        steps: [
          'GETTING ICE: ice bucket should say "ICE" and must not be cracked or broken.',
          'Inspect bucket before scooping — reject and replace any cracked or unlabeled bucket.',
        ],
        competencyCriteria: [
          'Verifies ice bucket is not cracked; labeled "ICE"',
        ],
      },
      {
        id: 'bb1-1-3',
        name: '3.1 Station Setup: Cups & Lids Stocking',
        description: 'Stock cups and lids in their correct locations without touching the mouth opening area of any cup or lid.',
        estimatedMinutes: 5,
        steps: [
          'CUPS/LIDS: show New Hire where all cup sizes and lids are located. Show how to stock cups properly. Never touch the mouth opening area of cups or lids.',
          'Demonstrate correct grip when handling lids and cups.',
        ],
        competencyCriteria: [
          'Stocks cups and lids without touching mouth opening areas',
        ],
      },
      {
        id: 'bb1-1-4',
        name: '3.1 Station Setup: 3-Comp Sink Reset',
        description: 'Reset the 3-compartment sink correctly: wash sink filled with detergent, rinse sink empty, sanitize sink filled with sanitizer solution or bleach.',
        estimatedMinutes: 5,
        steps: [
          '3-COMP SINK RESET: Fill Wash sink to line with appropriate amount of detergent. Leave Rinse sink empty. Fill Sanitize sink to line and add appropriate sanitizer solution or bleach.',
          'Verify each sink compartment is correct before beginning shift.',
        ],
        competencyCriteria: [
          'Resets 3-comp sink correctly (wash filled with detergent; rinse empty; sanitize filled)',
        ],
      },
      {
        id: 'bb1-2-1',
        name: '3.1 Restocking: Pastry Case FIFO',
        description: 'Restock the pastry case using FIFO — new product goes behind older product.',
        estimatedMinutes: 6,
        steps: [
          'PASTRIES (store specific): restock pastry case using FIFO — new product behind older product.',
          'CAKE POPS: sensitive to heat. Display 1 of each design; keep the rest refrigerated. Good for 2 weeks refrigerated.',
          'SYRUPS & SAUCES: continue using a bottle until the pump can no longer extract any liquid. Do not replace a bottle that still has usable product. If a bottle is nearly empty during a rush, you may discard remaining syrup into another bottle of the EXACT same flavor.',
          'BEANS: show New Hire how to identify which beans are which (add images of colored bags for identification). Demonstrate what is what.',
          'SANITIZING BUCKETS: towel/rag should always be fully submerged — food safety.',
          'FIFO applies to ALL restocked items except paper goods.',
        ],
        competencyCriteria: [
          'Restocks pastry case with FIFO (new behind old)',
        ],
      },
      {
        id: 'bb1-2-2',
        name: '3.1 Restocking: Cake Pop Display & Refrigeration',
        description: 'Display only 1 of each cake pop design; keep the rest refrigerated, where they stay good for 2 weeks.',
        estimatedMinutes: 6,
        steps: [
          'CAKE POPS: sensitive to heat. Display 1 of each design; keep the rest refrigerated. Good for 2 weeks refrigerated.',
          'Check display at the start of each shift and replace any that look melted or discolored.',
        ],
        competencyCriteria: [
          'Keeps only 1 of each cake pop design displayed; keeps rest refrigerated',
        ],
      },
      {
        id: 'bb1-2-3',
        name: '3.1 Restocking: Syrup Bottle Replacement Rule',
        description: 'Never replace a syrup bottle that still has usable product — continue using until the pump can no longer extract any liquid.',
        estimatedMinutes: 6,
        steps: [
          'SYRUPS & SAUCES: continue using a bottle until the pump can no longer extract any liquid. Do not replace a bottle that still has usable product. If a bottle is nearly empty during a rush, you may discard remaining syrup into another bottle of the EXACT same flavor.',
          'During a rush: combine only with the EXACT same flavor — never mix different flavors.',
        ],
        competencyCriteria: [
          'States not to replace a syrup bottle with usable product remaining',
        ],
      },
      {
        id: 'bb1-2-4',
        name: '3.1 Restocking: Bean Bag Color Identification',
        description: 'Identify bean bags by their color label; confirm current color assignments with the manager.',
        estimatedMinutes: 6,
        steps: [
          'BEANS: show New Hire how to identify which beans are which (add images of colored bags for identification). Demonstrate what is what.',
          'Confirm current color-to-bean mapping with manager before each session.',
        ],
        competencyCriteria: [
          'Identifies bean bags by color (confirms with manager for current colors)',
        ],
      },
      {
        id: 'bb1-2-5',
        name: '3.1 Restocking: Sanitizing Bucket Rag Submersion',
        description: 'The towel or rag in the sanitizing bucket must always be fully submerged — this is a food safety requirement.',
        estimatedMinutes: 6,
        steps: [
          'SANITIZING BUCKETS: towel/rag should always be fully submerged — food safety.',
          'Check submersion each time you return a rag to the bucket.',
        ],
        competencyCriteria: [
          'Verifies rag is fully submerged in sanitizing bucket',
        ],
      },
      {
        id: 'bb1-3-1',
        name: '3.1 Food Heating: Oven Heats Without a Preset',
        description: 'Items heat in the oven even without pressing a preset — always monitor and remove promptly to avoid overcooking.',
        estimatedMinutes: 5,
        steps: [
          'OVENS: these are a mix of conventional and microwave. Any item placed inside will heat up even if no preset is pressed. Keep this in mind — items must be removed shortly after the heating cycle or they will overcook or burn.',
          'If a pastry ticket is placed in the oven, the heat erases the sticker contents — resulting in a blank sticker. Do NOT put item tickets in the oven.',
          'PASTRIES — "Warm/Toasted": place pastry inside a pastry BAG, then into the oven. EXCEPTIONS that go on parchment paper (NOT a bag): Chocolate croissant, Cheese danish, Cinnamon rolls. These go in a plastic pastry container when warmed.',
          'PASTRIES — "Cool/Room Temp": same bag vs. plastic container rules apply.',
          'Presets: "Pastry" for all pastries. "Ham & Cheese" ONLY for the Ham & Cheese item.',
          'BURRITOS: Remove from wrapping. Place on parchment paper with tortilla flap on TOP (allows tortilla to open when pressure builds inside — prevents burrito from exploding). Use aluminum paddle to load into oven. Press "Single Burrito" preset. When done, use aluminum paddle to remove; place on counter. Using tongs or gloves, wrap in foil, place in pastry bag, and apply item ticket on the OUTSIDE of the bag.',
          'SANDWICHES: Remove from bag. Place on parchment paper. Load with aluminum paddle. No specific preset — use appropriate preset. Remove when done.',
        ],
        competencyCriteria: [
          'States items heat in oven even without pressing a preset',
        ],
      },
      {
        id: 'bb1-3-2',
        name: '3.1 Food Heating: Never Place Tickets in Oven',
        description: 'Never place item tickets in the oven — heat erases the sticker contents, resulting in a blank sticker.',
        estimatedMinutes: 5,
        steps: [
          'If a pastry ticket is placed in the oven, the heat erases the sticker contents — resulting in a blank sticker. Do NOT put item tickets in the oven.',
          'Always remove the ticket and apply it to the outside of the bag or container after heating.',
        ],
        competencyCriteria: [
          'Never places item tickets in the oven',
        ],
      },
      {
        id: 'bb1-3-3',
        name: '3.1 Food Heating: Pastry Bag vs. Parchment Paper',
        description: 'Standard pastries go in a pastry bag for the oven; exceptions (chocolate croissant, cheese danish, cinnamon rolls) go on parchment paper and into a plastic pastry container.',
        estimatedMinutes: 5,
        steps: [
          'PASTRIES — "Warm/Toasted": place pastry inside a pastry BAG, then into the oven. EXCEPTIONS that go on parchment paper (NOT a bag): Chocolate croissant, Cheese danish, Cinnamon rolls. These go in a plastic pastry container when warmed.',
          'PASTRIES — "Cool/Room Temp": same bag vs. plastic container rules apply.',
        ],
        competencyCriteria: [
          'Correctly uses pastry bag for standard pastries and parchment paper for exceptions (chocolate croissant, cheese danish, cinnamon rolls)',
        ],
      },
      {
        id: 'bb1-3-4',
        name: '3.1 Food Heating: Burrito Tortilla Flap Placement',
        description: 'Place burritos on parchment paper with the tortilla flap on top — this allows the tortilla to open as pressure builds and prevents the burrito from exploding.',
        estimatedMinutes: 5,
        steps: [
          'BURRITOS: Remove from wrapping. Place on parchment paper with tortilla flap on TOP (allows tortilla to open when pressure builds inside — prevents burrito from exploding).',
          'Use aluminum paddle to load into oven. Press "Single Burrito" preset.',
        ],
        competencyCriteria: [
          'Places burritos with tortilla flap on top on parchment paper',
        ],
      },
      {
        id: 'bb1-3-5',
        name: '3.1 Food Heating: Aluminum Paddle for Oven Loading',
        description: 'Use the aluminum paddle to load and unload the oven — never touch the inside of the oven with a bare hand.',
        estimatedMinutes: 5,
        steps: [
          'Use aluminum paddle to load into oven. When done, use aluminum paddle to remove; place on counter.',
          'SANDWICHES: Remove from bag. Place on parchment paper. Load with aluminum paddle. No specific preset — use appropriate preset. Remove when done.',
        ],
        competencyCriteria: [
          'Uses aluminum paddle to load/unload oven; does not touch inside of oven with bare hand',
        ],
      },
      {
        id: 'bb1-3-6',
        name: '3.1 Food Heating: Burrito Wrap & Ticket Placement',
        description: 'After heating, wrap the burrito in foil, place it in a pastry bag, and apply the item ticket on the outside of the bag.',
        estimatedMinutes: 5,
        steps: [
          'When done, use aluminum paddle to remove; place on counter. Using tongs or gloves, wrap in foil, place in pastry bag, and apply item ticket on the OUTSIDE of the bag.',
          'Confirm ticket is readable and firmly adhered to the outside of the bag before placing at expo.',
        ],
        competencyCriteria: [
          'Wraps burrito in foil, places in pastry bag, applies ticket on outside',
        ],
      },
      {
        id: 'bb1-4-1',
        name: '3.1 Expo Station: Tapping Off Items on Screen',
        description: 'When bringing an item to the Expo station, find it on screen and tap it off as completed.',
        estimatedMinutes: 4,
        steps: [
          'When bringing an item to the Expo station, find it on screen and tap off the item.',
          'If your item is the only or last item of the order, gather ALL items and call the order name.',
          'STICKER STOPPERS: place sticker stoppers on pick-up drinks covering the mouth opening of the lid. For in-store orders, ask the customer if they want stoppers on their drinks.',
          'THIRD-PARTY DELIVERY: place food in a to-go bag, seal with sticker stoppers or tie in a knot. Write customer name on bag. Add napkins and/or straws or direct the driver to where they are. Place drinks in a cup carrier. If mostly X-tra Large drinks, use two cup carriers for stability.',
          'EXPO CALL-OUT: call the order name clearly. Make sure the customer picks up their ENTIRE order before tapping it off the screen (some customers are in the restroom or mid-conversation).',
          'Handoff greeting: "Have a great day! Let us know if it tastes right — if not, please let us know so we can remake it."',
        ],
        competencyCriteria: [
          'Taps off items on the expo screen as they are completed',
        ],
      },
      {
        id: 'bb1-4-2',
        name: '3.1 Expo Station: Calling the Order Name at Handoff',
        description: 'Call the full order name clearly and ensure the customer picks up their entire order before tapping it off the screen.',
        estimatedMinutes: 4,
        steps: [
          'EXPO CALL-OUT: call the order name clearly. Make sure the customer picks up their ENTIRE order before tapping it off the screen (some customers are in the restroom or mid-conversation).',
          'Gather ALL items before calling the name — never call a partial order.',
        ],
        competencyCriteria: [
          'Calls the full order name clearly at handoff',
        ],
      },
      {
        id: 'bb1-4-3',
        name: '3.1 Expo Station: Sticker Stoppers on Pick-Up Drinks',
        description: 'Place sticker stoppers on pick-up drinks covering the mouth opening of the lid; for in-store orders, ask the customer first.',
        estimatedMinutes: 4,
        steps: [
          'STICKER STOPPERS: place sticker stoppers on pick-up drinks covering the mouth opening of the lid. For in-store orders, ask the customer if they want stoppers on their drinks.',
          'Confirm stopper is fully covering the mouth opening before handing off.',
        ],
        competencyCriteria: [
          'Places sticker stoppers on pick-up drinks',
        ],
      },
      {
        id: 'bb1-4-4',
        name: '3.1 Expo Station: Third-Party Delivery Bagging',
        description: 'Bag third-party delivery orders correctly: food in a sealed to-go bag with customer name, drinks in a cup carrier, napkins and straws included.',
        estimatedMinutes: 4,
        steps: [
          'THIRD-PARTY DELIVERY: place food in a to-go bag, seal with sticker stoppers or tie in a knot. Write customer name on bag. Add napkins and/or straws or direct the driver to where they are. Place drinks in a cup carrier. If mostly X-tra Large drinks, use two cup carriers for stability.',
          'Double-check the customer name is legible on the bag before handing to the driver.',
        ],
        competencyCriteria: [
          'Correctly bags and labels third-party delivery orders',
        ],
      },
      {
        id: 'bb1-4-5',
        name: '3.1 Expo Station: Warm Handoff Greeting',
        description: 'Give a warm handoff greeting at every pick-up: "Have a great day! Let us know if it tastes right — if not, please let us know so we can remake it."',
        estimatedMinutes: 4,
        steps: [
          'Handoff greeting: "Have a great day! Let us know if it tastes right — if not, please let us know so we can remake it."',
          'Make eye contact and smile at every handoff — this is the last impression we leave with the customer.',
        ],
        competencyCriteria: [
          'Gives a warm handoff greeting at every pick-up',
        ],
      },
      {
        id: 'bb1-5-1',
        name: '3.1 Kona Cloud: 24-Hour Thaw & Thawed Side Rule',
        description: 'Kona Cloud must thaw for 24 hours in the refrigerator; always grab only from the clearly marked thawed side.',
        estimatedMinutes: 6,
        steps: [
          'Kona Cloud is delivered frozen and stored in the freezer. Cannot be used until thawed in the refrigerator.',
          'THAWING: remove from box. Slightly separate cartons for airflow. Takes ~24 hours to thaw. Thawed side must be marked in the thawing fridge.',
          'Once moved to refrigerator from freezer: good for 3 weeks.',
          'BEFORE USE: gently squeeze each Kona Cloud carton to confirm it is soft and pliable throughout. Reject any carton that feels icy, slushy, contains ice chunks, or is too thick — these will not sit correctly on top of drinks.',
          'SHAKING: shake each carton until product is fully emulsified. New Hire should hear a very liquidy sound, then shake ~30 more seconds. Tip: "pretend you\'re throwing a football with two hands."',
          'POURING: set 1 carton against the rim to slow-pour. Trash when empty. Shake 2 more while first is pouring, then set against the rim to slow-pour.',
          'DISPENSER: grab 1 Kona Cloud Dispenser (64 oz for regular / 48 oz for Oat) and 3 Kona Cloud Cartons (regular) or 2 (Oat). ALWAYS grab from the THAWED side.',
          'Put lid on dispenser. Do not forget to put in refrigerator.',
          'USE BY DATE: write "Use By" date on the lid — 2 weeks from the Made Date.',
        ],
        competencyCriteria: [
          'States Kona Cloud must thaw 24 hours; grabs only from thawed/marked side',
        ],
      },
      {
        id: 'bb1-5-2',
        name: '3.1 Kona Cloud: Squeeze Test Before Use',
        description: 'Squeeze each Kona Cloud carton before use; reject any that feel icy, slushy, or too thick — they will not pour correctly.',
        estimatedMinutes: 6,
        steps: [
          'BEFORE USE: gently squeeze each Kona Cloud carton to confirm it is soft and pliable throughout. Reject any carton that feels icy, slushy, contains ice chunks, or is too thick — these will not sit correctly on top of drinks.',
          'Rejected cartons go back to the freezer side — do not use or discard.',
        ],
        competencyCriteria: [
          'Squeezes each carton before use; rejects any that feel icy or slushy',
        ],
      },
      {
        id: 'bb1-5-3',
        name: '3.1 Kona Cloud: Shaking Until Fully Liquidy',
        description: 'Shake each Kona Cloud carton until the product is fully emulsified — you should hear a very liquidy sound, then shake 30 more seconds.',
        estimatedMinutes: 6,
        steps: [
          'SHAKING: shake each carton until product is fully emulsified. New Hire should hear a very liquidy sound, then shake ~30 more seconds. Tip: "pretend you\'re throwing a football with two hands."',
          'POURING: set 1 carton against the rim to slow-pour. Trash when empty. Shake 2 more while first is pouring, then set against the rim to slow-pour.',
        ],
        competencyCriteria: [
          'Shakes cartons until fully liquidy before pouring',
        ],
      },
      {
        id: 'bb1-5-4',
        name: '3.1 Kona Cloud: Use By Date on Dispenser Lid',
        description: 'Write the Use By date on the dispenser lid — it is 2 weeks from the Made Date.',
        estimatedMinutes: 6,
        steps: [
          'USE BY DATE: write "Use By" date on the lid — 2 weeks from the Made Date.',
          'Write clearly and confirm the date before closing and storing the dispenser.',
        ],
        competencyCriteria: [
          'Writes Use By Date on dispenser lid (2 weeks from made date)',
        ],
      },
      {
        id: 'bb1-5-5',
        name: '3.1 Kona Cloud: Return Dispenser to Refrigerator',
        description: 'Always return the Kona Cloud dispenser to the refrigerator after filling — never leave it at room temperature.',
        estimatedMinutes: 6,
        steps: [
          'Put lid on dispenser. Do not forget to put in refrigerator.',
          'DISPENSER: grab 1 Kona Cloud Dispenser (64 oz for regular / 48 oz for Oat) and 3 Kona Cloud Cartons (regular) or 2 (Oat). ALWAYS grab from the THAWED side.',
        ],
        competencyCriteria: [
          'Returns dispenser to refrigerator after filling',
        ],
      },
      {
        id: 'bb1-6-1',
        name: '3.1 Maui Milk Toddy: Pull Half-and-Half from Back of FIFO',
        description: 'For Maui Milk, pull half-and-half from the BACK of FIFO (latest expiration dates) — this is the only prep item where we reverse the FIFO rule.',
        estimatedMinutes: 5,
        steps: [
          'Grab 1 clean Maui Milk Toddy, spatula, whisk, lid, and 4 gallons of half and half. NOTE: this is the ONLY time we pull from the BACK of FIFO (latest expiration dates). If only 1 toddy is available, use the Washing Technique for Maui Toddy (see video).',
          'Grab 1 Maui Milk Concentrate Can and 1 Maui Milk Syrup Jug.',
          'Pour the Syrup Jug into the Toddy FIRST.',
          'Use the can opener to open the Maui Milk Can, leaving ~1 inch uncut so the lid does not fall in. Do NOT put fingers inside the can to lift the lid — the liquid pressure will open it enough to pour.',
          'Pour the can into the Toddy. Use a spatula to scrape as much as possible from inside the walls.',
          'Using the spatula, push the lid down before trashing so nobody gets cut when taking out the trash.',
          'Trash the empty can and syrup jug.',
          'Using the LARGE whisk — whisk the contents in the Toddy.',
          'Pour 3 gallons of half and half and mix vigorously.',
          'Pour the 4th gallon slowly and mix gently to avoid spills.',
          'Put lid on Toddy and place in fridge. Use lid to carry whisk to sink.',
          'USE BY DATE on the Toddy lid = expiration date from the half-and-half jugs.',
          'FILLING JUGS: never leave unattended. Draining spout should not stick out. Push Toddy back when door closes. Put expiration date on Maui Milk jugs to match the Toddy expiration.',
        ],
        competencyCriteria: [
          'Pulls half-and-half from the BACK of FIFO (latest expiration dates) for Maui Milk',
        ],
      },
      {
        id: 'bb1-6-2',
        name: '3.1 Maui Milk Toddy: Pour Syrup Jug First, Then Can',
        description: 'Pour the Maui Milk Syrup Jug into the Toddy first, then add the concentrate can — order matters for correct ratios.',
        estimatedMinutes: 5,
        steps: [
          'Pour the Syrup Jug into the Toddy FIRST.',
          'Use the can opener to open the Maui Milk Can, leaving ~1 inch uncut so the lid does not fall in. Pour the can into the Toddy. Use a spatula to scrape as much as possible from inside the walls.',
        ],
        competencyCriteria: [
          'Pours syrup jug first, then concentrate can',
        ],
      },
      {
        id: 'bb1-6-3',
        name: '3.1 Maui Milk Toddy: No Fingers Inside the Can',
        description: 'Never put fingers inside the Maui Milk concentrate can to lift the lid — liquid pressure will open it enough to pour safely.',
        estimatedMinutes: 5,
        steps: [
          'Use the can opener to open the Maui Milk Can, leaving ~1 inch uncut so the lid does not fall in. Do NOT put fingers inside the can to lift the lid — the liquid pressure will open it enough to pour.',
          'Tilt the can to pour; use a spatula to scrape the walls.',
        ],
        competencyCriteria: [
          'Does not put fingers inside the concentrate can',
        ],
      },
      {
        id: 'bb1-6-4',
        name: '3.1 Maui Milk Toddy: Push Can Lid Down Before Trashing',
        description: 'Use a spatula to push the can lid down into the can before trashing — this prevents cut injuries when someone takes out the trash.',
        estimatedMinutes: 5,
        steps: [
          'Using the spatula, push the lid down before trashing so nobody gets cut when taking out the trash.',
          'Trash the empty can and syrup jug after pushing the lid down.',
        ],
        competencyCriteria: [
          'Pushes can lid down before trashing (prevents cut injuries)',
        ],
      },
      {
        id: 'bb1-6-5',
        name: '3.1 Maui Milk Toddy: Use By Date on Toddy Lid',
        description: 'Write the Use By date on the Toddy lid — it matches the expiration date from the half-and-half jugs.',
        estimatedMinutes: 5,
        steps: [
          'USE BY DATE on the Toddy lid = expiration date from the half-and-half jugs.',
          'Write the date clearly before placing the Toddy in the refrigerator.',
        ],
        competencyCriteria: [
          'Writes Use By Date on Toddy lid (matches half-and-half expiration)',
        ],
      },
      {
        id: 'bb1-6-6',
        name: '3.1 Maui Milk Toddy: Safe Jug Filling',
        description: 'Fill Maui Milk jugs safely: never leave unattended, keep the draining spout flush (not sticking out), and push the Toddy back before the door closes.',
        estimatedMinutes: 5,
        steps: [
          'FILLING JUGS: never leave unattended. Draining spout should not stick out. Push Toddy back when door closes. Put expiration date on Maui Milk jugs to match the Toddy expiration.',
          'Confirm the expiration date on each filled jug matches the Toddy lid before storing.',
        ],
        competencyCriteria: [
          'Fills Maui Milk jugs safely (never unattended; spout not sticking out)',
        ],
      },
      {
        id: 'bb1-7-1',
        name: '3.1 Cold Brew Toddy: Set Grinder to Coarse',
        description: 'Always set the coffee bean grinder to COARSE before grinding cold brew beans.',
        estimatedMinutes: 5,
        steps: [
          'Grab 1 clean Cold Brew Toddy, Cold Brew Filter Bag, Plastic Stand, and 1 bag of Cold Brew Beans.',
          'Place Plastic Stand in the Cold Brew Toddy.',
          'Set Coffee Bean Grinder to COARSE.',
          'Place the bag behind the grinder outlet to catch grinds — ensure the metal trigger is pushed back, otherwise the grinder will not grind.',
          'Pour beans into the grinder\'s top reservoir. Grind until the full bag is done.',
          'Place filter bag with grinds into the Toddy.',
          'Use a clean empty pitcher to fill Toddy with drinking water — ensure all grounds are wet when pouring. Leave ~1 inch of room at the top for the lid (avoids spilling).',
          'Write a note with Ready By Date: current time + 14 hours.',
          'Preferred brew time: 14 hours. Can still be used up to 36 hours.',
          'DRAINING: empty into pitchers — fill ½ cold brew and ½ water (equal parts).',
          'USE BY DATE: 5 days from the date the pitcher was filled.',
        ],
        competencyCriteria: [
          'Sets grinder to COARSE for cold brew',
        ],
      },
      {
        id: 'bb1-7-2',
        name: '3.1 Cold Brew Toddy: Catch Bag & Metal Trigger Setup',
        description: 'Position the catch bag behind the grinder outlet and confirm the metal trigger is pushed back before grinding — otherwise the grinder will not operate.',
        estimatedMinutes: 5,
        steps: [
          'Place the bag behind the grinder outlet to catch grinds — ensure the metal trigger is pushed back, otherwise the grinder will not grind.',
          'Pour beans into the grinder\'s top reservoir. Grind until the full bag is done.',
        ],
        competencyCriteria: [
          'Positions catch bag behind grinder outlet; confirms metal trigger is pushed back before grinding',
        ],
      },
      {
        id: 'bb1-7-3',
        name: '3.1 Cold Brew Toddy: 1-Inch Headspace After Water Fill',
        description: 'Leave approximately 1 inch of room at the top of the Toddy after adding water — this prevents spilling when placing the lid.',
        estimatedMinutes: 5,
        steps: [
          'Use a clean empty pitcher to fill Toddy with drinking water — ensure all grounds are wet when pouring. Leave ~1 inch of room at the top for the lid (avoids spilling).',
          'Confirm all grounds are saturated before placing the lid.',
        ],
        competencyCriteria: [
          'Leaves ~1 inch of room at top of Toddy after adding water',
        ],
      },
      {
        id: 'bb1-7-4',
        name: '3.1 Cold Brew Toddy: Write Ready By Date',
        description: 'Write the Ready By Date on a note attached to the Toddy — current time plus 14 hours (preferred brew time; usable up to 36 hours).',
        estimatedMinutes: 5,
        steps: [
          'Write a note with Ready By Date: current time + 14 hours.',
          'Preferred brew time: 14 hours. Can still be used up to 36 hours.',
        ],
        competencyCriteria: [
          'Writes Ready By Date (current time + 14 hours) on the Toddy',
        ],
      },
      {
        id: 'bb1-7-5',
        name: '3.1 Cold Brew Toddy: Drain as Equal Parts Cold Brew + Water',
        description: 'Drain the finished cold brew into pitchers using equal parts: half cold brew and half water.',
        estimatedMinutes: 5,
        steps: [
          'DRAINING: empty into pitchers — fill ½ cold brew and ½ water (equal parts).',
          'Use a separate clean pitcher for measuring if needed to ensure equal proportions.',
        ],
        competencyCriteria: [
          'Drains as ½ cold brew + ½ water (equal parts)',
        ],
      },
      {
        id: 'bb1-7-6',
        name: '3.1 Cold Brew Toddy: Use By Date on Filled Pitchers',
        description: 'The Use By Date for cold brew pitchers is 5 days from the date the pitcher was filled.',
        estimatedMinutes: 5,
        steps: [
          'USE BY DATE: 5 days from the date the pitcher was filled.',
          'Label each pitcher clearly with the fill date and Use By Date before refrigerating.',
        ],
        competencyCriteria: [
          'States Use By Date: 5 days from pitcher fill date',
        ],
      },
      {
        id: 'bb1-8-1',
        name: '3.1 Energy Slushy Mix: Correct Ingredient Quantities',
        description: 'Makenna Energy Slushy Mix requires 14 Energy cans, 12 oz sugar dissolved in hot water to the 24 oz mark, plus 32 oz of cold water.',
        estimatedMinutes: 5,
        steps: [
          'Grab 2 empty slushy mix pitchers, a measuring cup, and a whisker.',
          'Pour 14 Energy drinks into one of the slushy mix pitchers.',
          'In the measuring cup: pour 12 oz of white cane sugar, then add hot water up to the 24 oz line.',
          'Using the whisker, mix until the sugar fully dissolves and the water looks transparent with no sugar crystals visible at the bottom.',
          'Pour the sugar-water into the second slushy mix pitcher.',
          'Using the same measuring cup, add an additional 32 oz of cold drinking water to the second pitcher.',
          'Tom-tom the contents from both pitchers 3–4 times until the color looks uniform.',
          'Pour the slushy mix into the slushy machine OR store in the refrigerator for later use.',
          'USE BY DATE: 7 days from current date.',
        ],
        competencyCriteria: [
          'Uses 14 Energy cans, 12 oz sugar, hot water to 24 oz mark, plus 32 oz cold water',
        ],
      },
      {
        id: 'bb1-8-2',
        name: '3.1 Energy Slushy Mix: Dissolve Sugar Completely',
        description: 'Mix the sugar in hot water until fully dissolved — the water should look transparent with no sugar crystals visible at the bottom.',
        estimatedMinutes: 5,
        steps: [
          'In the measuring cup: pour 12 oz of white cane sugar, then add hot water up to the 24 oz line.',
          'Using the whisker, mix until the sugar fully dissolves and the water looks transparent with no sugar crystals visible at the bottom.',
        ],
        competencyCriteria: [
          'Mixes sugar until fully dissolved (no crystals visible at bottom)',
        ],
      },
      {
        id: 'bb1-8-3',
        name: '3.1 Energy Slushy Mix: Tom-Tom 3–4 Times for Uniform Color',
        description: 'Tom-tom the combined pitchers 3–4 times until the slushy mix is a uniform color throughout.',
        estimatedMinutes: 5,
        steps: [
          'Tom-tom the contents from both pitchers 3–4 times until the color looks uniform.',
          'Pour the slushy mix into the slushy machine OR store in the refrigerator for later use.',
        ],
        competencyCriteria: [
          'Tom-toms 3–4 times for uniform color',
        ],
      },
      {
        id: 'bb1-8-4',
        name: '3.1 Energy Slushy Mix: Use By Date Label',
        description: 'Label the slushy mix with a Use By Date — 7 days from the prep date.',
        estimatedMinutes: 5,
        steps: [
          'USE BY DATE: 7 days from current date.',
          'Write the date clearly on the container before storing or loading into the slushy machine.',
        ],
        competencyCriteria: [
          'Labels slushy mix with Use By Date (7 days from prep date)',
        ],
      },
      {
        id: 'bb1-9-1',
        name: '3.1 Drip Coffee: Correct Brewing Procedure',
        description: 'Brew drip coffee correctly: rinse the basket first, select the correct bean color, and hold the correct size button to lock the basket.',
        estimatedMinutes: 5,
        steps: [
          'DRIP COFFEE: pull drip basket from the machine labeled "Use to Brew Drip." If used filter inside: empty into trash, rinse basket, shake off excess water. Place a coffee filter in basket and load into drip grinder.',
          'Select Yellow (Drippin\' House Blend) or Pink (Kona Blend) on grinder. Turn on and let run until it stops.',
          'Pull basket out, shake gently to level grounds. Place in drip machine labeled "Use to Brew Drip." Place drip pot under it, remove rubber cover, align opening to dripping hole.',
          'Yellow → hold Large until machine locks basket. Pink → hold Medium until machine locks basket.',
          'Let run for full cycle. Place rubber cover back to maintain heat. If urgent and no pot: place cup under and brew, moving pot back after.',
          'RETAIL BEAN GRINDING for customers: ask how they brew at home. Coarse = French Press/Cold Brew. Medium = Drip/Pour-over. Fine = Espresso.',
          'GREEN TEA: grab Green Tea Pitcher. Get 8 bags of Harney & Sons Green Tea. Carefully unstick paper tag from pouch; while holding tag, cut halfway down the string — letting bag drop into pitcher. Place basket in machine labeled "Use to Brew Tea" (empty, no filter for green tea). Hold Large until machine locks. Full cycle. Place lid. Use By: 2 days. Allow to cool completely before refrigerating.',
          'BLACK TEA: grab Black Tea Pitcher. Pull basket; empty/rinse if needed. Place 1 black tea bag in brewing basket with NO filter. Hold Large until locked. Full cycle. Lid on. Use By: 2 days. Cool completely before refrigerating.',
          'HIBISCUS TEA: grab Hibiscus Tea Pitcher and fill with ice. Pull basket; empty/rinse if needed. Place paper filter in basket and add 1.5 scoops of hibiscus tea grounds into filter. Hold Medium until locked. Full cycle. Lid on. Use By: 2 days. Place in refrigerator immediately — this tea is ready to use right away.',
        ],
        competencyCriteria: [
          'Brews drip correctly (rinse basket first; select correct bean color; hold correct size button)',
        ],
      },
      {
        id: 'bb1-9-2',
        name: '3.1 Drip Coffee: Yellow vs. Pink Bean Button',
        description: 'Yellow (Drippin\' House Blend) = hold Large to lock; Pink (Kona Blend) = hold Medium to lock.',
        estimatedMinutes: 4,
        steps: [
          'Yellow → hold Large until machine locks basket. Pink → hold Medium until machine locks basket.',
          'Confirm the correct color is selected on the grinder before pressing.',
        ],
        competencyCriteria: [
          'States Yellow Drippin\' = hold Large; Pink Kona Blend = hold Medium',
        ],
      },
      {
        id: 'bb1-9-3',
        name: '3.1 Drip Coffee: Retail Bean Grind Sizes for Customers',
        description: 'When grinding beans for customers, ask how they brew at home: Coarse = French Press/Cold Brew, Medium = Drip/Pour-over, Fine = Espresso.',
        estimatedMinutes: 4,
        steps: [
          'RETAIL BEAN GRINDING for customers: ask how they brew at home. Coarse = French Press/Cold Brew. Medium = Drip/Pour-over. Fine = Espresso.',
          'Select the appropriate grind setting before grinding the customer\'s beans.',
        ],
        competencyCriteria: [
          'States grind sizes for customers: Coarse (French Press/Cold Brew), Medium (Drip), Fine (Espresso)',
        ],
      },
      {
        id: 'bb1-9-4',
        name: '3.1 Tea Brewing: Green Tea (8 Bags, No Filter, Cool Before Fridge)',
        description: 'Brew green tea with 8 Harney & Sons bags, no filter in the basket, hold Large to lock, and allow to cool completely before refrigerating.',
        estimatedMinutes: 4,
        steps: [
          'GREEN TEA: grab Green Tea Pitcher. Get 8 bags of Harney & Sons Green Tea. Carefully unstick paper tag from pouch; while holding tag, cut halfway down the string — letting bag drop into pitcher. Place basket in machine labeled "Use to Brew Tea" (empty, no filter for green tea). Hold Large until machine locks. Full cycle. Place lid. Use By: 2 days. Allow to cool completely before refrigerating.',
        ],
        competencyCriteria: [
          'Brews Green Tea correctly (8 bags, no filter in basket, hold Large, cool before fridge)',
        ],
      },
      {
        id: 'bb1-9-5',
        name: '3.1 Tea Brewing: Black Tea (1 Bag, No Filter, Cool Before Fridge)',
        description: 'Brew black tea with 1 bag, no filter in the basket, hold Large to lock, and allow to cool completely before refrigerating.',
        estimatedMinutes: 4,
        steps: [
          'BLACK TEA: grab Black Tea Pitcher. Pull basket; empty/rinse if needed. Place 1 black tea bag in brewing basket with NO filter. Hold Large until locked. Full cycle. Lid on. Use By: 2 days. Cool completely before refrigerating.',
        ],
        competencyCriteria: [
          'Brews Black Tea correctly (1 bag, no filter, hold Large, cool before fridge)',
        ],
      },
      {
        id: 'bb1-9-6',
        name: '3.1 Tea Brewing: Hibiscus Tea (1.5 Scoops, Paper Filter, Ice Pitcher, Fridge Immediately)',
        description: 'Brew hibiscus tea with 1.5 scoops and a paper filter, fill the pitcher with ice first, hold Medium to lock, and refrigerate immediately — it is ready to use right away.',
        estimatedMinutes: 4,
        steps: [
          'HIBISCUS TEA: grab Hibiscus Tea Pitcher and fill with ice. Pull basket; empty/rinse if needed. Place paper filter in basket and add 1.5 scoops of hibiscus tea grounds into filter. Hold Medium until locked. Full cycle. Lid on. Use By: 2 days. Place in refrigerator immediately — this tea is ready to use right away.',
        ],
        competencyCriteria: [
          'Brews Hibiscus Tea correctly (1.5 scoops, paper filter, fill pitcher with ice first, hold Medium, fridge immediately)',
        ],
      },
      {
        id: 'bb1-9-7',
        name: '3.1 Tea Brewing: Use By Date — 2 Days from Brew Date',
        description: 'All brewed teas have a Use By Date of 2 days from the brew date — label every pitcher.',
        estimatedMinutes: 4,
        steps: [
          'Write Use By Date on each tea pitcher lid: 2 days from the brew date.',
          'Do not refrigerate until the tea has cooled completely (except Hibiscus — refrigerate immediately).',
        ],
        competencyCriteria: [
          'States Use By Date for all teas: 2 days from brew date',
        ],
      },
      {
        id: 'bb1-10-1',
        name: '3.1 Cleaning: Sweeping Under Furniture & Fridges',
        description: 'Sweep correctly, including under all furniture, fridges, and racks — not just open floor areas.',
        estimatedMinutes: 6,
        steps: [
          'SWEEPING: locate broom and dustpan on the designated hanging rack. Sweep properly including under furniture, fridges, and racks.',
          'DISHES: already covered in 3-compartment sink (Section 2.1). Quick refresh — wash some dishes for the team.',
          'MOPPING: locate mop, mopping liquid, and bucket. If flat velcro mop handle: place microfiber rag flat on floor and attach velcro part diagonally over rag. Correct ratio of mopping liquid to water (check container if unsure). Mop must be clean before use. Demonstrate "windshield wiper" movements while moving backwards toward an exit. Clean table bases, cove bases, edges, corners, and hidden spots.',
          'TRASH: show how to change trash bags — correct bag size for each can. Large bags for large cans and espresso grounds can (heavier). Small bags for lobby, back, and restroom cans. Bags should not be visible — tuck in and hide. Only lids visible. Cardboard boxes: break down and place in separate can or empty box for recycling dumpster. If a bag drips liquid: clean up immediately to prevent slips. If any area is wet, place "Caution — Wet Floor" sign. Wash hands after changing trash.',
          'LOBBY & RESTROOM CHECKS: every lobby check = check on customers. Ask how their drinks taste, how their day is going, if they need anything. Wipe down tables (sanitizing rag or disinfectant spray). Ask occupied tables if they need a refresh. Wipe furniture crumbs. Sweep trash and crumbs. If a rag touches the floor — discard immediately. Wet area = Wet Floor sign. Check condiment area: restock straws, sugars, utensils, napkins. Check restroom: trash, toilet paper, toilet seat covers. Clean water spills on floor and around sink.',
          'PASTRY CASE & GLASS: use a dry brown paper towel and glass cleaner. If no glass cleaner, use wet rag then dry rag — no streaks or fogging. Do NOT use glass cleaner when pastries are in the case (contamination risk).',
          'COUNTERS & BARISTA DISHES: wipe spills right away. Rinse dishes right after use. When rush catches up: grab a rag from the sanitizing bucket, wring out completely (no dripping), wipe counter, rinse rag under running water (keeps sanitizer clean longer), drop back in bucket. Take dirty dishes to bar sink and rinse with automatic rinser. Remind other baristas to clean as they go — team job.',
        ],
        competencyCriteria: [
          'Sweeps correctly including under furniture and fridges',
        ],
      },
      {
        id: 'bb1-10-2',
        name: '3.1 Cleaning: Mop Technique — Windshield Wiper Moving Backward',
        description: 'Mop with a windshield-wiper motion moving backward toward an exit; clean table bases, cove bases, edges, corners, and hidden spots.',
        estimatedMinutes: 6,
        steps: [
          'MOPPING: locate mop, mopping liquid, and bucket. If flat velcro mop handle: place microfiber rag flat on floor and attach velcro part diagonally over rag. Correct ratio of mopping liquid to water (check container if unsure). Mop must be clean before use. Demonstrate "windshield wiper" movements while moving backwards toward an exit. Clean table bases, cove bases, edges, corners, and hidden spots.',
        ],
        competencyCriteria: [
          'Mops with windshield-wiper motion moving backward; cleans edges and corners',
        ],
      },
      {
        id: 'bb1-10-3',
        name: '3.1 Cleaning: Correct Trash Bag Size & Concealment',
        description: 'Use the correct bag size for each trash can and conceal the bag fully so only the lid is visible — never leave a bag visible above the can.',
        estimatedMinutes: 6,
        steps: [
          'TRASH: show how to change trash bags — correct bag size for each can. Large bags for large cans and espresso grounds can (heavier). Small bags for lobby, back, and restroom cans. Bags should not be visible — tuck in and hide. Only lids visible.',
          'If a bag drips liquid: clean up immediately to prevent slips. If any area is wet, place "Caution — Wet Floor" sign.',
        ],
        competencyCriteria: [
          'Uses correct bag size for each trash can; conceals bag properly',
        ],
      },
      {
        id: 'bb1-10-4',
        name: '3.1 Cleaning: Break Down Cardboard for Recycling',
        description: 'Break down all cardboard boxes and place them in the separate recycling can or box — never mix cardboard with regular trash.',
        estimatedMinutes: 6,
        steps: [
          'Cardboard boxes: break down and place in separate can or empty box for recycling dumpster.',
          'Never mix cardboard with regular trash.',
        ],
        competencyCriteria: [
          'Breaks down cardboard for recycling; does not mix with regular trash',
        ],
      },
      {
        id: 'bb1-10-5',
        name: '3.1 Cleaning: Wash Hands After Changing Trash',
        description: 'Always wash hands immediately after changing trash bags — no exceptions.',
        estimatedMinutes: 6,
        steps: [
          'Wash hands after changing trash.',
          'Do not handle food, drinks, or equipment until hands are washed.',
        ],
        competencyCriteria: [
          'Washes hands after changing trash',
        ],
      },
      {
        id: 'bb1-10-6',
        name: '3.1 Cleaning: Check on Customers During Every Lobby Check',
        description: 'Every lobby check is also a customer check — ask how their drinks taste, how their day is going, and if they need anything.',
        estimatedMinutes: 6,
        steps: [
          'LOBBY & RESTROOM CHECKS: every lobby check = check on customers. Ask how their drinks taste, how their day is going, if they need anything. Wipe down tables (sanitizing rag or disinfectant spray). Ask occupied tables if they need a refresh. Wipe furniture crumbs. Sweep trash and crumbs. If a rag touches the floor — discard immediately. Wet area = Wet Floor sign.',
          'Check condiment area: restock straws, sugars, utensils, napkins. Check restroom: trash, toilet paper, toilet seat covers. Clean water spills on floor and around sink.',
        ],
        competencyCriteria: [
          'Checks on customers during every lobby check',
        ],
      },
      {
        id: 'bb1-10-7',
        name: '3.1 Cleaning: Glass Cleaner Only When Pastry Case Is Empty',
        description: 'Never use glass cleaner on the pastry case while pastries are inside — contamination risk. Always remove pastries first.',
        estimatedMinutes: 6,
        steps: [
          'PASTRY CASE & GLASS: use a dry brown paper towel and glass cleaner. If no glass cleaner, use wet rag then dry rag — no streaks or fogging. Do NOT use glass cleaner when pastries are in the case (contamination risk).',
          'Remove all pastries before cleaning the glass; return them after the glass is fully dry.',
        ],
        competencyCriteria: [
          'Uses glass cleaner only when pastry case is empty',
        ],
      },
      {
        id: 'bb1-10-8',
        name: '3.1 Cleaning: Counter Wipe with Wrung-Out Sanitizing Rag',
        description: 'Wipe counters with a fully wrung-out sanitizing rag — no dripping — and rinse the rag under running water after each wipe to extend the sanitizer\'s effectiveness.',
        estimatedMinutes: 6,
        steps: [
          'COUNTERS & BARISTA DISHES: wipe spills right away. When rush catches up: grab a rag from the sanitizing bucket, wring out completely (no dripping), wipe counter, rinse rag under running water (keeps sanitizer clean longer), drop back in bucket.',
          'Take dirty dishes to bar sink and rinse with automatic rinser. Remind other baristas to clean as they go — team job.',
        ],
        competencyCriteria: [
          'Wipes counter with wrung-out sanitizing rag; rinses rag after use',
        ],
      },
      // ── Day 3: 3.2 Espresso Shot Execution ────────────────────────────────
      {
        id: 'bb1-11-1',
        name: '3.2 Coffee Theory — Grinder Approach & Release',
        description: 'Approach the grinder with a slight forward angle, bring the portafilter down past the retaining hook, and release it before grinding starts.',
        estimatedMinutes: 8,
        steps: [
          'The grinder is a highly sensitive machine — treat it with care.',
          'Rotate the hopper clockwise to engage. If screen stays off, verify the switch behind the grinder (above power cable) is ON.',
          'DOSE: grinder is calibrated to weigh a specific amount of grounds (typically 16–18g — confirm with manager).',
          'Locate a portafilter. If grounds are in it, knock gently on the crossbar of the knock box to release. Wipe with the dedicated dry rag near the knock box — remove excess grounds only; deep cleaning is not required.',
          'Approach the grinder with a slight forward angle, bring portafilter down past the retaining hook, then let go. Grinder will shine a red light while weighing, then start grinding.',
          'Do NOT touch the portafilter during grinding — this causes the grinder to dispense more beans than needed.',
          'Monitor the grounds stream — must fall STRAIGHT DOWN THE CENTER. Deviation indicates a clog (see troubleshooting guide).',
          'When grinding completes, grasp the portafilter handle and remove by pulling back at a slight forward angle to disengage from the scale.',
          'Do NOT shake the portafilter while it rests on the scale — this can decalibrate or damage the scale components.',
          'Tap the portafilter lightly against the palm of your hand to level the grounds.',
          'THINGS TO KEEP IN MIND: Do not grind beans unless they will be used immediately. Do not lock a portafilter into the espresso machine unless extraction is imminent. Do not use the hot water spout to rinse shot cups — this drains the hot water boiler and triggers a temperature recovery cycle (all machine lights off, extraction disabled until boiler returns to ~200°F).',
        ],
        competencyCriteria: [
          'Approaches grinder with slight forward angle; releases portafilter before grinding starts',
        ],
      },
      {
        id: 'bb1-11-2',
        name: '3.2 Coffee Theory — Do Not Touch Portafilter During Grind',
        description: 'Never touch the portafilter during the grind cycle — contact causes the grinder to dispense more beans than calibrated.',
        estimatedMinutes: 8,
        steps: [
          'Do NOT touch the portafilter during grinding — this causes the grinder to dispense more beans than needed.',
          'Keep hands away from the portafilter until the red light stops and grinding completes.',
        ],
        competencyCriteria: [
          'Does NOT touch portafilter during the grind cycle',
        ],
      },
      {
        id: 'bb1-11-3',
        name: '3.2 Coffee Theory — Monitor Grounds Stream for Clog',
        description: 'Watch the grounds stream during grinding — it must fall straight down the center. Any deviation indicates a clog.',
        estimatedMinutes: 8,
        steps: [
          'Monitor the grounds stream — must fall STRAIGHT DOWN THE CENTER. Deviation indicates a clog (see troubleshooting guide).',
          'Stop and address a clog before continuing — do not use off-center grounds.',
        ],
        competencyCriteria: [
          'Monitors grounds stream — falls straight down center; knows deviation means a clog',
        ],
      },
      {
        id: 'bb1-11-4',
        name: '3.2 Coffee Theory — Remove Portafilter with Forward Angle Pull',
        description: 'After grinding completes, grasp the portafilter handle and remove it by pulling back at a slight forward angle to disengage from the scale — never shake it while on the scale.',
        estimatedMinutes: 7,
        steps: [
          'When grinding completes, grasp the portafilter handle and remove by pulling back at a slight forward angle to disengage from the scale.',
          'Do NOT shake the portafilter while it rests on the scale — this can decalibrate or damage the scale components.',
        ],
        competencyCriteria: [
          'Removes portafilter with slight forward angle pull after grinding',
        ],
      },
      {
        id: 'bb1-11-5',
        name: '3.2 Coffee Theory — Tap Portafilter to Level Grounds',
        description: 'After dosing, tap the portafilter lightly against the palm of your hand to level the grounds before tamping.',
        estimatedMinutes: 7,
        steps: [
          'Tap the portafilter lightly against the palm of your hand to level the grounds.',
          'Grounds should be evenly distributed across the basket before proceeding to tamp.',
        ],
        competencyCriteria: [
          'Taps portafilter on palm to level grounds after dosing',
        ],
      },
      {
        id: 'bb1-11-6',
        name: '3.2 Coffee Theory — Three "Do Not" Rules for Espresso Workflow',
        description: 'Never grind beans unless immediately used; never lock a portafilter unless extraction is imminent; never use the hot water spout to rinse shot cups.',
        estimatedMinutes: 7,
        steps: [
          'THINGS TO KEEP IN MIND: Do not grind beans unless they will be used immediately. Do not lock a portafilter into the espresso machine unless extraction is imminent. Do not use the hot water spout to rinse shot cups — this drains the hot water boiler and triggers a temperature recovery cycle (all machine lights off, extraction disabled until boiler returns to ~200°F).',
          'Review each rule and its consequence with the new hire before moving on.',
        ],
        competencyCriteria: [
          'States the 3 "do not" rules: no grind unless immediate use; no lock unless imminent extraction; no hot water spout for shot cups',
        ],
      },
      {
        id: 'bb1-12-1',
        name: '3.2 Tamping: Apply Level, Even Pressure',
        description: 'Whether using the automatic or manual tamper, apply level and even pressure — approximately 30 lbs for the manual tamper.',
        estimatedMinutes: 5,
        steps: [
          'AUTOMATIC TAMPER: slide portafilter under the tamper and wait for the machine to tamp the grounds. Pull portafilter out and check for a flat surface. Push off any grounds on the rim or handle into a garbage receptacle. If grounds have an indent: press "SET" to bring cylinder down, use dry rag/brush to clean the bottom, press "SET" again to pull cylinder up, then stamp the grounds again.',
          'MANUAL TAMPER: place portafilter over rubber mat. Using the manual tamper, apply even and level pressure of approximately 30 lbs over the grounds. Clear stray grounds from the rim and handle into a garbage receptacle.',
          'If grounds are NOT level: repeat the tamping process. Unleveled grounds cause water to slide to the lower end rather than distributing evenly — resulting in channeling and under-extracted shots.',
        ],
        competencyCriteria: [
          'Applies level, even pressure when tamping (automatic or manual)',
        ],
      },
      {
        id: 'bb1-12-2',
        name: '3.2 Tamping: Check for Flat, Level Surface After Tamping',
        description: 'After tamping, inspect the surface — it must be flat and level. If not, repeat the tamp.',
        estimatedMinutes: 5,
        steps: [
          'Pull portafilter out and check for a flat surface.',
          'If grounds are NOT level: repeat the tamping process.',
        ],
        competencyCriteria: [
          'Checks surface for a flat level result after tamping',
        ],
      },
      {
        id: 'bb1-12-3',
        name: '3.2 Tamping: Clear Stray Grounds from Rim Before Locking',
        description: 'Clear all stray grounds from the portafilter rim and handle before locking it into the espresso machine.',
        estimatedMinutes: 5,
        steps: [
          'Push off any grounds on the rim or handle into a garbage receptacle.',
          'Confirm the rim is clean before locking the portafilter into the machine head.',
        ],
        competencyCriteria: [
          'Clears stray grounds from portafilter rim and handle before locking into machine',
        ],
      },
      {
        id: 'bb1-12-4',
        name: '3.2 Tamping: Why Level Tamping Matters',
        description: 'Uneven tamping causes channeling — water slides to the lower end of the grounds instead of distributing evenly, resulting in under-extracted shots.',
        estimatedMinutes: 5,
        steps: [
          'If grounds are NOT level: repeat the tamping process. Unleveled grounds cause water to slide to the lower end rather than distributing evenly — resulting in channeling and under-extracted shots.',
          'Explain the channeling concept to the new hire and demonstrate an uneven tamp for comparison.',
        ],
        competencyCriteria: [
          'States why level tamping matters (uneven = channeling = bad extraction)',
        ],
      },
      {
        id: 'bb1-13-1',
        name: '3.2 Espresso Execution: Flush Group Head Before Every Shot',
        description: 'Always flush the group head before pulling a shot — press the whirlpool icon, run water for 1 second, then confirm it stops.',
        estimatedMinutes: 8,
        steps: [
          'FLUSH group head: press the rightmost button (whirlpool icon) above the head. Tap ON, run water for 1 second. Machine should auto-stop after 1 second; if not, tap OFF.',
          'ALIGN portafilter: slot the "ears" at 45 degrees into the grooves inside the machine head. The portafilter seats upward into the head once aligned.',
          'LOCK: twist clockwise applying ~15 lbs of force until ears are at ~90 degrees.',
          'PULL: press the double shot extraction button. All shots are pulled as doubles unless otherwise specified. For a single shot: either pour half of a double OR place a shot cup below each spout. Do NOT pull a true single.',
          'TARGET TIME: watch the machine display. The pull time must run between 10–15 seconds.',
          '  9 seconds → usable but adjust immediately (move lever toward FINER/smaller number).',
          '  ≤8 seconds → DISCARD. Adjust finer immediately.',
          '  16–18 seconds → usable but adjust immediately (move lever toward COARSER/larger number).',
          '  ≥19 seconds → DISCARD. Adjust coarser immediately.',
          'Adjust grinder a few line markings at a time; pull a test shot between adjustments.',
          'DEAD SHOT: once the crema on top dissipates, the shot is dead — discard immediately before building any drink.',
          'QUALITY CHECK: New Hire runs multiple practice shots. Trainer checks color, volume, and taste. Look for: espresso stream through the center (not sides); consistent grounds pile; flat surface after tamp; pull time in range; consistent liquid amount.',
          'Remind New Hire: during a rush, shots are pulled to keep up with demand (only pull a few extra when few drinks to make). Avoid pulling shots far in advance — they go dead.',
          'HALF-CAF and DECAF pull times may be up to 25 seconds.',
        ],
        competencyCriteria: [
          'Flushes group head before every shot',
        ],
      },
      {
        id: 'bb1-13-2',
        name: '3.2 Espresso Execution: Align at 45° and Lock to 90°',
        description: 'Align the portafilter ears at 45° into the machine head grooves, then twist clockwise with ~15 lbs of force until the ears reach ~90°.',
        estimatedMinutes: 8,
        steps: [
          'ALIGN portafilter: slot the "ears" at 45 degrees into the grooves inside the machine head. The portafilter seats upward into the head once aligned.',
          'LOCK: twist clockwise applying ~15 lbs of force until ears are at ~90 degrees.',
        ],
        competencyCriteria: [
          'Aligns portafilter at 45° and locks to ~90° with ~15 lbs of force',
        ],
      },
      {
        id: 'bb1-13-3',
        name: '3.2 Espresso Execution: Pull All Shots as Doubles',
        description: 'All shots are pulled as doubles — never pull a true single. For a single shot, pour half a double or use one spout.',
        estimatedMinutes: 8,
        steps: [
          'PULL: press the double shot extraction button. All shots are pulled as doubles unless otherwise specified. For a single shot: either pour half of a double OR place a shot cup below each spout. Do NOT pull a true single.',
        ],
        competencyCriteria: [
          'Pulls all shots as doubles (no true singles)',
        ],
      },
      {
        id: 'bb1-13-4',
        name: '3.2 Espresso Execution: Hit the 10–15 Second Target Window',
        description: 'Consistently pull shots within the 10–15 second target window — 9 seconds is usable but adjust; 16–18 seconds is usable but adjust.',
        estimatedMinutes: 8,
        steps: [
          'TARGET TIME: watch the machine display. The pull time must run between 10–15 seconds.',
          '  9 seconds → usable but adjust immediately (move lever toward FINER/smaller number).',
          '  16–18 seconds → usable but adjust immediately (move lever toward COARSER/larger number).',
          'Adjust grinder a few line markings at a time; pull a test shot between adjustments.',
        ],
        competencyCriteria: [
          'Consistently hits the 10–15 second target window',
        ],
      },
      {
        id: 'bb1-13-5',
        name: '3.2 Espresso Execution: Adjust Grind Immediately When Out of Range',
        description: 'When a shot falls outside the target window, adjust the grind immediately — finer if too fast, coarser if too slow.',
        estimatedMinutes: 7,
        steps: [
          'Adjust grinder a few line markings at a time; pull a test shot between adjustments.',
          '  9 seconds → move lever toward FINER/smaller number.',
          '  16–18 seconds → move lever toward COARSER/larger number.',
        ],
        competencyCriteria: [
          'Adjusts grind immediately when shot falls outside range (finer if too fast, coarser if too slow)',
        ],
      },
      {
        id: 'bb1-13-6',
        name: '3.2 Espresso Execution: Discard Shots at ≤8 or ≥19 Seconds',
        description: 'Discard any shot that pulls at 8 seconds or less, or 19 seconds or more — no hesitation.',
        estimatedMinutes: 7,
        steps: [
          '  ≤8 seconds → DISCARD. Adjust finer immediately.',
          '  ≥19 seconds → DISCARD. Adjust coarser immediately.',
          'Never use a shot that falls in the discard range — even during a rush.',
        ],
        competencyCriteria: [
          'Discards shots at ≤8 seconds or ≥19 seconds without hesitation',
        ],
      },
      {
        id: 'bb1-13-7',
        name: '3.2 Espresso Execution: Identify and Discard a Dead Shot',
        description: 'Once the crema on top of a shot dissipates, the shot is dead — discard it immediately before building any drink.',
        estimatedMinutes: 7,
        steps: [
          'DEAD SHOT: once the crema on top dissipates, the shot is dead — discard immediately before building any drink.',
          'Practice identifying the crema dissipation point during quality check repetitions.',
        ],
        competencyCriteria: [
          'Identifies and discards a dead shot (crema dissipated) before building any drink',
        ],
      },
      {
        id: 'bb1-13-8',
        name: '3.2 Espresso Execution: Half-Caf & Decaf Pull Time Exception',
        description: 'Half-caf and decaf shots may pull up to 25 seconds — this is normal and acceptable for those bean types.',
        estimatedMinutes: 7,
        steps: [
          'HALF-CAF and DECAF pull times may be up to 25 seconds.',
          'Do not adjust the grinder for a half-caf or decaf shot that pulls up to 25 seconds — this is within spec.',
        ],
        competencyCriteria: [
          'States half-caf/decaf pull times can go up to 25 seconds',
        ],
      },
      // ── Day 4: Supreme Iced Drinks ─────────────────────────────────────────
      {
        id: 'bb1-14-1',
        name: 'Day 4 — Supreme Iced Size Chart: Shot Count from Memory',
        description: 'Recite the shot count for all 4 iced Supreme sizes from memory: Small=1, Medium=2, Large=2+1 free, X-tra Large=4.',
        estimatedMinutes: 8,
        steps: [
          'Trainer grabs one Small, Medium, Large, and X-tra Large empty iced cup as visual references.',
          'SHOT CHART: Small 12oz → 1 shot. Medium 16oz → 2 shots. Large 24oz → 2 shots (+1 free optional). X-tra Large 32oz → 4 shots. Go over several times; ask New Hire to recite from memory.',
          'HALF & HALF CHART: Small → 2 oz. Medium → 2½ oz. Large → 2½ oz. X-tra Large → 5 oz. Go over several times; ask New Hire to recite from memory.',
          'FILL-TO-LINE CHART (total liquid after all ingredients): Small → 8 oz. Medium → 10 oz. Large → 12 oz. X-tra Large → 20 oz. Go over several times; ask New Hire to recite from memory.',
          'MILK: standard milk = Whole Milk. "Made As Normal" on the ticket = Whole Milk. If ticket lists a specific milk, use that instead. Barista checks the ticket every time before pouring.',
          'After all three charts, point New Hire to the Barista Cheat Sheet for review.',
        ],
        competencyCriteria: [
          'Recites shot count for all 4 sizes from memory (1 / 2 / 2+1 free / 4)',
        ],
      },
      {
        id: 'bb1-14-2',
        name: 'Day 4 — Supreme Iced Size Chart: Half & Half Oz from Memory',
        description: 'Recite the Half & Half amount for all 4 iced Supreme sizes from memory: Small=2 oz, Medium=2½ oz, Large=2½ oz, X-tra Large=5 oz.',
        estimatedMinutes: 8,
        steps: [
          'HALF & HALF CHART: Small → 2 oz. Medium → 2½ oz. Large → 2½ oz. X-tra Large → 5 oz. Go over several times; ask New Hire to recite from memory.',
          'Use the empty cups as visual cues until the new hire can recite without them.',
        ],
        competencyCriteria: [
          'Recites Half & Half oz for all 4 sizes from memory (2 / 2½ / 2½ / 5)',
        ],
      },
      {
        id: 'bb1-14-3',
        name: 'Day 4 — Supreme Iced Size Chart: Fill-to-Line from Memory',
        description: 'Recite the fill-to-line for all 4 iced Supreme sizes from memory: Small=8 oz, Medium=10 oz, Large=12 oz, X-tra Large=20 oz.',
        estimatedMinutes: 7,
        steps: [
          'FILL-TO-LINE CHART (total liquid after all ingredients): Small → 8 oz. Medium → 10 oz. Large → 12 oz. X-tra Large → 20 oz. Go over several times; ask New Hire to recite from memory.',
          'After all three charts, point New Hire to the Barista Cheat Sheet for review.',
        ],
        competencyCriteria: [
          'Recites fill-to-line for all 4 sizes from memory (8 / 10 / 12 / 20 oz)',
        ],
      },
      {
        id: 'bb1-14-4',
        name: 'Day 4 — Supreme Iced: Standard Milk Is Whole Milk',
        description: '"Made As Normal" on the ticket means Whole Milk. Always check the ticket before pouring — if a specific milk is listed, use that instead.',
        estimatedMinutes: 7,
        steps: [
          'MILK: standard milk = Whole Milk. "Made As Normal" on the ticket = Whole Milk. If ticket lists a specific milk, use that instead. Barista checks the ticket every time before pouring.',
          'Drill the new hire: "What milk do you use if the ticket says Made As Normal?" Answer: Whole Milk.',
        ],
        competencyCriteria: [
          'States standard milk is Whole Milk; "Made As Normal" = Whole Milk',
        ],
      },
      {
        id: 'bb1-15-1',
        name: 'Day 4 — Supreme Iced: Correct Order of Operations',
        description: 'Execute the correct order of operations for iced supremes: flavors → espresso → whisk → milk → whisk → pour over ice → TOM-TOM → drizzle.',
        estimatedMinutes: 8,
        steps: [
          'ORDER OF OPERATIONS (in measuring cup): flavors → espresso → whisk → milk → final whisk. Pour over ice in drink cup → TOM-TOM. Drizzle after pour (around the rim — cascades down inside walls).',
          'TOM-TOM = mixing by quickly pouring the liquid back and forth between measuring cup and drink cup. Pour about half at a time — pouring everything at once can overflow.',
          'MAUI MILK builds: same oz as Half & Half (2 / 2½ / 2½ / 5 oz). Check ticket: if it says "MAUI MILK OK," use Maui Milk in place of Half & Half.',
          'MAUI LATTE EXCEPTION: Maui Milk goes FIRST (not last) so ratios come out correct. Order: Maui Milk → espresso → milk. Know the Maui chart: ¾ Maui = standard Maui Latte; ½ Maui = less sweet; ¼ Maui = least sweet; Full Maui = extra sweet (espresso then Maui to fill-to-line).',
          'PRACTICE — Sandy Blonde Medium 16oz: 2 pumps white chocolate sauce + ¾ pump Caramel sauce → 2 espresso shots → WHISK THOROUGHLY → 2½ oz Half & Half → Milk of Choice to 10 oz → pour over ice → TOM-TOM → Caramel drizzle around rim.',
          'Lid on without touching the mouth opening. Wipe spills off cup. Replace lid if it gets dirty — never wipe a dirty lid. Drink ticket goes on TOP of the lid, not covering any Makenna branding.',
          'PRACTICE — The Ben Small 12oz (Maui Milk build): 1½ pumps chocolate mac nut syrup + ½ pump banana syrup → 1 espresso shot → (no whisk — syrup only, no powder/sauce) → 2 oz Maui Milk → Milk of Choice to 8 oz → pour over ice → TOM-TOM.',
          'Have New Hire retrace every step out loud. Use Q&A on every drink — forces recall rather than just listening.',
        ],
        competencyCriteria: [
          'Executes the correct order of operations: flavors → espresso → whisk → milk → whisk → pour → TOM-TOM → drizzle',
        ],
      },
      {
        id: 'bb1-15-2',
        name: 'Day 4 — Supreme Iced: TOM-TOM Technique',
        description: 'TOM-TOM correctly by pouring about half at a time between the measuring cup and drink cup — pouring everything at once can overflow.',
        estimatedMinutes: 8,
        steps: [
          'TOM-TOM = mixing by quickly pouring the liquid back and forth between measuring cup and drink cup. Pour about half at a time — pouring everything at once can overflow.',
          'Practice the TOM-TOM motion until it feels controlled and natural.',
        ],
        competencyCriteria: [
          'TOM-TOM correctly (half at a time; does not overflow)',
        ],
      },
      {
        id: 'bb1-15-3',
        name: 'Day 4 — Supreme Iced: Build Sandy Blonde Medium from Memory',
        description: 'Build the Sandy Blonde Medium to spec without iPad reference: 2 pumps white chocolate sauce + ¾ pump Caramel → 2 shots → whisk → 2½ oz H&H → milk to 10 oz → ice → TOM-TOM → Caramel drizzle.',
        estimatedMinutes: 8,
        steps: [
          'PRACTICE — Sandy Blonde Medium 16oz: 2 pumps white chocolate sauce + ¾ pump Caramel sauce → 2 espresso shots → WHISK THOROUGHLY → 2½ oz Half & Half → Milk of Choice to 10 oz → pour over ice → TOM-TOM → Caramel drizzle around rim.',
          'Have New Hire retrace every step out loud. Use Q&A on every drink — forces recall rather than just listening.',
        ],
        competencyCriteria: [
          'Builds Sandy Blonde Medium to spec without iPad reference',
        ],
      },
      {
        id: 'bb1-15-4',
        name: 'Day 4 — Supreme Iced: Maui Milk Ticket Check & Oz',
        description: 'Check the ticket before using Maui Milk — it requires "MAUI MILK OK." Maui Milk oz matches Half & Half oz (2 / 2½ / 2½ / 5).',
        estimatedMinutes: 7,
        steps: [
          'MAUI MILK builds: same oz as Half & Half (2 / 2½ / 2½ / 5 oz). Check ticket: if it says "MAUI MILK OK," use Maui Milk in place of Half & Half.',
          'Never substitute Maui Milk without the ticket authorization.',
        ],
        competencyCriteria: [
          'Checks ticket before using Maui Milk; knows Maui Milk oz matches Half & Half oz',
        ],
      },
      {
        id: 'bb1-15-5',
        name: 'Day 4 — Supreme Iced: Maui Latte Exception — Maui Milk Goes First',
        description: 'For the Maui Latte, Maui Milk goes FIRST (not last) so ratios come out correct — order is Maui Milk → espresso → milk.',
        estimatedMinutes: 7,
        steps: [
          'MAUI LATTE EXCEPTION: Maui Milk goes FIRST (not last) so ratios come out correct. Order: Maui Milk → espresso → milk. Know the Maui chart: ¾ Maui = standard Maui Latte; ½ Maui = less sweet; ¼ Maui = least sweet; Full Maui = extra sweet (espresso then Maui to fill-to-line).',
        ],
        competencyCriteria: [
          'States Maui Latte exception: Maui Milk goes first',
        ],
      },
      {
        id: 'bb1-15-6',
        name: 'Day 4 — Supreme Iced: Lid Placement & Ticket Position',
        description: 'Place the lid without touching the mouth opening; the drink ticket goes on top of the lid without covering any Makenna branding. Replace a dirty lid — never wipe it.',
        estimatedMinutes: 7,
        steps: [
          'Lid on without touching the mouth opening. Wipe spills off cup. Replace lid if it gets dirty — never wipe a dirty lid. Drink ticket goes on TOP of the lid, not covering any Makenna branding.',
          'Confirm ticket is secure and branding is visible before placing at expo.',
        ],
        competencyCriteria: [
          'Places lid without touching mouth opening; ticket on top of lid (no Makenna branding covered)',
        ],
      },
      {
        id: 'bb1-16-1',
        name: 'Day 4 — Mela iPad: Locate and Open the App',
        description: 'Locate the Mela app icon on a closed iPad and open it without assistance.',
        estimatedMinutes: 5,
        steps: [
          'Show New Hire the Mela app icon so they can find it on a closed iPad.',
          'Open Mela. Show where the search bar is. Have New Hire type a drink name.',
          'Drinks come in different styles: Iced, Hot, Blended. New Hire picks the one that matches the drink ticket.',
          'Oz per size: 12 oz Small, 16 oz Medium, 24 oz Large (20 oz for Hot), 32 oz X-tra Large.',
          'PRACTICE: Waikiki Medium 16oz Iced — New Hire searches Waikiki in Mela and builds independently. First time pulling a recipe themselves; should be able to do it with little to no help.',
          'While building: ask New Hire to recite shot count for all 4 sizes, Half & Half oz for all 4 sizes, and fill-to-line for all 4 sizes. This confirms retention before moving on.',
          'Continue having New Hire build more iced Supremes until recipes are second nature and Trainer is confident on non-modified drinks.',
        ],
        competencyCriteria: [
          'Locates and opens Mela on a closed iPad without assistance',
        ],
      },
      {
        id: 'bb1-16-2',
        name: 'Day 4 — Mela iPad: Search by Name and Select Correct Style',
        description: 'Search a drink by name in Mela and select the correct style (Iced, Hot, or Blended) to match the drink ticket.',
        estimatedMinutes: 5,
        steps: [
          'Open Mela. Show where the search bar is. Have New Hire type a drink name.',
          'Drinks come in different styles: Iced, Hot, Blended. New Hire picks the one that matches the drink ticket.',
        ],
        competencyCriteria: [
          'Searches a drink by name and selects the correct style (Iced/Hot/Blended)',
        ],
      },
      {
        id: 'bb1-16-3',
        name: 'Day 4 — Mela iPad: Build Waikiki Medium Iced Independently',
        description: 'Build the Waikiki Medium Iced from Mela with little to no help — this is the first time the new hire pulls a recipe themselves.',
        estimatedMinutes: 5,
        steps: [
          'PRACTICE: Waikiki Medium 16oz Iced — New Hire searches Waikiki in Mela and builds independently.',
          'Continue having New Hire build more iced Supremes until recipes are second nature.',
        ],
        competencyCriteria: [
          'Builds Waikiki Medium Iced from Mela with little to no help',
        ],
      },
      {
        id: 'bb1-16-4',
        name: 'Day 4 — Mela iPad: Recite All Three Size Charts from Memory',
        description: 'While building from Mela, recite shot count, Half & Half oz, and fill-to-line for all 4 sizes from memory — confirms retention before moving on.',
        estimatedMinutes: 5,
        steps: [
          'While building: ask New Hire to recite shot count for all 4 sizes, Half & Half oz for all 4 sizes, and fill-to-line for all 4 sizes. This confirms retention before moving on.',
        ],
        competencyCriteria: [
          'Recites shot count, Half & Half oz, and fill-to-line for all 4 sizes from memory',
        ],
      },
      // ── Day 4: Blended Chillers ───────────────────────────────────────────
      {
        id: 'bb1-17-1',
        name: 'Day 4 — Blended Chillers: Solids in Blender Cup, Liquids in Measuring Cup',
        description: 'Correctly separate ingredients: solids (powders, sauces, cookies, chocolate chips, peanut butter) go in the blender cup; liquids (syrups, espresso, milks) go in the measuring cup.',
        estimatedMinutes: 6,
        steps: [
          'SOLIDS VS. LIQUIDS: solids (powders, sauces, cookies, chocolate chips, peanut butter) go in the BLENDER CUP. Liquids (syrups, espresso, milks) go in the MEASURING CUP.',
          'ORDER OF OPERATIONS — Blender cup: heaping drink cup of ice → powders → sauces → any other solids. Measuring cup: syrups → espresso → milks. Pour measuring cup into blender cup. Lid on. Blend on #4. If drizzle: add to inside of drink cup BEFORE pouring. Pour blended drink into cup (over drizzle if applicable).',
          'HEAPING ICE: heaping = over the rim. Not level, not under the rim.',
          'POWDER SCOOPS CHART: Small → 2 scoops. Medium → 3 scoops. Large → 4 scoops. X-tra Large → 6 scoops. Go over several times; ask New Hire to recite from memory.',
          'MILK FILL-TO-LINE (Blended Chillers): Small → 5 oz. Medium → 6 oz. Large → 7 oz. X-tra Large → 12 oz. Different from Iced fill-to lines.',
          'BLEND: all Makenna blended drinks blend on #4. While blender runs: good moment to rinse the used measuring cup.',
          'SWIRL: after blender stops, pull out blender cup, remove lid, give contents a quick swirl — helps contents mix and makes for an easier pour.',
          'DRIZZLE: goes INSIDE the drink cup BEFORE the blended pour.',
          'PRACTICE — Sandy Kisses Chiller Medium 16oz: Blender: heaping drink cup ice + 3 scoops white chocolate powder + 2 pumps Caramel sauce. Measuring cup: 2 espresso shots + Milk of Choice to 6 oz. Pour measuring cup into blender, lid on, blend on 4. Drink cup: Caramel drizzle inside. Pour blended drink into cup. Optional whipped cream.',
          'After pouring: inspect cup, clean if needed. Clean blender cup and measuring cup — do not leave dirty dishes for the next team member.',
        ],
        competencyCriteria: [
          'Correctly separates solids (blender cup) from liquids (measuring cup)',
        ],
      },
      {
        id: 'bb1-17-2',
        name: 'Day 4 — Blended Chillers: Use Heaping Ice Over the Rim',
        description: 'For blended chillers, fill the drink cup with heaping ice — over the rim, not level, not under the rim.',
        estimatedMinutes: 6,
        steps: [
          'HEAPING ICE: heaping = over the rim. Not level, not under the rim.',
          'Demonstrate the difference between level ice and heaping ice using an empty drink cup.',
        ],
        competencyCriteria: [
          'Uses heaping ice (over the rim of the drink cup)',
        ],
      },
      {
        id: 'bb1-17-3',
        name: 'Day 4 — Blended Chillers: Powder Scoop Chart from Memory',
        description: 'Recite the powder scoop chart for all 4 blended chiller sizes from memory: Small=2, Medium=3, Large=4, X-tra Large=6.',
        estimatedMinutes: 6,
        steps: [
          'POWDER SCOOPS CHART: Small → 2 scoops. Medium → 3 scoops. Large → 4 scoops. X-tra Large → 6 scoops. Go over several times; ask New Hire to recite from memory.',
        ],
        competencyCriteria: [
          'Recites powder scoop chart for all 4 sizes (2 / 3 / 4 / 6)',
        ],
      },
      {
        id: 'bb1-17-4',
        name: 'Day 4 — Blended Chillers: Milk Fill-to-Line from Memory',
        description: 'Recite the blended chiller milk fill-to-line for all 4 sizes from memory: Small=5 oz, Medium=6 oz, Large=7 oz, X-tra Large=12 oz.',
        estimatedMinutes: 6,
        steps: [
          'MILK FILL-TO-LINE (Blended Chillers): Small → 5 oz. Medium → 6 oz. Large → 7 oz. X-tra Large → 12 oz. Different from Iced fill-to lines.',
        ],
        competencyCriteria: [
          'Recites blended milk fill-to-line for all 4 sizes (5 / 6 / 7 / 12 oz)',
        ],
      },
      {
        id: 'bb1-17-5',
        name: 'Day 4 — Blended Chillers: Always Blend on #4',
        description: 'All Makenna blended drinks blend on setting #4 — every time, no exceptions.',
        estimatedMinutes: 6,
        steps: [
          'BLEND: all Makenna blended drinks blend on #4. While blender runs: good moment to rinse the used measuring cup.',
        ],
        competencyCriteria: [
          'Blends on #4 every time',
        ],
      },
      {
        id: 'bb1-17-6',
        name: 'Day 4 — Blended Chillers: Drizzle Inside Cup Before Pouring',
        description: 'If the recipe calls for a drizzle, add it inside the drink cup BEFORE pouring the blended drink — this creates the visual effect as the drink goes in.',
        estimatedMinutes: 6,
        steps: [
          'DRIZZLE: goes INSIDE the drink cup BEFORE the blended pour.',
          'Apply drizzle in a circular motion on the inside walls of the cup before adding the blended drink.',
        ],
        competencyCriteria: [
          'Adds drizzle inside the drink cup BEFORE pouring blended drink',
        ],
      },
      {
        id: 'bb1-17-7',
        name: 'Day 4 — Blended Chillers: Swirl Blender Contents Before Pouring',
        description: 'After the blender stops, remove the lid and give the contents a quick swirl — this helps mix and makes for an easier pour.',
        estimatedMinutes: 6,
        steps: [
          'SWIRL: after blender stops, pull out blender cup, remove lid, give contents a quick swirl — helps contents mix and makes for an easier pour.',
        ],
        competencyCriteria: [
          'Swirls blender contents before pouring',
        ],
      },
      {
        id: 'bb1-17-8',
        name: 'Day 4 — Blended Chillers: Build Sandy Kisses Chiller Medium to Spec',
        description: 'Build the Sandy Kisses Chiller Medium to spec: heaping ice + 3 scoops white chocolate powder + 2 pumps Caramel sauce in blender; 2 shots + milk to 6 oz in measuring cup; Caramel drizzle inside cup before pour.',
        estimatedMinutes: 6,
        steps: [
          'PRACTICE — Sandy Kisses Chiller Medium 16oz: Blender: heaping drink cup ice + 3 scoops white chocolate powder + 2 pumps Caramel sauce. Measuring cup: 2 espresso shots + Milk of Choice to 6 oz. Pour measuring cup into blender, lid on, blend on 4. Drink cup: Caramel drizzle inside. Pour blended drink into cup. Optional whipped cream.',
          'After pouring: inspect cup, clean if needed. Clean blender cup and measuring cup — do not leave dirty dishes for the next team member.',
        ],
        competencyCriteria: [
          'Builds Sandy Kisses Chiller Medium to spec',
        ],
      },
      {
        id: 'bb1-18-1',
        name: 'Day 4 — Whipped Cream: Shake Can Before Every Use',
        description: 'Always shake the whipped cream can a few times before applying — this ensures even pressure and proper texture.',
        estimatedMinutes: 4,
        steps: [
          'Shake the whipped cream can a few times.',
          'Hold the can UPSIDE DOWN with the nozzle just above the rim of the cup.',
          'Press in SHORT BURSTS, spiraling from outside in.',
          'STOP before the cream reaches the top of the rim — easier to add more than remove.',
          'Lid on with the dome. Confirm it seals cleanly before hand-off.',
          'COMMON MISTAKES: holding nozzle down too long; holding can too high above cup; skipping the shake; topping cream past rim so dome won\'t seal.',
          'If customer requested whipped cream on a chiller: add whipped cream and a little more drizzle on top to make it look prettier. Finish with dome lid.',
        ],
        competencyCriteria: [
          'Shakes can before every use',
        ],
      },
      {
        id: 'bb1-18-2',
        name: 'Day 4 — Whipped Cream: Hold Can Upside Down with Nozzle Just Above Rim',
        description: 'Hold the whipped cream can upside down with the nozzle positioned just above the rim of the cup — not too high, not touching.',
        estimatedMinutes: 4,
        steps: [
          'Hold the can UPSIDE DOWN with the nozzle just above the rim of the cup.',
          'COMMON MISTAKES: holding can too high above cup causes a loose, airy result.',
        ],
        competencyCriteria: [
          'Holds can upside down; nozzle just above rim',
        ],
      },
      {
        id: 'bb1-18-3',
        name: 'Day 4 — Whipped Cream: Short Bursts Spiraling Outside-In',
        description: 'Apply whipped cream in short bursts spiraling from outside to in, and stop before the cream reaches the top of the rim.',
        estimatedMinutes: 4,
        steps: [
          'Press in SHORT BURSTS, spiraling from outside in.',
          'STOP before the cream reaches the top of the rim — easier to add more than remove.',
        ],
        competencyCriteria: [
          'Applies in short bursts spiraling outside-in; stops before cream reaches the top',
        ],
      },
      {
        id: 'bb1-18-4',
        name: 'Day 4 — Whipped Cream: Dome Lid Seals Cleanly',
        description: 'After applying whipped cream, place the dome lid and confirm it seals cleanly before handing off the drink.',
        estimatedMinutes: 3,
        steps: [
          'Lid on with the dome. Confirm it seals cleanly before hand-off.',
          'If customer requested whipped cream on a chiller: add whipped cream and a little more drizzle on top to make it look prettier. Finish with dome lid.',
        ],
        competencyCriteria: [
          'Dome lid seals cleanly over the whipped cream',
        ],
      },
      // ── Day 4: Makenna Energy Drinks ──────────────────────────────────────
      {
        id: 'bb1-19-1',
        name: 'Day 4 — Iced Energy Drinks: No Small Size',
        description: 'Iced Makenna Energy Drinks are available in Medium, Large, and X-tra Large ONLY — no Small size.',
        estimatedMinutes: 5,
        steps: [
          'Iced Makenna Energy comes in Medium, Large, and X-tra Large ONLY — no Small.',
          'Most iced Makenna Energy drinks are just syrups + Energy Can. No Half & Half or milk. Check Mela for every drink.',
          'ORDER OF OPERATIONS: in the drink cup → flavor → Makenna Energy → ice top-off.',
          'CAN COUNT: Medium → 1 can. Large → 1½ cans. X-tra Large → 2 cans.',
          'CARBONATION RULE: drinks with Makenna Energy + milk (e.g., Orange Creamsicle) must be poured slow and low. Keep measuring cup close to the drink cup. Large pours cause fizzing and spillage. Do NOT TOM-TOM — mix with a spoon. Push ice cubes down to mix without agitating carbonation.',
          'PRACTICE — Orange Creamsicle Medium 16oz: In drink cup: 2 pumps orange syrup → 1 Energy Can (pour close and slow) → add light ice. In measuring cup: 2½ oz Half & Half → pour into drink cup (slow, close pour) → DO NOT TOM-TOM → mix with spoon → push ice down. Top off with ice.',
          'Light ice goes in after the Energy Can — helps control fizz when milk goes in.',
          'Inspect cup and clean before hand-off.',
        ],
        competencyCriteria: [
          'States iced Energy Drinks have no Small size',
        ],
      },
      {
        id: 'bb1-19-2',
        name: 'Day 4 — Iced Energy Drinks: Can Count for Each Size',
        description: 'Recite the Energy Can count for all 3 iced sizes: Medium=1 can, Large=1½ cans, X-tra Large=2 cans.',
        estimatedMinutes: 5,
        steps: [
          'CAN COUNT: Medium → 1 can. Large → 1½ cans. X-tra Large → 2 cans.',
          'Drill the new hire on can counts before practicing builds.',
        ],
        competencyCriteria: [
          'Recites can count for all 3 sizes (M=1, L=1½, XL=2)',
        ],
      },
      {
        id: 'bb1-19-3',
        name: 'Day 4 — Iced Energy Drinks: Order of Operations',
        description: 'Build iced Energy Drinks in the correct order: flavor first, then the Energy Can, then ice top-off.',
        estimatedMinutes: 5,
        steps: [
          'ORDER OF OPERATIONS: in the drink cup → flavor → Makenna Energy → ice top-off.',
          'Check Mela for the exact recipe on every drink.',
        ],
        competencyCriteria: [
          'States order: flavor → Energy Can → ice top-off',
        ],
      },
      {
        id: 'bb1-19-4',
        name: 'Day 4 — Iced Energy Drinks: Pour Milk Slow and Low — No TOM-TOM',
        description: 'For carbonated Energy Drinks with milk, pour slow and low — keep the measuring cup close to the drink cup. Never TOM-TOM carbonated drinks.',
        estimatedMinutes: 5,
        steps: [
          'CARBONATION RULE: drinks with Makenna Energy + milk (e.g., Orange Creamsicle) must be poured slow and low. Keep measuring cup close to the drink cup. Large pours cause fizzing and spillage. Do NOT TOM-TOM — mix with a spoon. Push ice cubes down to mix without agitating carbonation.',
        ],
        competencyCriteria: [
          'Pours milk slow and low for carbonated drinks; does NOT TOM-TOM',
        ],
      },
      {
        id: 'bb1-19-5',
        name: 'Day 4 — Iced Energy Drinks: Mix with a Spoon for Carbonated + Milk Drinks',
        description: 'For carbonated Energy Drinks that include milk, mix with a spoon by pushing ice cubes down — never TOM-TOM.',
        estimatedMinutes: 5,
        steps: [
          'Do NOT TOM-TOM — mix with a spoon. Push ice cubes down to mix without agitating carbonation.',
          'Light ice goes in after the Energy Can — helps control fizz when milk goes in.',
        ],
        competencyCriteria: [
          'Mixes with a spoon (not TOM-TOM) for carbonated + milk drinks',
        ],
      },
      {
        id: 'bb1-19-6',
        name: 'Day 4 — Iced Energy Drinks: Build Orange Creamsicle Medium to Spec',
        description: 'Build the Orange Creamsicle Medium to spec: 2 pumps orange syrup → 1 Energy Can (slow) → light ice → 2½ oz Half & Half (slow) → spoon mix → top with ice.',
        estimatedMinutes: 5,
        steps: [
          'PRACTICE — Orange Creamsicle Medium 16oz: In drink cup: 2 pumps orange syrup → 1 Energy Can (pour close and slow) → add light ice. In measuring cup: 2½ oz Half & Half → pour into drink cup (slow, close pour) → DO NOT TOM-TOM → mix with spoon → push ice down. Top off with ice.',
          'Inspect cup and clean before hand-off.',
        ],
        competencyCriteria: [
          'Builds Orange Creamsicle Medium to spec',
        ],
      },
      {
        id: 'bb1-20-1',
        name: 'Day 4 — Slushy Energy Drinks: Slushy Flavor Amounts Are Half the Iced Version',
        description: 'Slushy Energy Drink flavor amounts are always half the iced version — for example, 1 pump strawberry iced becomes ½ pump strawberry slushy.',
        estimatedMinutes: 6,
        steps: [
          'Slushy Makenna Energy comes in all 4 sizes: Small, Medium, Large, and X-tra Large.',
          'Most slushy Energy drinks = syrups + Energy slush. No milk. Check Mela for every drink. Drinks with milk follow the same fizz-control rules as iced versions.',
          'ORDER OF OPERATIONS: in drink cup → flavor → Makenna Energy slushy → mix.',
          'SLUSHY FLAVOR TIP: slushy flavor amounts are HALF the iced version. (1 pump strawberry iced → ½ pump strawberry slushy).',
          'Fill slushy a little OVER the rim — the slush compacts after mixing.',
          'Pour slush and flavors into a large steaming pitcher or measuring cup to mix. Some flavors get left behind in the drink cup — this is handled in the next step.',
          'Find a mixing spoon and mix the slush until uniform color. Fastest motion: whirlpool — move spoon in a circle AND up-and-down simultaneously (like whisking eggs).',
          'Once uniform: pour a little into the original drink cup to mix with the syrups left behind. After mixing, pour the rest back into the drink cup.',
          'PRACTICE — Local Juice Slushy Medium 16oz: ½ pump strawberry + ½ pump peach + ½ pump coconut syrup → add Makenna Energy slushy → pour into large pitcher → mix until uniform → pour back into drink cup.',
          'Inspect cup and clean before hand-off.',
        ],
        competencyCriteria: [
          'States slushy flavor amounts are ½ the iced version',
        ],
      },
      {
        id: 'bb1-20-2',
        name: 'Day 4 — Slushy Energy Drinks: Fill Slightly Over the Rim',
        description: 'Fill the slushy slightly over the rim of the drink cup — the slush compacts after mixing, so overfilling accounts for that.',
        estimatedMinutes: 6,
        steps: [
          'Fill slushy a little OVER the rim — the slush compacts after mixing.',
          'Do not pack or compress the slush before mixing.',
        ],
        competencyCriteria: [
          'Fills slushy slightly over the rim (accounts for compaction after mixing)',
        ],
      },
      {
        id: 'bb1-20-3',
        name: 'Day 4 — Slushy Energy Drinks: Whirlpool Mix in a Pitcher Until Uniform',
        description: 'Pour slush into a large pitcher and mix using a whirlpool motion (circular + up-and-down simultaneously) until the color is uniform throughout.',
        estimatedMinutes: 6,
        steps: [
          'Pour slush and flavors into a large steaming pitcher or measuring cup to mix.',
          'Find a mixing spoon and mix the slush until uniform color. Fastest motion: whirlpool — move spoon in a circle AND up-and-down simultaneously (like whisking eggs).',
        ],
        competencyCriteria: [
          'Mixes slush in a pitcher using whirlpool motion until uniform',
        ],
      },
      {
        id: 'bb1-20-4',
        name: 'Day 4 — Slushy Energy Drinks: Pour Back into Original Cup to Pick Up Syrups',
        description: 'After mixing in the pitcher, pour a small amount back into the original drink cup to mix with leftover syrups, then pour the rest in.',
        estimatedMinutes: 6,
        steps: [
          'Once uniform: pour a little into the original drink cup to mix with the syrups left behind. After mixing, pour the rest back into the drink cup.',
        ],
        competencyCriteria: [
          'Pours a little back into the original cup to pick up leftover syrups, then pours the rest',
        ],
      },
      {
        id: 'bb1-20-5',
        name: 'Day 4 — Slushy Energy Drinks: Build Local Juice Slushy Medium to Spec',
        description: 'Build the Local Juice Slushy Medium to spec: ½ pump each of strawberry, peach, and coconut syrup → Energy slushy → mix in pitcher until uniform → pour back.',
        estimatedMinutes: 6,
        steps: [
          'PRACTICE — Local Juice Slushy Medium 16oz: ½ pump strawberry + ½ pump peach + ½ pump coconut syrup → add Makenna Energy slushy → pour into large pitcher → mix until uniform → pour back into drink cup.',
          'Inspect cup and clean before hand-off.',
        ],
        competencyCriteria: [
          'Builds Local Juice Slushy Medium to spec',
        ],
      },
      // ── Day 4: Milk Steaming ───────────────────────────────────────────────
      {
        id: 'bb1-21-1',
        name: 'Day 4 — Milk Steaming: Select the Correct Pitcher Size',
        description: 'Select the correct steaming pitcher size: smallest for Cortado or drip steamed milk, medium for Small or Medium hot drinks, large for Large hot drinks.',
        estimatedMinutes: 7,
        steps: [
          'PITCHER SELECTION: smallest pitcher = Cortado or steamed milk for Drip. Medium pitcher = Small or Medium hot drink. Large pitcher = Large hot drink.',
          'ADD MILK: add milk type(s) to the required oz mark. Note: a Hot Latte requires 2 oz MORE total liquid than the same size iced drink.',
          'MEASURING HALF & HALF OR MAUI MILK: if 2 oz or 2½ oz is needed — Option 1: measure in measuring cup, add to steaming pitcher, top off with Milk of Choice. Option 2: fill pitcher to (total - H&H/Maui oz) with Milk of Choice first, leaving room for the measured addition.',
          'WAND PREP: place white sanitizing bucket under steam wand. Remove rag and wipe wand. Set bucket aside. Push steam wand into the draining grill and purge a few seconds to clear any water.',
          'PITCHER HOLD: dominant hand, 3 fingers in, pinky out, thumb pushing down on handle. If using probe thermometer, secure it with thumb.',
          'WAND POSITION: insert wand into pitcher using the rim as a contact point. Pull against it with slight force for stability. Picture the top of the pitcher as 4 quadrants — wand enters through the left or right quadrant CLOSER to the machine. Lower pitcher so wand tip is just below the milk surface (top of tip = groove marking the union between tip and wand body).',
          'AIR INTRO: open steam pressure knob all the way with a single sliding motion. Correct sound: "tsch tsch" or paper-ripping = air being introduced + whirlpool forming. If no sound: lower pitcher slowly until it appears. Do not drop too quickly — pulling wand out too far causes turbulence and over-aeration.',
          'Continue air intro for ~4–5 seconds, then raise pitcher so wand is fully submerged.',
          'LATTE VOLUME: milk should increase by ~20%.',
          'TEMPERATURE & SHUT-OFF: keep hand on steam pressure knob; close it 10–15 degrees BEFORE target temp (milk continues rising after wand shuts off). Kid\'s: 120°F. Regular: 150°F. Extra hot: 160°F.',
          'WAND CLEANUP: pull pitcher down, set aside. Bring white sanitizing bucket under wand. Pull rag out, clean wand, purge a couple of seconds, set aside.',
          'PITCHER FINISH: tap pitcher on counter and swirl to release surface bubbles. Repeat until milk looks like wet paint.',
          'PRACTICE: New Hire steams milk several times. Trainer helps with technique and offers tips.',
        ],
        competencyCriteria: [
          'Selects correct pitcher size for the drink',
        ],
      },
      {
        id: 'bb1-21-2',
        name: 'Day 4 — Milk Steaming: Add Milk to Correct Oz Mark',
        description: 'Add milk to the correct oz mark in the steaming pitcher; measure Half & Half or Maui Milk precisely before adding.',
        estimatedMinutes: 7,
        steps: [
          'ADD MILK: add milk type(s) to the required oz mark. Note: a Hot Latte requires 2 oz MORE total liquid than the same size iced drink.',
          'MEASURING HALF & HALF OR MAUI MILK: if 2 oz or 2½ oz is needed — Option 1: measure in measuring cup, add to steaming pitcher, top off with Milk of Choice. Option 2: fill pitcher to (total - H&H/Maui oz) with Milk of Choice first, leaving room for the measured addition.',
        ],
        competencyCriteria: [
          'Adds milk to correct oz mark; measures H&H or Maui Milk precisely',
        ],
      },
      {
        id: 'bb1-21-3',
        name: 'Day 4 — Milk Steaming: Purge Wand Before Steaming',
        description: 'Before steaming, purge the steam wand into the draining grill for a few seconds to clear any water from the line.',
        estimatedMinutes: 7,
        steps: [
          'WAND PREP: place white sanitizing bucket under steam wand. Remove rag and wipe wand. Set bucket aside. Push steam wand into the draining grill and purge a few seconds to clear any water.',
        ],
        competencyCriteria: [
          'Purges wand before steaming',
        ],
      },
      {
        id: 'bb1-21-4',
        name: 'Day 4 — Milk Steaming: Wand Position — Correct Quadrant, Tip Just Below Surface',
        description: 'Insert the steam wand into the left or right quadrant closer to the machine, with the wand tip positioned just below the milk surface.',
        estimatedMinutes: 7,
        steps: [
          'WAND POSITION: insert wand into pitcher using the rim as a contact point. Pull against it with slight force for stability. Picture the top of the pitcher as 4 quadrants — wand enters through the left or right quadrant CLOSER to the machine. Lower pitcher so wand tip is just below the milk surface (top of tip = groove marking the union between tip and wand body).',
        ],
        competencyCriteria: [
          'Positions wand in correct quadrant (closer to machine); wand tip just below milk surface',
        ],
      },
      {
        id: 'bb1-21-5',
        name: 'Day 4 — Milk Steaming: Produce the "Tsch Tsch" Air-Intro Sound',
        description: 'Open the steam knob fully in one sliding motion — the correct sound is "tsch tsch" or paper-ripping, indicating air introduction and a whirlpool forming.',
        estimatedMinutes: 7,
        steps: [
          'AIR INTRO: open steam pressure knob all the way with a single sliding motion. Correct sound: "tsch tsch" or paper-ripping = air being introduced + whirlpool forming. If no sound: lower pitcher slowly until it appears. Do not drop too quickly — pulling wand out too far causes turbulence and over-aeration.',
        ],
        competencyCriteria: [
          'Produces the "tsch tsch" air-intro sound within a few seconds of opening steam',
        ],
      },
      {
        id: 'bb1-21-6',
        name: 'Day 4 — Milk Steaming: Introduce Air 4–5 Seconds Then Submerge',
        description: 'Introduce air for approximately 4–5 seconds, then raise the pitcher to fully submerge the wand for the remainder of the steam.',
        estimatedMinutes: 7,
        steps: [
          'Continue air intro for ~4–5 seconds, then raise pitcher so wand is fully submerged.',
          'LATTE VOLUME: milk should increase by ~20%.',
        ],
        competencyCriteria: [
          'Introduces air for 4–5 seconds then submerges fully',
        ],
      },
      {
        id: 'bb1-21-7',
        name: 'Day 4 — Milk Steaming: Shut Off Steam 10–15° Before Target Temp',
        description: 'Close the steam knob 10–15 degrees before the target temperature — milk continues rising after the wand shuts off. Kids=120°F, Regular=150°F, Extra Hot=160°F.',
        estimatedMinutes: 7,
        steps: [
          'TEMPERATURE & SHUT-OFF: keep hand on steam pressure knob; close it 10–15 degrees BEFORE target temp (milk continues rising after wand shuts off). Kid\'s: 120°F. Regular: 150°F. Extra hot: 160°F.',
        ],
        competencyCriteria: [
          'Shuts off steam 10–15 degrees before target temperature',
        ],
      },
      {
        id: 'bb1-21-8',
        name: 'Day 4 — Milk Steaming: Tap and Swirl Until Milk Looks Like Wet Paint',
        description: 'After steaming, tap the pitcher on the counter and swirl to release surface bubbles — repeat until the milk looks like wet paint.',
        estimatedMinutes: 6,
        steps: [
          'PITCHER FINISH: tap pitcher on counter and swirl to release surface bubbles. Repeat until milk looks like wet paint.',
          'PRACTICE: New Hire steams milk several times. Trainer helps with technique and offers tips.',
        ],
        competencyCriteria: [
          'Taps and swirls pitcher until milk looks like wet paint',
        ],
      },
      {
        id: 'bb1-21-9',
        name: 'Day 4 — Milk Steaming: Clean Wand and Purge After Every Steam',
        description: 'After every steam, wipe the wand clean and purge it for a couple of seconds — every single time, no exceptions.',
        estimatedMinutes: 6,
        steps: [
          'WAND CLEANUP: pull pitcher down, set aside. Bring white sanitizing bucket under wand. Pull rag out, clean wand, purge a couple of seconds, set aside.',
        ],
        competencyCriteria: [
          'Cleans wand and purges after every steam',
        ],
      },
      {
        id: 'bb1-22',
        name: 'Day 4 — Milk Steaming: Non-Dairy Milks & Cappuccino',
        description: 'Non-dairy milks have no fat — require significantly more air-intro time. Cappuccino: milk grows ~50%; 2 oz less total liquid than iced same size. Monitor temp closely (less liquid = faster rise).',
        estimatedMinutes: 30,
        steps: [
          'NON-DAIRY MILKS: fat in dairy traps the air introduced during steaming. Lower-fat milks need additional seconds of air intro. Non-dairy milks (Oat, Almond, etc.) have no fat and require significantly more effort to reach target volume.',
          'Practice: New Hire steams low-fat and non-dairy milks to get a feel for the adjustments needed.',
          'CAPPUCCINO: requires MORE air than a latte. Milk should grow ~50% (vs. ~20% for latte).',
          'Total milk for a Cappuccino = 2 oz LESS than total liquid for the same size iced drink.',
          'Begin in the same initial position used for a Latte steam. Once knob is opened, FOLLOW the rising milk surface at a steady pace, continuously introducing air until target volume is reached.',
          'With less liquid in the pitcher, temperature rises FASTER. Monitor thermometer closely and shut knob 10–15 degrees before target temp.',
          'Practice: New Hire textures Whole Milk, Oat Milk, and Almond Milk — aiming for correct temperature without scalding. Focus on: thick microfoam for Latte, thicker foam for Cappuccino.',
        ],
        competencyCriteria: [
          'Steams non-dairy milks with extended air introduction to compensate for no fat',
          'Achieves target volume and temperature for Oat Milk and Almond Milk steams',
          'States cappuccino milk grows ~50% (vs. latte ~20%)',
          'States cappuccino total milk = 2 oz less than the same-size iced drink',
          'Monitors temp closely for cappuccino (less liquid = faster temperature rise)',
          'Produces thick microfoam for latte and thicker foam for cappuccino',
        ],
      },
      // ── Day 4: Hot Supreme Drinks ──────────────────────────────────────────
      {
        id: 'bb1-23',
        name: 'Day 4 — Hot Supreme Drinks: Order of Operations & Sandy Blonde Hot',
        description: 'Standard prep time: TBD. Hot Supremes: Small/Medium/Large only (no XL). Always double-cup. Flavors + espresso + whisk in the hot cup first; steam milk separately, then pour.',
        estimatedMinutes: 45,
        steps: [
          'Hot Supreme Drinks available in Small, Medium, and Large ONLY — no X-tra Large.',
          'Hot drinks are ALWAYS DOUBLE-CUPPED. Sleeves available on request, but double-cupping is preferred so the Makenna design stays visible.',
          'Complete Milk Steaming training before this section.',
          'ORDER OF OPERATIONS (Hot Supreme): In the hot drink cup: flavors → espresso → whisk. In the steaming pitcher: only milks. Steam milk → pour steaming pitcher into hot drink cup → drizzle on top (if applicable). NOTE: Hot drink drizzle goes on TOP of the drink, not around the rim (cup is not transparent).',
          'RECIPE VARIATIONS: hot drinks occasionally use powder where the iced version uses sauce or syrup. ALWAYS check Mela for the correct recipe, especially when the New Hire has memorized the iced version.',
          'HOT SIZE CHARTS: Shot count same as iced (S=1, M=2, L=2+free optional). Half & Half: S=2 oz, M=2½ oz, L=2½ oz. Fill-to (in steaming pitcher): S=10 oz, M=12 oz, L=14 oz.',
          'BUILD BEFORE STEAMING: the drink in the cup must be fully built and whisked before steaming the milk. Steaming milk and letting it sit creates thick foam on top — not what we want.',
          'PRACTICE — Sandy Blonde Hot Medium 16oz: In hot cup: 2 pumps white chocolate sauce + ¾ pump Caramel sauce → 2 espresso shots → WHISK THOROUGHLY. In measuring cup: 2½ oz Half & Half + Milk of Choice to 12 oz → transfer to steaming pitcher → steam to desired temperature → pour steaming pitcher into hot drink cup → Caramel drizzle on top.',
          'Double-cup before anything else — gives a clean exterior for hand-off.',
          'When adding powders or scoops: use the scoop VERTICALLY — more visually accurate than horizontal (can see bottom of scoop).',
          'Hot drink drizzle goes on TOP of the drink (not the rim) because the cup is opaque.',
        ],
        competencyCriteria: [
          'States hot drinks are Small/Medium/Large only (no XL)',
          'Double-cups every hot drink before building',
          'Executes correct hot drink order: flavors → espresso → whisk in cup; steam milk separately; pour in; drizzle on top',
          'Fully builds and whisks the hot drink cup before steaming the milk',
          'Recites hot fill-to-line chart (S=10, M=12, L=14 oz)',
          'Drizzles on top of the drink (not around the rim) for hot drinks',
          'Builds Sandy Blonde Hot Medium to spec',
        ],
      },
      // ── Day 4: Cold Brew Drinks ────────────────────────────────────────────
      {
        id: 'bb1-cold-brew',
        name: 'Day 4 — Cold Brew Drinks: Building & Kona Cloud Topping',
        description: 'Cold brew drinks are iced only. Two-cup method: cold brew base in measuring cup #1, Kona Cloud + flavor in measuring cup #2. Fill-to chart: S=6, M=8, L=10, XL=16 oz. Kona Cloud: 2 oz (S/M/L) or 4 oz (XL). Practice: Brown Sugar Cinnamon Cold Brew Medium.',
        estimatedMinutes: 30,
        steps: [
          'OVERVIEW: Cold brew drinks are only available iced. Every menu cold brew has flavor mixed into the cold brew base and is topped with a flavored Kona Cloud.',
          'ORDER OF OPERATIONS (2-cup method):',
          '  Cup 1 — Measuring cup: flavor → cold brew → pour into drink cup filled with ice to the rim → TOM-TOM → rinse measuring cup.',
          '  Cup 2 — Same (rinsed) measuring cup: Kona Cloud → flavor → whisk until uniform → pour directly on top of the drink.',
          '  Add any topping (e.g., cinnamon powder) if specified by the recipe.',
          'COLD BREW FILL-TO CHART (liquid in measuring cup before pour):',
          '  Small (12 oz) → 6 oz cold brew',
          '  Medium (16 oz) → 8 oz cold brew',
          '  Large (24 oz) → 10 oz cold brew',
          '  X-tra Large (32 oz) → 16 oz cold brew',
          'Trainer tip: "The cold brew fill-to is less than iced drinks because the Kona Cloud adds the remaining volume. Example: Small = 6 oz cold brew + 2 oz Kona Cloud + ice = correct build."',
          'KONA CLOUD CHART:',
          '  Small (12 oz) → 2 oz Kona Cloud',
          '  Medium (16 oz) → 2 oz Kona Cloud',
          '  Large (24 oz) → 2 oz Kona Cloud',
          '  X-tra Large (32 oz) → 4 oz Kona Cloud',
          'Always measure the Kona Cloud BEFORE adding the flavor — keeps the measurement accurate.',
          'PRACTICE — Brown Sugar Cinnamon Cold Brew Medium (16 oz) via Mela:',
          '  Measuring cup #1: add brown sugar cinnamon syrup (per recipe) + 8 oz cold brew → pour over ice in drink cup (ice to rim) → TOM-TOM → rinse measuring cup.',
          '  Measuring cup #2 (rinsed): 2 oz Kona Cloud + brown sugar cinnamon syrup (per recipe) → whisk until uniform color → pour directly on top of the drink.',
          '  Finish: cinnamon powder on top — not too little, not too much.',
          '  Cup must be clean and presentable before handoff.',
        ],
        competencyCriteria: [
          'States cold brew drinks are iced only',
          'States the two-cup order of operations (cold brew base first, Kona Cloud second)',
          'Recites cold brew fill-to for all 4 sizes (6 / 8 / 10 / 16 oz)',
          'Recites Kona Cloud oz for all 4 sizes (2 / 2 / 2 / 4 oz)',
          'Measures Kona Cloud before adding flavor',
          'Whisks Kona Cloud + flavor until uniform before pouring on top',
          'Builds Brown Sugar Cinnamon Cold Brew Medium to spec',
        ],
      },
      {
        id: 'bb1-24',
        name: 'Day 3-4 End of Day Review',
        description: 'Trainer asks 9 review questions to confirm retention before end of Days 3–4.',
        estimatedMinutes: 15,
        steps: [
          '1. What is the correct fill level for the RED counter sanitizing bucket vs. the WHITE steaming wand bucket?',
          '2. When must a sanitizing bucket be changed early, regardless of the timer?',
          '3. When should a syrup bottle be replaced, and what do you do if a bottle is nearly empty during a rush?',
          '4. Walk through the steps for preparing a Cold Brew Toddy from start to finish.',
          '5. What is the target espresso shot extraction time range?',
          '6. Describe the purpose of each step in sequence: Grind, Dose, and Tamp.',
          '7. How do you properly clean a portafilter before dosing, and what tool do you use?',
          '8. What happens if the grounds in the portafilter are tamped unevenly?',
          '9. What should you do if the stream of grounds from the grinder is not coming out centered?',
        ],
        competencyCriteria: [
          'States RED bucket fills to line 2 (~⅔); WHITE bucket fills to line 1 (~⅓)',
          'States early change triggers: cloudy, greasy, or dirty water regardless of timer',
          'States replace syrup only when pump can no longer extract; combine same-flavor bottles during a rush',
          'Walks through Cold Brew Toddy steps (coarse grind → filter bag → water to 1 inch → 14-hr brew → drain as ½ brew + ½ water)',
          'States target pull time 10–15 seconds (9 = usable/adjust; ≤8 = discard; 16–18 = usable/adjust; ≥19 = discard)',
          'Explains Grind (calibrate for correct extraction time), Dose (correct grams for consistent yield), Tamp (level pressure for even extraction)',
          'States to knock portafilter on knock box crossbar, then wipe with dedicated dry rag',
          'States unleveled tamp causes channeling — water slides to the lower end and extraction is uneven',
          'States off-center grounds stream indicates a clog — requires cleaning or troubleshooting',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'barista-basics-2',
    name: 'Barista Basics II',
    description: 'Section 4 (Days 5–6) — Americanos (iced & hot), Shaken Espresso, Freezes, Smoothies, and standard recipe mastery of the top 21 drinks.',
    order: 4,
    contentVersion: 2,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'bb2-1',
        name: 'Day 5 — Iced Americanos',
        description: 'Shot counts: S=2, M=3, L=4(+1 optional), XL=6. Order: flavor → espresso → whisk (if sauce/powder) → cold water to fill-to-line → TOM-TOM → drizzle. Fill-to same as iced supremes.',
        estimatedMinutes: 30,
        steps: [
          'SHOT COUNTS (Americanos & Shaken share the same counts — more than Supremes):',
          '  Small (12oz) → 2 shots',
          '  Medium (16oz) → 3 shots',
          '  Large (24oz) → 4 shots (+1 optional)',
          '  X-tra Large (32oz) → 6 shots',
          'ORDER OF OPERATIONS (Iced Americano): In measuring cup → flavor → espresso → whisk (only if there are powders or sauces; not necessary for syrups only) → add cold water to fill-to-line → pour into cup filled level to rim with ice → TOM-TOM → drizzle if applicable.',
          'FILL-TO (same as iced supremes): S=8oz, M=10oz, L=12oz, XL=20oz.',
          'Practice: New Hire makes a Small (12oz) iced Americano of their choice from Mela.',
          'Q&A while building: "Where do the flavors go?" (measuring cup). "Whisk or no whisk?" (only if powders/sauces). "How many shots per size?" (review all 4).',
        ],
        competencyCriteria: [
          'Recites Americano shot counts for all 4 sizes (2 / 3 / 4+1 / 6)',
          'States whisk is only needed when there are powders or sauces — not for syrups only',
          'Adds cold water to the fill-to-line (same as iced supremes: 8/10/12/20 oz)',
          'Fills cup level to rim with ice (not heaping) before pouring',
          'Builds a Small iced Americano to spec from Mela',
        ],
      },
      {
        id: 'bb2-2',
        name: 'Day 5 — Hot Americanos',
        description: 'Same shot counts as iced. No XL for hot. Order: flavor → espresso → whisk → hot water to rim (from Americano water spout on drip machine). Double-cup. Lid mouth opening opposite the seam.',
        estimatedMinutes: 30,
        steps: [
          'Shot counts are the SAME as iced Americanos (S=2, M=3, L=4, no XL for hot).',
          'ORDER OF OPERATIONS (Hot Americano): In hot drink cup → flavor → espresso → whisk (if powders/sauces) → fill with hot Americano water to rim → drizzle if applicable.',
          'Hot water comes from the Americano water spout on one of the drip machines.',
          'Hot water is added directly into the hot drink cup — fill to the rim.',
          'DOUBLE-CUP this drink since it is hot.',
          'Lid placement: put lid on making sure the MOUTH OPENING is on the opposite side of the seam of the inside hot drink cup — creates a perfect seal.',
          'Practice: New Hire makes a Small (12oz) hot Americano of their choice from Mela.',
        ],
        competencyCriteria: [
          'States no XL for hot Americanos',
          'Adds hot water directly from the Americano water spout into the hot cup to the rim',
          'Double-cups every hot Americano',
          'Places lid with mouth opening opposite the cup seam for a perfect seal',
          'Builds a Small hot Americano to spec',
        ],
      },
      {
        id: 'bb2-3',
        name: 'Day 5 — Shaken Espresso Drinks',
        description: 'Same shot counts as Americanos. Always iced — never hot. Order: flavor → espresso → swirl → full cup of ice (level) → shake → pour → splash of milk in shaker → pour residual → top with ice & milk.',
        estimatedMinutes: 40,
        steps: [
          'Shaken Espresso shares the same shot counts as Americanos: S=2, M=3, L=4(+1 optional), XL=6.',
          'Shaken Espresso is ONLY available iced — never hot.',
          'ORDER OF OPERATIONS: In shaker cup → flavor → espresso → swirl (helps melt thick flavors like sauces/powders, especially brown sugar) → add a FULL drink cup of ice (level, not heaping) → put lid on → shake.',
          'SHAKING FORM: "pretend you are throwing a football with two hands." Listen — ice should go from hard-hitting sounds to a rattle-like sound. If under-shaken, espresso separates quickly and there will be little foam.',
          'Pour shaken drink into drink cup.',
          'Add a SPLASH OF MILK into the empty shaker cup, put lid on, swirl, and pour into drink cup — this collects the flavor left on the shaker walls.',
          'Add more ice and more milk directly into the drink cup if needed.',
          'Lid on. Clean cup. Wash dishes before handing the drink out.',
          'Practice: New Hire makes a Medium (16oz) Shaken Brown Sugar Oat Milk from Mela.',
        ],
        competencyCriteria: [
          'States Shaken Espresso is always iced — never hot',
          'Recites shot counts (same as Americanos: 2/3/4/6)',
          'Swirls espresso with flavors in shaker cup before adding ice',
          'Fills drink cup level (not heaping) with ice before shaking',
          'Shakes until ice sounds rattle-like (not hard-hitting)',
          'Adds splash of milk to empty shaker, swirls, and pours residual into drink cup',
          'Builds Shaken Brown Sugar Oat Milk Medium to spec',
        ],
      },
      {
        id: 'bb2-4',
        name: 'Day 5 — Freezes',
        description: 'Blended, no espresso. Same powder scoops as chillers (S=2, M=3, L=4, XL=6). Milk fill-to is 1 oz MORE than chillers: S=6, M=7, L=8, XL=14 oz. Same solids/liquids split as chillers.',
        estimatedMinutes: 30,
        steps: [
          'Freezes are blended drinks WITHOUT espresso.',
          'POWDER SCOOPS: same as Chillers — S=2, M=3, L=4, XL=6.',
          'MILK FILL-TO (1 oz MORE than Chillers because no espresso): S=6oz, M=7oz, L=8oz, XL=14oz.',
          'This extra ounce rule also applies to a Chiller when made with "no coffee."',
          'ORDER OF OPERATIONS: same as Chillers but no espresso. Blender cup: heaping ice → powders → sauces → solids. Measuring cup: syrups → milks. Pour measuring cup into blender cup → lid → blend on #4 → pour into drink cup.',
          'Practice: New Hire makes a Medium (16oz) Cotton Candy Freeze from Mela.',
          'Clean cup and make presentable before handoff.',
        ],
        competencyCriteria: [
          'States Freezes have no espresso',
          'Recites powder scoop chart for all 4 sizes (2/3/4/6)',
          'States Freeze milk fill-to is 1 oz MORE than Chillers (S=6, M=7, L=8, XL=14)',
          'States the "no coffee" rule: same extra-ounce adjustment applies to any Chiller made without espresso',
          'Builds Cotton Candy Freeze Medium to spec',
        ],
      },
      {
        id: 'bb2-5',
        name: 'Day 5 — Smoothies',
        description: 'Fill drink cup OVER the rim with ice. Shake smoothie mix. Add to rim of cup. Pour into blender cup. Blend on #4. Pour back. Add whip if requested.',
        estimatedMinutes: 20,
        steps: [
          'HEAPING ICE: fill drink cup over the rim with ice (heaping — same as Chillers).',
          'Locate and shake the smoothie mix.',
          'Add smoothie mix to the rim of the drink cup.',
          'Pour into blender cup. Place lid. Blend on #4.',
          'Pour back into drink cup. Add whipped cream if requested.',
          'Clean cup and make presentable before handoff.',
        ],
        competencyCriteria: [
          'Fills drink cup over the rim with ice (heaping)',
          'Shakes smoothie mix before adding',
          'Blends on #4',
          'Adds whipped cream only when requested',
          'Builds a smoothie to spec cleanly and presentably',
        ],
      },
      {
        id: 'bb2-6',
        name: 'Day 5–6 — Recipe Mastery: 21 Core Drinks',
        description: 'Repetition builds speed and accuracy. New Hire practices the top 21 drinks until each is second nature. Trainer evaluates consistency, speed, and presentation.',
        estimatedMinutes: 240,
        steps: [
          'New Hire was provided the full drink list after Day 1 to study at home — check for familiarity before practicing.',
          'Practice the following 21 drinks to mastery (Trainer evaluates each):',
          '1. Maui Latte (Maui Milk table rules)',
          '2. Sandy Blonde (iced)',
          '3. The Legend',
          '4. Cabo San Lucas',
          '5. Cookie Butter Latte',
          '6. The Ben',
          '7. Brown Sugar Cinnamon Cold Brew',
          '8. White Chocolate Macadamia Nut Cold Brew',
          '9. Shaken Brown Sugar Oat Milk',
          '10. Maui Vanilla',
          '11. Summer Latte (vanilla latte)',
          '12. Vanilla Caramel Chiller',
          '13. Sandy Kisses Chiller',
          '14. PB No J Chiller',
          '15. Oreo Chiller',
          '16. The Vacation (Pineapple Coconut Energy)',
          '17. Starburst (Energy)',
          '18. Local Juice (Energy)',
          '19. Skittles (Energy)',
          '20. Matcha Iced',
          '21. Spiced/Vanilla Chai Iced',
          'Focus on: speed, accuracy, correct measurements, clean presentation, and proper labeling.',
        ],
        competencyCriteria: [
          'Builds all 21 core drinks to spec with Mela reference',
          'Builds at least 10 of the 21 drinks to spec without Mela reference',
          'Maintains consistent shot counts, fill-to lines, and garnishes across all drink categories',
          'Meets the 2 min 30 sec standard for iced supremes; 3 min for chillers/freezes',
          'Every drink handed off clean, full, and presentable',
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
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'op-1',
        name: 'Day 7 — Fill back sinks & sanitizing buckets',
        description: 'First task of the opening checklist: fill both back sinks, then fill the sanitizing buckets once the sanitizing sink is full.',
        estimatedMinutes: 5,
        steps: [
          'Go to the back area and turn on both sinks.',
          'Fill the sanitizing sink first with the correct sanitizer concentration.',
          'Once the sanitizing sink is full, use it to fill all sanitizing buckets to the fill line.',
          'Place sanitizing buckets at each station (bar, POS, prep).',
        ],
        competencyCriteria: [
          'Both back sinks filled at start of opening',
          'Sanitizing buckets filled from sanitizing sink once it is full',
          'Buckets placed at correct stations',
        ],
      },
      {
        id: 'op-2',
        name: 'Day 7 — Turn on ovens',
        description: 'Turn on the ovens as part of the opening sequence so they reach temperature before food service begins.',
        estimatedMinutes: 3,
        steps: [
          'Locate the oven touchscreen on the front of each oven.',
          'Tap the power icon in the CENTER of the touchscreen to power on.',
          'Then tap the temperature number in the LOWER LEFT CORNER of the same screen to set the temperature.',
          'Verify the preheat indicator confirms the oven is heating.',
        ],
        competencyCriteria: [
          'Ovens turned on at start of opening shift using touchscreen power icon',
          'Temperature set via the lower left corner of the touchscreen',
        ],
      },
      {
        id: 'op-3',
        name: 'Day 7 — Turn on slushy machine & light',
        description: 'Power up the slushy machine correctly. CRITICAL: switch to the RIGHT = slush mode. Switch to the LEFT = drain only (machine spins but produces no slush).',
        estimatedMinutes: 3,
        steps: [
          'Locate the switch on the RIGHT SIDE of the front of the slushy machine.',
          'Turn this switch to the RIGHT to start the slushy machine in slush mode.',
          'CRITICAL: if turned to the LEFT, the machine will spin but will NOT make slush — that is the drain-only function.',
          'Turn on the slushy machine light by turning the switch in the MIDDLE to the right.',
          'Confirm the machine is running and the light is on.',
        ],
        competencyCriteria: [
          'Slushy machine switch turned to the RIGHT (not left — left is drain only)',
          'States the drain-only warning: left = machine spins but makes no slush',
          'Slushy machine light turned on via the middle switch',
        ],
      },
      {
        id: 'op-4',
        name: 'Day 7 — Make drip coffee',
        description: 'Brew the first batch of drip coffee so it is ready at open. Pull the basket, shake to level grounds, place pot under the machine, remove the rubber cover, and align the opening to the drip hole.',
        estimatedMinutes: 10,
        steps: [
          'Pull the drip basket out and shake gently to level the grounds.',
          'Place basket in the drip machine labeled "Use to Brew Drip."',
          'Place the drip pot under the basket.',
          'Remove the rubber cover from the pot opening.',
          'Align the pot opening to the dripping hole.',
          'Start the brew cycle and monitor until complete.',
          'Note the brew time on the timer board.',
        ],
        competencyCriteria: [
          'Drip brewed before open',
          'Correct pot placement with rubber cover removed and opening aligned to drip hole',
          'Brew time recorded on the timer board',
        ],
      },
      {
        id: 'op-5',
        name: 'Day 7 — Remove powder lids & add measuring scoops',
        description: 'Remove the lids from all powder containers and add measuring scoops. EXCEPTION: Brown sugar stays covered at all times — place the scoop on top of the lid.',
        estimatedMinutes: 5,
        steps: [
          'Go to each powder container at the bar.',
          'Remove the lid from each container and place a clean measuring scoop inside.',
          'EXCEPTION — Brown Sugar: the brown sugar container stays covered at all times. Do NOT remove the lid. Instead, place a measuring scoop on top of the lid so it is accessible when needed.',
          'Confirm all powders are stocked and none are empty.',
        ],
        competencyCriteria: [
          'Lids removed from all powder containers (except brown sugar)',
          'Measuring scoop placed in each open powder container',
          'Brown sugar lid left on — scoop placed on top of lid, not inside',
          'All powders confirmed stocked',
        ],
      },
      {
        id: 'op-6',
        name: 'Day 7 — Put out pastries',
        description: 'Stage pastries in the pastry case by type. Gluten-free items must be kept separate or given extra space to avoid cross-contamination.',
        estimatedMinutes: 8,
        steps: [
          'Retrieve pastries from the cooler or delivery box.',
          'Arrange by type — coffee cakes together, croissants together, muffins together, etc.',
          'GLUTEN-FREE ITEMS: place with extra space around them or in a separate area so they are easy to identify and avoid cross-contamination.',
          'Label each pastry with the correct name and price tag.',
          'Check dates — remove any pastries past their use-by date.',
        ],
        competencyCriteria: [
          'Pastries arranged by type in the display case',
          'Gluten-free items clearly separated or given extra space to prevent contamination',
          'Price/name labels present for each item',
          'No expired pastries in the case',
        ],
      },
      {
        id: 'op-7',
        name: 'Day 7 — Update inventory in POS',
        description: 'Update inventory levels in Square POS to reflect the day\'s actual stock. Navigation: MORE → Items → search item → click item → scroll to Stock → Manage Stock → Inventory Recount → update → Save.',
        estimatedMinutes: 5,
        steps: [
          'On the register, go to MORE.',
          'Tap Items.',
          'Search for the item to update.',
          'Click on the item.',
          'Scroll down to the Stock section.',
          'Tap Manage Stock (or tap the stock number).',
          'Select Inventory Recount.',
          'Update the stock quantity to the correct amount.',
          'Tap Save.',
          'Repeat for each delivered or restocked item.',
        ],
        competencyCriteria: [
          'Navigates POS correctly: MORE → Items → search → item → Stock → Manage Stock → Inventory Recount → update → Save',
          'All delivered or restocked items updated before open',
          'Changes saved in POS',
        ],
      },
      {
        id: 'op-8',
        name: 'Day 7 — Place whisks & mixing spoons in whisk well (open water)',
        description: 'Place whisks and mixing spoons in the whisk well and open the water supply so they are ready for use during service.',
        estimatedMinutes: 3,
        steps: [
          'Retrieve clean whisks and mixing spoons from the dish area.',
          'Place whisks in the whisk well.',
          'Open the water supply to the whisk well.',
          'Confirm water is flowing and well is at correct level.',
        ],
        competencyCriteria: [
          'Whisks and mixing spoons placed in whisk well',
          'Whisk well water supply opened',
        ],
      },
      {
        id: 'op-9',
        name: 'Day 7 — Fill the ice bin',
        description: 'Fill the bar ice bin before open so there is sufficient ice for the entire morning rush.',
        estimatedMinutes: 5,
        steps: [
          'Bring the ice scoop to the ice machine.',
          'Fill the bar ice bin to the full line.',
          'Do not touch ice with bare hands — always use the scoop.',
          'Replace the ice bin lid if applicable.',
        ],
        competencyCriteria: [
          'Ice bin filled to the full line before open',
          'Ice scooped without bare-hand contact',
        ],
      },
      {
        id: 'op-10',
        name: 'Day 7 — Place towel/rag next to knock box',
        description: 'Stage a clean towel or rag next to the knock box so baristas can wipe the portafilter and keep the bar clean during service.',
        estimatedMinutes: 2,
        steps: [
          'Get a clean, damp rag from the supply area.',
          'Place it on the bar next to the knock box.',
          'Confirm knock box is empty and ready for use.',
        ],
        competencyCriteria: [
          'Clean towel/rag placed next to knock box at open',
          'Knock box emptied and ready',
        ],
      },
      {
        id: 'op-11',
        name: 'Day 7 — Place $300 cash in register',
        description: 'Count and place $300 (including coins) into the register drawer before opening for transactions.',
        estimatedMinutes: 10,
        steps: [
          'Retrieve the $300 bank from the safe (manager may need to unlock).',
          'Count the bills and coins to verify the $300 total.',
          'Sort bills by denomination, face up, in the correct slots.',
          'Place coins in the coin tray in the correct positions.',
          'Close and lock the drawer.',
          'Record the opening drawer amount in the cash log.',
        ],
        competencyCriteria: [
          'Exactly $300 (including coins) placed in the register',
          'Bills sorted by denomination and facing correctly',
          'Opening amount recorded in the cash log',
        ],
      },
      {
        id: 'op-12',
        name: 'Day 7 — Bring down chairs and stools',
        description: 'Lower chairs and stools from tabletops to the floor so the seating area is ready for customers at open.',
        estimatedMinutes: 5,
        steps: [
          'Walk through the dining area.',
          'Lower each chair and bar stool from the table/counter to the floor.',
          'Arrange chairs neatly at each table.',
          'Confirm all stools are stable and properly positioned.',
        ],
        competencyCriteria: [
          'All chairs and stools brought down from tables/counters',
          'Seating arranged neatly before open',
        ],
      },
      {
        id: 'op-13',
        name: 'Day 7 — Put out cake pops (if available)',
        description: 'If cake pops are in stock, place them in the display area so they are visible and ready for purchase.',
        estimatedMinutes: 3,
        steps: [
          'Check if cake pops are available in the cooler or storage.',
          'If available, place in the designated cake pop display.',
          'Ensure they are labeled with name and price.',
          'If not available, mark as out-of-stock in POS.',
        ],
        competencyCriteria: [
          'Cake pops placed in display if available',
          'Labeled with name and price',
          'Marked out-of-stock in POS if not available',
        ],
      },
      {
        id: 'op-14',
        name: 'Day 7 — Check restroom supplies',
        description: 'Inspect both restrooms before open to confirm toilet paper, paper towels, and hand soap are stocked.',
        estimatedMinutes: 5,
        steps: [
          'Enter each restroom and check toilet paper — replace roll if low or empty.',
          'Check paper towel dispenser — refill if low.',
          'Check hand soap dispenser — refill if low.',
          'Wipe down counters and mirror if needed.',
          'Confirm trash can is not full.',
        ],
        competencyCriteria: [
          'Toilet paper stocked in all restrooms',
          'Paper towels stocked',
          'Hand soap dispensers filled',
          'Restrooms tidy and ready before open',
        ],
      },
      {
        id: 'op-15',
        name: 'Day 7 — Set sanitizing bucket & lobby check timers',
        description: 'Start the recurring timers: sanitizing buckets must be changed every 2 hours; lobby and restroom checks every 30 minutes.',
        estimatedMinutes: 3,
        steps: [
          'Set or confirm the sanitizing bucket timer for every 2 hours.',
          'Set or confirm the lobby/restroom check timer for every 30 minutes.',
          'Use the store timer system (phone timer, wall timer, or POS reminder) — whichever is standard for the location.',
          'Brief any FOH team members on their lobby check duty.',
        ],
        competencyCriteria: [
          'Sanitizing bucket change timer set for every 2 hours',
          'Lobby and restroom check timer set for every 30 minutes',
          'Team briefed on the timer responsibilities',
        ],
      },
      {
        id: 'op-16',
        name: 'Day 7 — Mid-point Quiz: POS Execution',
        description: 'Demonstrate competency on the POS: ringing up orders correctly, applying discounts, processing voids with manager approval, and handling refunds.',
        estimatedMinutes: 20,
        steps: [
          'Trainer presents a series of sample orders (simple, combo, substitution, discount).',
          'New Hire rings up each order accurately on the POS.',
          'Trainer presents a void scenario — New Hire initiates the void and calls for manager/lead approval.',
          'Trainer presents a refund scenario — New Hire processes correctly.',
          'Trainer reviews results and discusses any errors.',
        ],
        competencyCriteria: [
          'Rings up a standard order without errors',
          'Applies a discount or comp correctly',
          'Initiates a void and correctly calls for manager approval before proceeding',
          'Processes a refund per SOP',
          'Over/short tolerance of ±$5 understood',
        ],
      },
      {
        id: 'op-17',
        name: 'Day 7 — Mid-point Quiz: Bar Execution (Milk Steam, Espresso, Core Bev)',
        description: 'Trainer evaluates New Hire on milk steaming technique, espresso pulls, and building core beverages to spec under observation.',
        estimatedMinutes: 30,
        steps: [
          'Trainer selects 3–5 drinks from the core 21 menu.',
          'New Hire builds each drink from scratch including steaming milk, pulling espresso, and adding all components.',
          'Trainer scores on: temperature, texture, correct measurements, speed, and presentation.',
          'Trainer provides real-time feedback between drinks.',
        ],
        competencyCriteria: [
          'Steams milk to correct temperature and texture without scorching',
          'Pulls espresso shots to correct volume and timing',
          'Builds assigned core beverages to spec',
          'Maintains bar cleanliness throughout the exercise',
          'Completes drinks at an acceptable pace (working toward 4-minute goal)',
        ],
      },
      {
        id: 'op-18',
        name: 'Day 7 — Mid-point Quiz: Prep Execution',
        description: 'Trainer evaluates New Hire on prep tasks: correct measurements, labeling/dating, mise en place, and using prep items during service.',
        estimatedMinutes: 20,
        steps: [
          'Trainer assigns a prep list (e.g., cold foam, syrups, sauces, or any batch item).',
          'New Hire completes each prep task using correct measurements.',
          'New Hire labels and dates every prep container.',
          'Trainer verifies mise en place is organized and properly positioned on the bar.',
        ],
        competencyCriteria: [
          'Completes assigned prep tasks with correct measurements',
          'Labels and dates all prep containers',
          'Mise en place organized and within reach at the bar',
          'Uses prep items correctly in drink builds during the quiz',
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
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'br-1',
        name: 'Day 8 — The 3-Role Model (Order Taker / Drink Preparer / Floor Manager)',
        description: 'Understand the three defined roles that prevent bottlenecks during a shift: Order Taker at register, Drink Preparer on bar, and Floor Manager running the floor.',
        estimatedMinutes: 15,
        steps: [
          'Trainer explains the purpose of the 3-role model: clarity of responsibility prevents collisions and dropped tasks.',
          'Role 1 — Order Taker: takes orders at the register, rings accurately, communicates specials to bar.',
          'Role 2 — Drink Preparer: builds every drink to spec, prioritizes queue, calls out drinks at pickup.',
          'Role 3 — Floor Manager: monitors lobby, handles customer issues, supports whichever role needs help.',
          'Trainer demonstrates how role assignments are communicated at the start of each shift.',
        ],
        competencyCriteria: [
          'Explains the purpose of the 3-role model in their own words',
          'Can name the responsibilities of each of the three roles',
          'Understands that roles may shift based on volume — communicates with teammates when switching',
        ],
      },
      {
        id: 'br-2',
        name: 'Day 8 — Order Taker Role: Accurate Register + Bar Communication',
        description: 'Practice the Order Taker role — taking and ringing orders correctly, communicating modifiers and drink names clearly to the bar.',
        estimatedMinutes: 30,
        steps: [
          'Stand at the register and greet each customer.',
          'Ring in each order accurately including size, modifiers, and substitutions.',
          'Verbally call the drink name + modifiers to the bar immediately after ringing.',
          'Confirm any allergen substitutions with the bar explicitly.',
          'Practice the POS correction flow for mis-rings (void + re-ring with manager approval).',
        ],
        competencyCriteria: [
          'Rings in orders with no mis-selections on a 10-order drill',
          'Calls drink name and all modifiers to bar audibly on each order',
          'Correctly voids and re-rings a mis-ring with manager approval',
          'Flags allergen substitutions explicitly to the bar',
        ],
      },
      {
        id: 'br-3',
        name: 'Day 8 — Drink Preparer Role: Building Drinks in Queue Order',
        description: 'Practice the Drink Preparer role — working through the ticket queue in order, sequencing builds correctly (cold → blended → hot; espresso pulled last), and calling out drinks at pickup.',
        estimatedMinutes: 45,
        steps: [
          'Review the drink queue on the KDS or ticket rail.',
          'Sequence builds: cold drinks first, then blended, then hot.',
          'Pull espresso shots as the last step in any drink so they land fresh.',
          'Call the customer name and drink name clearly at handoff.',
          'Keep the bar clean between every drink build.',
        ],
        competencyCriteria: [
          'Sequences drink queue in correct order (cold → blended → hot, espresso last)',
          'Calls customer name and drink name at every handoff',
          'Bar surface wiped between each drink build',
          'Maintains drink quality on at least 10 consecutive tickets',
        ],
      },
      {
        id: 'br-4',
        name: 'Day 8 — Floor Manager Role: Lobby + Customer Support',
        description: 'Practice the Floor Manager role — monitoring the lobby, restocking FOH supplies, and resolving minor customer issues without interrupting the bar.',
        estimatedMinutes: 30,
        steps: [
          'Walk the lobby every 10 minutes: check tables, trash, condiment station.',
          'Restock cups, lids, straws, napkins, and sugar at the condiment bar as needed.',
          'Monitor the pickup area — call out forgotten orders.',
          'If a customer has a complaint: listen, acknowledge, offer a remake or escalate to the trainer.',
          'Report any FOH issues (spills, out-of-stock) to the bar or trainer without disrupting ticket flow.',
        ],
        competencyCriteria: [
          'Conducts lobby walk every 10 minutes during the practice window',
          'Restocks at least one FOH supply without being prompted',
          'Handles a scripted customer complaint using the listen → acknowledge → fix → escalate sequence',
          'Does not interrupt bar ticket flow to resolve a minor FOH issue',
        ],
      },
      {
        id: 'br-5',
        name: 'Day 8 — First Supervised Live Bar Shift (Low Volume)',
        description: 'Run the bar during a low-volume window (at least 30 minutes) with a trainer observing. No intervention unless requested or safety requires it.',
        estimatedMinutes: 60,
        steps: [
          'Trainer confirms volume is appropriate for a first live shift.',
          'New Hire takes the bar position independently.',
          'Trainer observes from a distance — does not prompt except for safety.',
          'New Hire manages the full ticket queue: ring-in communication, build, call-out, bar cleanup.',
          'After the window, trainer gives immediate debrief: what went well, what to adjust.',
        ],
        competencyCriteria: [
          'Holds the bar position for a minimum 30-minute live window',
          'No drink quality failures requiring a remake (trainer standard)',
          'Bar stays clean throughout — no build-up of used equipment',
          'Calls every drink out at handoff',
          'Asks for help before falling behind rather than struggling silently',
        ],
      },
      {
        id: 'br-6',
        name: 'Day 8 — Custom Drink Orders: Substitutions & Dairy Swaps',
        description: 'Handle substitution requests (milk swaps, flavor changes, extra shots) confidently and ring them up correctly.',
        estimatedMinutes: 20,
        steps: [
          'Review the most common substitutions: oat milk, almond milk, extra shot, no foam, sugar-free syrup.',
          'Ring each substitution as a modifier in POS — no sub should leave the bar without being rung in.',
          'For dairy swaps, confirm if allergen (e.g., nut milk) — use a dedicated mixing cup if allergen is present.',
          'Verbally confirm the sub to the customer before completing the drink.',
        ],
        competencyCriteria: [
          'Rings every substitution correctly as a POS modifier',
          'Identifies nut-milk orders as potential allergen situations',
          'Uses a dedicated cup for allergen-sensitive substitutions',
          'Verbally confirms substitution with customer before handoff',
        ],
      },
      {
        id: 'br-7',
        name: 'Day 8 — Custom Drink Orders: Complex Measurements & Off-Menu Requests',
        description: 'Handle off-menu and custom orders with non-standard measurements (half shots, specific oz of milk, extra drizzle, blended hot drinks) without breaking the queue.',
        estimatedMinutes: 20,
        steps: [
          'Accept the custom order graciously — never tell a customer "we don\'t do that."',
          'Identify which components can be modified and how to measure correctly.',
          'Half-shot = one espresso pull (not two). Extra pump = +1 over standard.',
          'If truly off-menu, check with trainer or manager before committing.',
          'Build the drink, ring it in accurately, and note any non-standard line items.',
        ],
        competencyCriteria: [
          'Handles a half-shot request with correct measurement',
          'Builds a custom order with 3+ modifiers without losing queue position',
          'Does not refuse any off-menu request without consulting a trainer or manager first',
          'Rings all custom components into POS accurately',
        ],
      },
      {
        id: 'br-8',
        name: 'Day 8 — Working Toward the 4-Minute Drink Goal',
        description: 'Understand the 4-minute drink standard and track personal pace during the supervised shift. The goal is a full drink from ticket to handoff in under 4 minutes.',
        estimatedMinutes: 15,
        steps: [
          'Trainer explains: the 4-minute goal is measured from when the order is placed to when the customer has their drink.',
          'New Hire mentally tracks their time on at least 5 drinks during the shift.',
          'Trainer clocks actual times and shares feedback at debrief.',
          'Identify which steps take the longest — usually milk steam or build sequencing.',
          'Set a target improvement area for the next supervised shift.',
        ],
        competencyCriteria: [
          'Can explain the 4-minute goal and why it matters for customer experience',
          'Completes at least 5 drinks with trainer timing during the shift',
          'Identifies their personal slowest step in the build process',
          'Sets a specific improvement goal for the next shift',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'peak-prep',
    name: 'Peak Prep & Rush Hour',
    description: 'Section 7 (Day 9) — The 7–9 AM peak, pre-rush staging, defined roles under pressure, batch brewing during rush, mobile/drive-thru integration, and post-rush recovery.',
    order: 7,
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'pp-1',
        name: 'Day 9 — Understanding the 7–9 AM Peak',
        description: 'Learn when and why the AM rush happens, what volume looks like, and what the team is trying to achieve during peak hours.',
        estimatedMinutes: 10,
        steps: [
          'Trainer explains: 7–9 AM is the highest-volume window at most Makenna Koffee locations.',
          'Volume can reach 10–20+ simultaneous tickets depending on the location.',
          'The goal during rush: every customer gets their drink within 4 minutes from order placement.',
          'Discuss the difference between normal flow and peak flow — adjustments in pacing, communication, and staging.',
        ],
        competencyCriteria: [
          'Describes the 7–9 AM peak window and why it creates pressure',
          'States the 4-minute drink goal applies during peak hours',
          'Understands that team communication increases during rush',
        ],
      },
      {
        id: 'pp-2',
        name: 'Day 9 — Pre-Rush Staging & Setup',
        description: 'Complete all bar staging tasks before 7 AM so the bar is ready for high-volume flow the moment rush begins.',
        estimatedMinutes: 20,
        steps: [
          'Fill ice bin to full by 6:45 AM.',
          'Pre-stage cups by size on the bar — S, M, L, XL each in their own stacks.',
          'Pre-stage lids and sleeves within arm\'s reach.',
          'Confirm all syrups and powders are stocked and measuring scoops are in place.',
          'Confirm cold brew and drip are both brewed and ready.',
          'Confirm blender is clean and lid is nearby.',
          'Confirm whisk well is full and water is running.',
          'Wipe down the entire bar surface so it is clean for service.',
        ],
        competencyCriteria: [
          'Ice bin full before rush window begins',
          'Cups pre-staged by size on the bar',
          'Syrups, powders, cold brew, and drip all confirmed stocked',
          'Bar surface clean at start of rush',
        ],
      },
      {
        id: 'pp-3',
        name: 'Day 9 — Role Assignments for Rush',
        description: 'Assign and understand the 3-role model under peak conditions — each person has one lane and does not cross unless called.',
        estimatedMinutes: 10,
        steps: [
          'Manager or shift lead assigns roles before rush: Order Taker, Drink Preparer, Floor Manager.',
          'Each team member confirms their role at the start of the rush window.',
          'During rush: if you complete your lane\'s task, communicate before jumping into another lane.',
          'If queue falls behind: Drink Preparer calls for backup — Floor Manager assists on bar first.',
        ],
        competencyCriteria: [
          'Confirms their role assignment before rush begins',
          'Stays in their assigned lane without crossing into another lane uninvited',
          'Communicates out loud when switching roles during rush',
          'Asks for backup before falling more than 3 tickets behind',
        ],
      },
      {
        id: 'pp-4',
        name: 'Day 9 — Queue Management & Drink Sequencing Under Pressure',
        description: 'Work through a high-volume ticket queue while maintaining correct build sequence and drink quality under the 4-minute goal.',
        estimatedMinutes: 90,
        steps: [
          'Read every ticket on the KDS before starting the first build — identify cold, blended, and hot drink groupings.',
          'Build all cold drinks first, then blended, then hot — pull espresso last for any drink.',
          'Call every drink at handoff regardless of volume.',
          'When queue reaches 5+ tickets: prioritize, do not freeze — announce to the team if backup is needed.',
          'Never skip a step to go faster — speed comes from efficiency, not shortcuts.',
        ],
        competencyCriteria: [
          'Maintains cold → blended → hot → espresso sequencing with 10+ tickets in queue',
          'Does not skip any drink component under pressure',
          'Calls every drink at handoff throughout the rush window',
          'Completes at least 80% of drinks within the 4-minute window during the drill',
        ],
      },
      {
        id: 'pp-5',
        name: 'Day 9 — Batch Brewing During Rush (Drip Refresh)',
        description: 'Manage drip coffee freshness during rush without interrupting drink flow — know when to brew, how long holds last, and how to hand off the brew task.',
        estimatedMinutes: 15,
        steps: [
          'Drip coffee has a 60-minute freshness window from the brew time noted on the board.',
          'If drip pot is running low or approaching the 60-minute mark, alert the Floor Manager or trainer.',
          'Floor Manager or second person handles the brew cycle — not the primary Drink Preparer.',
          'Mark the new brew time on the timer board immediately after starting.',
          'Never pour out fresh drip that is still within the window — note time, don\'t guess.',
        ],
        competencyCriteria: [
          'Identifies when drip is approaching the 60-minute freshness limit',
          'Does not attempt to brew drip solo while managing the ticket queue — delegates',
          'New brew time is recorded on the timer board immediately',
          'Does not discard drip that is still within the 60-minute window',
        ],
      },
      {
        id: 'pp-6',
        name: 'Day 9 — Drive-Thru & Mobile Order Integration (Where Applicable)',
        description: 'Integrate drive-thru window orders and mobile app orders into the bar queue without losing track of in-store orders.',
        estimatedMinutes: 30,
        steps: [
          'Mobile orders appear on the KDS automatically — treat them as any other ticket, first-in first-out.',
          'Drive-thru orders: Order Taker enters at the window; Drink Preparer builds alongside in-store.',
          'Label drive-thru cups with a "DT" sticker or marker so handoff is clear at the window.',
          'For mobile orders with a pickup name: place on the designated mobile pickup shelf, call the name.',
          'When both channels back up simultaneously: communicate volume to the team out loud.',
        ],
        competencyCriteria: [
          'Treats mobile orders as standard KDS tickets — no separate queue',
          'Labels drive-thru cups distinctly before building',
          'Places mobile orders on the pickup shelf with name visible',
          'Communicates multi-channel volume to the team when both channels back up',
        ],
      },
      {
        id: 'pp-7',
        name: 'Day 9 — Post-Rush Recovery & Reset',
        description: 'After the 7–9 AM peak subsides, reset the bar and restock so it is ready for the midday window.',
        estimatedMinutes: 20,
        steps: [
          'Wipe down the entire bar surface — remove used cups, discard grounds from knock box.',
          'Refill ice bin if low.',
          'Restock syrups, powders, and any supplies that were depleted during rush.',
          'Check drip — discard if past 60-minute window and brew a fresh pot if the midday drip demand warrants it.',
          'Empty and wipe out blender cups.',
          'Do a whisk well water check — add fresh water if the level is low.',
          'Communicate the post-rush restock status to the shift lead.',
        ],
        competencyCriteria: [
          'Bar surface fully wiped down after rush',
          'Ice bin refilled if below half-full',
          'All depleted syrups and powders restocked',
          'Drip checked and discarded/refreshed based on 60-minute rule',
          'Restock status communicated to shift lead',
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
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'cl-1',
        name: 'Day 10 — Restock cups, syrups, milk; rotate milks & Kona; clean syrup rack',
        description: 'Bring cups, syrups, and milk to par level. Rotate milks and Kona dispensers (FIFO). Clean the syrup rack and wipe syrup bottles.',
        estimatedMinutes: 15,
        steps: [
          'Count cups at the bar — refill any size that is below the par level from the back stock.',
          'Check each syrup bottle: if below halfway, replace with a full bottle from the back.',
          'CLEAN SYRUP RACK: wipe down the syrup rack and wipe the outside of each syrup bottle.',
          'ROTATE MILKS (FIFO): pull older milks to the front, place newer milk behind. Remove any milk past its expiration.',
          'ROTATE KONA: move older Kona dispensers to the front so they are used first. New dispensers go behind.',
          'Check milk supply in the bar fridge: restock from the walk-in to ensure enough for the next morning.',
          'Log any items that are out of stock so the manager can order.',
        ],
        competencyCriteria: [
          'All cup sizes restocked to par level',
          'Syrup bottles at or above halfway at close; syrup rack and bottles wiped',
          'Milks rotated FIFO (older in front) — expired milks removed',
          'Kona dispensers rotated FIFO (older in front)',
          'Milk supply in bar fridge restocked for opening',
          'Out-of-stock items reported to manager or noted on the reorder sheet',
        ],
      },
      {
        id: 'cl-2',
        name: 'Day 10 — Wipe counters, cabinets, and fridges',
        description: 'Thoroughly wipe all bar surfaces — counters, cabinet faces, and the exterior of all fridges and coolers — with a sanitizing rag.',
        estimatedMinutes: 10,
        steps: [
          'Use a fresh sanitizing rag from the bucket.',
          'Wipe the entire bar counter — front, back, and sides.',
          'Wipe all cabinet door faces and handles.',
          'Wipe the exterior of all fridges and coolers including handles and top surfaces.',
          'Replace the rag if it gets visibly dirty during the task.',
        ],
        competencyCriteria: [
          'Bar counter wiped with a clean sanitizing rag',
          'Cabinet faces and handles wiped',
          'Fridge and cooler exteriors wiped',
        ],
      },
      {
        id: 'cl-3',
        name: 'Day 10 — Clean whisk well and glass pitcher',
        description: 'Empty and scrub the whisk well and clean all glass pitchers used during the shift.',
        estimatedMinutes: 8,
        steps: [
          'Turn off the whisk well water supply.',
          'Remove all whisks and spoons from the well.',
          'Empty the dirty water from the well.',
          'Scrub the well interior with a brush and sanitizing solution.',
          'Rinse and let air dry or dry with a clean cloth.',
          'Wash all glass pitchers used during the shift — soap, rinse, sanitize, air dry.',
        ],
        competencyCriteria: [
          'Whisk well emptied, scrubbed, and rinsed',
          'All glass pitchers washed, rinsed, and sanitized',
          'Whisks and spoons sent to the dish area for overnight',
        ],
      },
      {
        id: 'cl-4',
        name: 'Day 10 — Brew all teas and iced drip',
        description: 'Brew fresh batches of all tea varieties and iced drip so they are chilled and ready for the opening shift.',
        estimatedMinutes: 20,
        steps: [
          'Identify which teas are brewed at this location (e.g., black, green, herbal).',
          'Brew each tea batch according to the posted recipe.',
          'Label and date each tea container before refrigerating.',
          'Brew the iced drip batch using the posted cold drip recipe.',
          'Label and date the iced drip container before refrigerating.',
        ],
        competencyCriteria: [
          'All tea varieties brewed at close',
          'Iced drip brewed at close',
          'All containers labeled with item name and date before refrigerating',
        ],
      },
      {
        id: 'cl-5',
        name: 'Day 10 — Make Maui and Kona for the next day',
        description: 'Prepare Maui and Kona drink bases/components so they are ready for the opening shift.',
        estimatedMinutes: 15,
        steps: [
          'Follow the posted recipe for the Maui base and the Kona base.',
          'Measure and mix each component exactly.',
          'Pour into the correct labeled containers.',
          'Date each container — these have defined use-by timelines.',
          'Refrigerate immediately.',
        ],
        competencyCriteria: [
          'Maui base prepared to recipe spec',
          'Kona base prepared to recipe spec',
          'Both labeled and dated before refrigerating',
        ],
      },
      {
        id: 'cl-6',
        name: 'Day 10 — Clean the espresso machine',
        description: 'Perform the full nightly espresso machine cleaning: backflush group heads, wipe steam wands, clean drip tray, and wipe the machine exterior.',
        estimatedMinutes: 15,
        steps: [
          'Remove portafilters and knock out grounds.',
          'Insert the blind basket and perform a backflush with the cleaning tablet if on schedule.',
          'Run a rinse cycle through each group head until water runs clear.',
          'Wipe each steam wand — purge first, then wipe with a damp cloth immediately.',
          'Remove and empty the drip tray — wash and rinse in the dish area.',
          'Wipe the machine exterior with a damp cloth.',
          'Replace portafilters for the opening shift.',
        ],
        competencyCriteria: [
          'Both group heads backflushed (with tablet if scheduled)',
          'Steam wands purged and wiped — no milk residue remaining',
          'Drip tray removed, washed, and replaced',
          'Machine exterior wiped clean',
        ],
      },
      {
        id: 'cl-7',
        name: 'Day 10 — Restock sugars, straws, and powders',
        description: 'Refill sugar containers, straw dispensers, and all powder containers to par for the opening shift.',
        estimatedMinutes: 8,
        steps: [
          'Check each sugar container (white, raw, sugar-free) — refill from the back if below half.',
          'Restock the straw dispenser at the condiment bar.',
          'Check each powder container at the bar — refill from the back stock bag.',
          'Replace measuring scoops in each powder container.',
          'Put the lids back on powder containers for overnight.',
        ],
        competencyCriteria: [
          'All sugar containers refilled to par',
          'Straw dispenser refilled',
          'All powder containers refilled and lids replaced for overnight',
          'Measuring scoops in each powder container',
        ],
      },
      {
        id: 'cl-8',
        name: 'Day 10 — Sweep and mop the floors',
        description: 'Sweep and mop the entire store — bar area, FOH, and back area — before closing.',
        estimatedMinutes: 20,
        steps: [
          'Sweep the bar area first — get all grounds, crumbs, and debris.',
          'Sweep the FOH/lobby.',
          'Sweep the back area.',
          'Empty the dustpan into the trash.',
          'Fill the mop bucket with hot water and the correct cleaning solution.',
          'Mop bar area → back area → FOH (always mop toward the exit).',
          'Empty and rinse the mop bucket after mopping.',
        ],
        competencyCriteria: [
          'Entire store swept — bar, FOH, and back',
          'Entire store mopped — correct solution, mopped toward exit',
          'Mop bucket emptied and rinsed after use',
        ],
      },
      {
        id: 'cl-9',
        name: 'Day 10 — Clean the bathroom and toilet',
        description: 'Clean both customer restrooms at close: toilet, sink, mirror, floors, and restock supplies.',
        estimatedMinutes: 15,
        steps: [
          'Put on gloves before entering.',
          'Scrub the toilet bowl with the toilet brush and cleaner.',
          'Wipe the toilet exterior (seat, lid, base) with a sanitizing cloth.',
          'Wipe the sink basin, faucet, and counter with a sanitizing cloth.',
          'Wipe the mirror.',
          'Sweep and mop the restroom floor.',
          'Empty the trash can.',
          'Restock toilet paper, paper towels, and hand soap to full.',
        ],
        competencyCriteria: [
          'Toilet scrubbed and exterior wiped',
          'Sink, faucet, and counter sanitized',
          'Mirror wiped clean',
          'Restroom floor swept and mopped',
          'Trash emptied and supplies restocked',
        ],
      },
      {
        id: 'cl-10',
        name: 'Day 10 — Clean drains, drain covers, and drain dish tray',
        description: 'Remove and scrub the bar floor drain covers, clean the drain dish tray, and pour a cleaning solution down the bar drains.',
        estimatedMinutes: 10,
        steps: [
          'Remove all bar drain covers.',
          'Scrub drain covers with a brush and degreaser.',
          'Rinse drain covers and replace.',
          'Remove the drain dish tray (catch tray under the drip machine or similar).',
          'Wash, rinse, and sanitize the drain dish tray.',
          'Replace the drain dish tray.',
          'Pour the designated drain cleaning solution down each bar drain.',
        ],
        competencyCriteria: [
          'Drain covers removed, scrubbed, rinsed, and replaced',
          'Drain dish tray washed, sanitized, and replaced',
          'Drain cleaning solution poured down bar drains',
        ],
      },
      {
        id: 'cl-11',
        name: 'Day 10 — Make Energy Slushy Mix',
        description: 'Prepare the Energy Slushy mix so it is ready to be loaded into the slushy machine for the next day.',
        estimatedMinutes: 10,
        steps: [
          'Follow the posted Energy Slushy mix recipe.',
          'Measure each ingredient precisely.',
          'Mix thoroughly in the designated container.',
          'Label and date the container.',
          'Store in the walk-in refrigerator overnight.',
        ],
        competencyCriteria: [
          'Energy Slushy mix prepared to recipe spec',
          'Container labeled and dated',
          'Stored in the refrigerator overnight',
        ],
      },
      {
        id: 'cl-12',
        name: 'Day 10 — Clean window sills and sinks',
        description: 'Wipe down all window sills and scrub all sinks (bar sink, back sink, hand sink) before closing.',
        estimatedMinutes: 10,
        steps: [
          'Wipe all window sills with a damp cloth — remove dust, condensation, and debris.',
          'Scrub the bar sink basin with a sponge and dish soap.',
          'Scrub the back sinks.',
          'Rinse all sinks thoroughly.',
          'Wipe the faucet fixtures on each sink.',
        ],
        competencyCriteria: [
          'All window sills wiped clean',
          'Bar sink and back sinks scrubbed and rinsed',
          'Faucet fixtures wiped',
        ],
      },
      {
        id: 'cl-13',
        name: 'Day 10 — Turn off and clean the oven (alternating schedule)',
        description: 'Turn off the oven at close and clean it on the alternating cleaning schedule (not every day — follow the posted schedule).',
        estimatedMinutes: 15,
        steps: [
          'Turn off the oven at close — confirm the power indicator light is off.',
          'Check the posted cleaning schedule to see if today is a cleaning day.',
          'If yes: once cool, remove the oven racks.',
          'Wipe the interior with an appropriate oven-safe cleaner and cloth.',
          'Wipe the oven door glass and exterior.',
          'Replace the racks and leave the door slightly ajar overnight.',
        ],
        competencyCriteria: [
          'Oven powered off at close',
          'Cleaning schedule checked before cleaning — only cleaned on scheduled days',
          'If cleaning day: interior, racks, door, and exterior wiped',
        ],
      },
      {
        id: 'cl-14',
        name: 'Day 10 — Turn off and clean the slushy machine (weekly)',
        description: 'Turn off the slushy machine at close and perform the full deep clean on the weekly cleaning schedule.',
        estimatedMinutes: 20,
        steps: [
          'Turn off the slushy machine at close.',
          'Turn off the slushy machine light.',
          'Check the posted cleaning schedule — full deep clean is weekly.',
          'If weekly clean day: drain the remaining mix from the machine into a designated container.',
          'Disassemble the dispensing nozzle and washable parts.',
          'Wash all parts in warm soapy water, rinse, and sanitize.',
          'Wipe the machine exterior and interior drum if accessible.',
          'Reassemble and leave powered off until morning.',
        ],
        competencyCriteria: [
          'Slushy machine and light powered off at close',
          'Weekly cleaning schedule checked before disassembly',
          'If cleaning day: parts disassembled, washed, sanitized, and reassembled',
          'Machine exterior wiped',
        ],
      },
      {
        id: 'cl-15',
        name: 'Day 10 — Plug in iPads overnight',
        description: 'Ensure all iPads used during the shift are plugged into their charging cables overnight so they are at full battery for the opening shift.',
        estimatedMinutes: 3,
        steps: [
          'Locate all iPads used during the shift (POS, recipe book, schedule).',
          'Plug each iPad into its designated charging cable.',
          'Confirm each iPad shows the charging indicator.',
          'Place iPads in their designated storage spot.',
        ],
        competencyCriteria: [
          'All iPads plugged in and confirmed charging at close',
          'iPads in their designated storage location',
        ],
      },
      {
        id: 'cl-16',
        name: 'Day 10 — Take out the trash',
        description: 'Empty all trash cans in the bar, FOH, back, and restrooms and replace liners before closing.',
        estimatedMinutes: 8,
        steps: [
          'Gather trash bags from all cans: bar, FOH, condiment station, back, restrooms.',
          'Tie off all full bags and bring to the back door or dumpster.',
          'Place all bags in the dumpster.',
          'Replace liners in every trash can.',
          'Wipe down any trash can exteriors that have visible residue.',
        ],
        competencyCriteria: [
          'All trash cans emptied — bar, FOH, back, and restrooms',
          'All cans have fresh liners',
          'Trash bags in the dumpster',
        ],
      },
      {
        id: 'cl-17',
        name: 'Day 10 — Brew cold brew overnight',
        description: 'Start the cold brew batch at close so it steeps overnight (~14 hours). Do NOT place in the refrigerator when done — cold brew steeps at room temperature.',
        estimatedMinutes: 10,
        steps: [
          'Follow the cold brew brewing steps from Section 3.1 (coarse grind, filter bag, fill Toddy with water to 1 inch from top).',
          'Label the Toddy with the brew date and Ready By time (current time + 14 hours).',
          'Do NOT place in the refrigerator when done. Cold brew steeps at room temperature overnight.',
          'Leave in a safe, stable spot where it will not be disturbed.',
        ],
        competencyCriteria: [
          'Cold brew set up per the Section 3.1 procedure (coarse grind, filter bag, water to 1 inch from top)',
          'Toddy labeled with brew date and Ready By time (current time + 14 hours)',
          'Cold brew NOT placed in the refrigerator — steeps at room temperature',
        ],
      },
      {
        id: 'cl-18',
        name: 'Day 10 — Clean the breakfast/pastry area',
        description: 'Clean the pastry display area, any food prep surfaces, and remove unsold items per the end-of-day food policy.',
        estimatedMinutes: 10,
        steps: [
          'Remove all remaining pastries from the display case.',
          'Check dates — discard any pastries that have passed their use-by date.',
          'Store remaining sellable pastries per the food storage policy (refrigerate or covered container).',
          'Wipe all surfaces in the pastry display area and food prep zone with a sanitizing cloth.',
          'Empty any pastry crumb trays.',
        ],
        competencyCriteria: [
          'All pastries removed from the display case',
          'Expired pastries discarded — none retained past use-by date',
          'Pastry area surfaces and crumb trays wiped clean',
        ],
      },
      {
        id: 'cl-19',
        name: 'Day 10 — Wipe furniture and lobby surfaces',
        description: 'Wipe all tables, chairs, bar tops, and stools in the customer seating area at the end of the shift.',
        estimatedMinutes: 10,
        steps: [
          'Use a clean sanitizing cloth from the bucket.',
          'Wipe each table surface on both sides if applicable.',
          'Wipe all chair seat backs and armrests.',
          'Wipe bar tops and stools.',
          'Stack chairs and stools on tables or counters (position-up) for mopping.',
        ],
        competencyCriteria: [
          'All tables wiped with a sanitizing cloth',
          'All chairs and stools wiped',
          'Chairs and stools stacked on tables/counters for overnight',
        ],
      },
      {
        id: 'cl-20',
        name: 'Day 10 — Final fridge temperature check',
        description: 'Check and log the temperature of all refrigerators and coolers before closing to ensure food safety compliance.',
        estimatedMinutes: 5,
        steps: [
          'Check the thermometer on each fridge and cooler.',
          'All units must be at or below 40°F (4°C).',
          'Record each temperature on the closing temperature log.',
          'If any unit is above 40°F: alert the manager immediately — do not close without resolution.',
        ],
        competencyCriteria: [
          'All fridges and coolers checked at close',
          'Temperatures at or below 40°F for each unit',
          'Temperatures recorded on the closing temperature log',
          'Manager alerted if any unit is out of range',
        ],
      },
      {
        id: 'cl-21',
        name: 'Day 10 — Discard expired food & inventory dating/labeling',
        description: 'Audit all prep containers and food items for date labels — discard anything past its use-by window and label any unlabeled items.',
        estimatedMinutes: 10,
        steps: [
          'Go through all prep containers in the bar fridge and walk-in.',
          'Check the date label on each container.',
          'Discard any container that is past its posted use-by window — no exceptions.',
          'Any container that is missing a date label must be labeled now with today\'s date (or discarded if origin is unknown).',
          'Add any newly made prep items (teas, bases, sauces) to the dating log.',
        ],
        competencyCriteria: [
          'All prep containers checked for date labels at close',
          'Expired items discarded — none retained past use-by window',
          'Unlabeled containers dated or discarded',
          'Newly made prep items logged with today\'s date',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'supervised-practice',
    name: 'Supervised Practice',
    description: 'Section 9 (Days 11–13) — Three full supervised shifts in multiple roles. Focus on confidence, efficiency, sustaining the 4-minute goal, and completing all hourly duties independently.',
    order: 9,
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'sp-1',
        name: 'Day 11 — Supervised Shift: Bar Role (Full Shift)',
        description: 'Hold the Drink Preparer position for a full shift with a trainer observing from a distance. No intervention unless requested or safety requires it.',
        estimatedMinutes: 240,
        steps: [
          'Trainer assigns the Bar / Drink Preparer role for the full shift.',
          'New Hire completes pre-rush staging independently.',
          'New Hire holds the bar through the AM rush and midday window.',
          'Trainer observes — does not prompt. New Hire must ask for help before falling behind.',
          'After the shift, trainer gives a full debrief: drink quality, speed, sequencing, bar cleanliness.',
        ],
        competencyCriteria: [
          'Holds the bar position for the full assigned shift length',
          'Completes pre-rush staging without prompting',
          'Maintains correct build sequence (cold → blended → hot, espresso last) throughout',
          'Calls every drink at handoff',
          'Bar stays clean throughout the shift — no extended build-up',
          'Asks for backup before falling significantly behind rather than waiting for trainer to step in',
        ],
      },
      {
        id: 'sp-2',
        name: 'Day 11 — Complete Hourly Cleaning Tasks During Shift',
        description: 'Execute all required hourly cleaning duties during the Day 11 shift without being prompted — sanitizing bucket changes every 2 hours and lobby/restroom checks every 30 minutes.',
        estimatedMinutes: 30,
        steps: [
          'Monitor the sanitizing bucket timer — change buckets at the 2-hour mark.',
          'Monitor the lobby check timer — conduct a lobby/restroom walk every 30 minutes.',
          'During lobby walk: check tables, trash, restroom supplies, and condiment station.',
          'Report any issues found during the walk to the shift lead.',
        ],
        competencyCriteria: [
          'Changes sanitizing buckets at the 2-hour mark without being reminded',
          'Conducts lobby and restroom walk every 30 minutes without prompting',
          'Reports any FOH issues found during walks to the shift lead',
        ],
      },
      {
        id: 'sp-3',
        name: 'Day 11 — Log Breaks Accurately',
        description: 'Correctly log break start and end times in the timekeeping system during the Day 11 shift.',
        estimatedMinutes: 5,
        steps: [
          'Before taking a break, confirm with the shift lead that it is an appropriate time.',
          'Clock out for the break in the timekeeping system.',
          'Return on time — breaks are typically 10 minutes (paid) or 30 minutes (unpaid meal break per CA law).',
          'Clock back in when returning from the break.',
          'Never take a break without logging it — over/under time is a compliance issue.',
        ],
        competencyCriteria: [
          'Clocks out before every break and clocks back in on return',
          'Takes breaks at the correct times as approved by the shift lead',
          'Does not take a break without logging it in the timekeeping system',
        ],
      },
      {
        id: 'sp-4',
        name: 'Day 12 — Supervised Shift: Register / Order Taker Role (Full Shift)',
        description: 'Hold the Order Taker / register position for a full shift. Focus on accuracy, customer interaction, and tight bar communication.',
        estimatedMinutes: 240,
        steps: [
          'Trainer assigns the Order Taker role for the full shift.',
          'New Hire greets every customer, takes orders, and rings in accurately.',
          'New Hire calls every drink name and modifier to the bar audibly.',
          'New Hire handles a minimum of one void and one refund during the shift.',
          'Trainer observes from a distance — debriefs after shift.',
        ],
        competencyCriteria: [
          'Holds the register for the full assigned shift length',
          'Rings in a full shift of orders with no more than one mis-ring requiring correction',
          'Calls drink names and all modifiers to bar audibly on every order',
          'Handles at least one void with correct manager-approval protocol',
          'Handles at least one refund per SOP',
          'Maintains composure and friendliness with customers throughout',
        ],
      },
      {
        id: 'sp-5',
        name: 'Day 12 — Sustaining the 4-Minute Drink Goal',
        description: 'During the Day 12 shift, the trainer times a sample of drinks to verify New Hire is sustaining the 4-minute goal across the whole shift, not just during low-volume windows.',
        estimatedMinutes: 30,
        steps: [
          'Trainer selects 8–10 random drinks across different volume windows to time.',
          'New Hire is not told which specific drinks are being timed.',
          'Trainer records: ticket-to-handoff time for each sampled drink.',
          'Target: at least 80% of sampled drinks complete within 4 minutes.',
          'Debrief: trainer shares results and identifies the specific build steps where time is lost.',
        ],
        competencyCriteria: [
          'At least 80% of trainer-timed drinks complete within 4 minutes',
          'No drinks exceed 7 minutes regardless of complexity',
          'Identifies their own slowest build step when asked by trainer',
        ],
      },
      {
        id: 'sp-6',
        name: 'Day 12 — Confidence & Efficiency Self-Assessment',
        description: 'After the Day 12 shift, New Hire completes a guided self-assessment with the trainer — rating their own confidence on each core skill area and identifying one goal for Day 13.',
        estimatedMinutes: 15,
        steps: [
          'Trainer leads a debrief conversation after the Day 12 shift.',
          'New Hire rates their own confidence (1–5) on: milk steaming, espresso, recipe recall, POS, bar cleanliness, rush sequencing.',
          'Trainer shares their own ratings and discusses any gaps.',
          'Together, they identify one specific improvement goal for the Day 13 shift.',
          'Trainer documents the goal so it can be reviewed at the start of Day 13.',
        ],
        competencyCriteria: [
          'Completes the self-assessment with honest ratings across all skill areas',
          'Can articulate at least one specific area for improvement',
          'Agrees on a concrete improvement goal for Day 13 with the trainer',
        ],
      },
      {
        id: 'sp-7',
        name: 'Day 13 — Supervised Shift: Floor Manager / Support Role (Full Shift)',
        description: 'Hold the Floor Manager and general support role for a full shift — monitoring the lobby, supporting both bar and register, and handling any customer issues independently.',
        estimatedMinutes: 240,
        steps: [
          'Trainer assigns the Floor Manager role for the full shift.',
          'New Hire conducts lobby walks every 30 minutes.',
          'New Hire supports bar and register when either lane falls behind — communicates before switching.',
          'New Hire handles all customer complaints that arise during the shift using the listen → acknowledge → fix → escalate model.',
          'New Hire completes all restock tasks as needed without being prompted.',
          'Trainer observes from a distance — full debrief at end of shift.',
        ],
        competencyCriteria: [
          'Conducts lobby/restroom walks every 30 minutes throughout the shift',
          'Supports bar or register when volume requires — communicates before crossing into another lane',
          'Handles at least one customer complaint using the correct resolution sequence',
          'Completes all restock tasks without prompting',
          'Shift lead or trainer does not need to redirect during the shift',
        ],
      },
      {
        id: 'sp-8',
        name: 'Day 13 — All-Role Rotation Review',
        description: 'At the end of Day 13, trainer confirms New Hire has demonstrated competency in all three roles across Days 11–13 and is ready for the Final Review.',
        estimatedMinutes: 20,
        steps: [
          'Trainer reviews performance notes from Days 11, 12, and 13.',
          'Trainer confirms: bar role (Day 11) ✓, register/order taker role (Day 12) ✓, floor manager role (Day 13) ✓.',
          'Trainer discusses any role where the New Hire still needs growth.',
          'If a role did not meet standard, an additional supervised shift in that role is scheduled before the Final Review.',
          'If all three roles are confirmed, the Final Review is scheduled for Day 14.',
        ],
        competencyCriteria: [
          'All three roles (bar, register, floor manager) confirmed as meeting standard',
          'Any below-standard role has a remediation plan agreed upon',
          'New Hire confirmed as ready for the Day 14 Final Review',
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'final-review',
    name: 'Final Review & Sign-Off',
    description: 'Section 10 (Day 14) — Comprehensive practical exam, written exam, 30–90 day proficiency check, roles/responsibility, CA minor work rules (if applicable), schedule review, and final manager sign-off.',
    order: 10,
    contentVersion: 3,
    updatedAt: '2026-05-14T00:00:00Z',
    skills: [
      {
        id: 'fr-1',
        name: 'Day 14 — Comprehensive Practical Exam: Multi-Drink Multi-Task',
        description: 'Trainer assigns a multi-drink order (3–5 drinks, mixed hot/cold/blended) and evaluates the full build from order receipt to handoff while the New Hire handles a simultaneous secondary task.',
        estimatedMinutes: 45,
        steps: [
          'Trainer presents a 3–5 drink ticket with a mix of sizes, temperatures, and modifiers.',
          'New Hire reads the ticket, sequences the build, and executes start to finish.',
          'During the build, trainer introduces a simultaneous task (e.g., a customer asks a question, a supply needs restocking).',
          'Trainer grades: sequencing, quality, speed (4-minute target per drink), composure, and handoff.',
          'Trainer repeats with a second ticket that includes at least one custom modification.',
        ],
        competencyCriteria: [
          'Sequences multi-drink ticket in correct order (cold → blended → hot, espresso last)',
          'Every drink in the ticket meets quality standard (correct temp, texture, measurements)',
          'Manages the simultaneous secondary task without losing queue position',
          'All drinks completed within the 4-minute target per drink',
          'Calls each drink at handoff with customer name',
        ],
      },
      {
        id: 'fr-2',
        name: 'Day 14 — Written Exam',
        description: 'Complete the written knowledge exam covering food safety rules, Makenna Koffee policies, recipe knowledge, and compliance topics.',
        estimatedMinutes: 30,
        steps: [
          'Trainer provides the written exam document.',
          'New Hire completes the exam independently — no notes or phone.',
          'Exam covers: food temperature rules, 3-sink procedure, core drink recipes, cash handling policies, harassment policy key points, opening/closing task sequence.',
          'Passing score is determined by the manager (typically 80%+).',
          'Trainer reviews answers together with the New Hire after grading.',
        ],
        competencyCriteria: [
          'Completes the written exam independently without reference materials',
          'Achieves passing score (80% or as set by the manager)',
          'Reviews incorrect answers with the trainer after grading',
        ],
      },
      {
        id: 'fr-3',
        name: 'Day 14 — 30–90 Day Proficiency Check Explanation',
        description: 'Manager or trainer explains the post-training proficiency check schedule: what happens at 30 days and 90 days, and what the evaluation looks at.',
        estimatedMinutes: 10,
        steps: [
          'Manager explains: training sign-off is not the end — a 30-day check-in and a 90-day proficiency review follow.',
          '30-day check: shift lead observation during a regular shift, brief feedback conversation.',
          '90-day check: manager-led performance review — speed, quality, teamwork, reliability.',
          'New Hire can raise questions or concerns at either check-in.',
          'Ongoing recipe updates are communicated via the iPad recipe book — it is the New Hire\'s responsibility to stay current.',
        ],
        competencyCriteria: [
          'Can explain what happens at the 30-day check-in in their own words',
          'Can explain what happens at the 90-day proficiency review in their own words',
          'Understands that the iPad recipe book is the source of truth for recipe updates',
        ],
      },
      {
        id: 'fr-4',
        name: 'Day 14 — Roles & Responsibility Clarification',
        description: 'Review what actions are in scope for a barista and what requires manager or shift lead approval — especially cash, comps, and customer incidents.',
        estimatedMinutes: 15,
        steps: [
          'Manager walks through the barista scope of authority: can restock, clean, build drinks, handle standard customer questions.',
          'Actions that require shift lead approval: voids, drink remakes above a certain value.',
          'Actions that require manager approval: refunds, comps, any incident documentation, employee conflicts.',
          'Escalation path during a customer incident: attempt resolution → call shift lead → call manager.',
          'New Hire confirms they understand their authority level and the escalation chain.',
        ],
        competencyCriteria: [
          'States which actions a barista can handle independently',
          'States which actions require shift lead approval',
          'States which actions require manager approval',
          'Describes the correct escalation path during a customer complaint or incident',
        ],
      },
      {
        id: 'fr-5',
        name: 'Day 14 — CA Minor Work Rules (If Applicable)',
        description: 'If the New Hire is under 18, review California minor labor law requirements: restricted hours, break schedules, and permit requirements.',
        estimatedMinutes: 10,
        steps: [
          'Manager confirms whether the New Hire is under 18 years old.',
          'If yes: review CA minor work permit requirement — employee must have a valid work permit on file.',
          'Review restricted hours: school-night maximums, no work past 10 PM (school night) or 12:30 AM (non-school night) for minors under 16.',
          'Review break schedule compliance for minors — same 10-min/30-min structure, strictly enforced.',
          'Confirm work permit is on file or schedule when it will be submitted.',
        ],
        competencyCriteria: [
          'If a minor: work permit is on file or a submission date is confirmed',
          'If a minor: states correct restricted-hours rules for their age group',
          'If a minor: understands break schedule is non-negotiable',
          'If not a minor: confirms this item does not apply and is documented as such',
        ],
      },
      {
        id: 'fr-6',
        name: 'Day 14 — Schedule Review & Next Steps',
        description: 'Review the upcoming work schedule, confirm the shift lead check-in cadence, and ensure the New Hire knows how to request changes or time off.',
        estimatedMinutes: 10,
        steps: [
          'Manager pulls up the upcoming 2-week schedule and walks through it with the New Hire.',
          'Confirm any conflicts or availability issues before the schedule is final.',
          'Explain the time-off request process and the lead time required.',
          'Explain how schedule changes are communicated (scheduling app notification).',
          'Confirm the weekly shift lead check-in cadence for the first 30 days.',
        ],
        competencyCriteria: [
          'Confirms upcoming schedule and raises any conflicts before the end of Day 14',
          'Knows how to request time off and how far in advance',
          'Knows where schedule change notifications come from (scheduling app)',
          'Knows who to contact for shift-related questions (shift lead → manager)',
        ],
      },
      {
        id: 'fr-7',
        name: 'Day 14 — Manager Sign-Off & Certification Form',
        description: 'Both the trainee and the trainer/manager sign the certification form to complete the training program. Training is officially complete when signatures are collected.',
        estimatedMinutes: 10,
        steps: [
          'Manager retrieves the training certification form for the New Hire.',
          'Manager reviews the completed training checklist — confirms all required sections are signed off.',
          'New Hire signs the trainee signature line on the certification form.',
          'Trainer signs the trainer signature line.',
          'Manager countersigns and dates.',
          'A copy is given to the New Hire. Original is filed in the employee record.',
        ],
        competencyCriteria: [
          'All required training station sign-offs completed before certification',
          'New Hire signature collected on the certification form',
          'Trainer signature collected on the certification form',
          'Manager signature and date collected',
          'Copy given to New Hire — original filed in employee record',
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
