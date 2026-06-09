/**
 * Write-up templates for each accountability type.
 * Each template defines the structured fields that managers fill out,
 * the pre-filled description language, and how the final document reads.
 */

import type { AccountabilityType } from '@/types';

export type FieldType = 'dropdown' | 'multi_select' | 'text' | 'textarea' | 'date' | 'number';

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // for dropdown / multi_select
  placeholder?: string;
  helperText?: string;
  /** Pre-filled default text shown in textarea/text fields */
  defaultValue?: string;
}

export interface AccountabilityTemplate {
  type: AccountabilityType;
  /** Default title inserted into the record */
  defaultTitle: string;
  /** Instructional note shown at top of form */
  formNote?: string;
  fields: TemplateField[];
  /** Boilerplate footer appended to the generated description */
  closingStatement: string;
}

// ─── SCENARIO CATEGORIES ────────────────────────────────────────────────────
// The 3 primary write-up scenarios managers pick from before filling the form.
// Each scenario pre-populates incident category and description boilerplate
// tuned specifically for that situation × warning type.

export type ScenarioKey = 'attendance' | 'performance' | 'conduct';

export interface Scenario {
  key: ScenarioKey;
  label: string;
  subtitle: string;
  emoji: string;
  /** Which incidentCategory option to pre-select */
  defaultIncidentCategory: string;
  /** Pre-written description by warning type */
  descriptionByType: Partial<Record<AccountabilityType, string>>;
  /** Corrective actions to pre-select */
  defaultCorrectiveActions: string[];
  /** Incident categories that belong to this scenario (for the dropdown) */
  relevantCategories: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    key: 'attendance',
    label: 'Attendance & Time Management',
    subtitle: 'Late arrivals, no-calls, leaving early, excessive absences',
    emoji: '🕐',
    defaultIncidentCategory: 'Attendance / No Call No Show',
    relevantCategories: [
      'Attendance / No Call No Show',
      'Tardiness / Late Arrival',
      'Early Departure',
    ],
    defaultCorrectiveActions: [
      'Attendance improvement',
      'Follow all company policies as outlined in handbook',
      'No further policy violations',
    ],
    descriptionByType: {
      verbal_warning:
        'On [DATE], a verbal warning was issued to [EMPLOYEE NAME] regarding attendance and time management.\n\n' +
        'Specifically: [EMPLOYEE NAME] [describe the incident — e.g., "arrived 32 minutes late to their scheduled shift on [date] without prior notice or communication. This is the [second] late arrival within [30] days."].\n\n' +
        'Makenna Koffee Company requires team members to arrive on time, in uniform, and ready to work at the start of their scheduled shift. ' +
        'Late arrivals and unexcused absences directly impact the team, our guests, and the quality of service we provide.\n\n' +
        'This matter was discussed with the employee in person today. The employee was reminded of the attendance policy and informed that continued issues will result in further disciplinary action.',

      write_up:
        'On [DATE], a formal written warning is being issued to [EMPLOYEE NAME] for ongoing attendance and time management concerns.\n\n' +
        'Incident(s): [Describe the specific incident(s) with dates and times — e.g., "On [date], the employee did not report to their scheduled shift and did not call or notify management prior to their start time (No Call / No Show). This follows a verbal warning issued on [prior date] for tardiness."]\n\n' +
        'Attendance history (last 90 days):\n' +
        '• [Date] — [Late arrival / No call / No show / Early departure] — [details]\n' +
        '• [Date] — [Late arrival / No call / No show / Early departure] — [details]\n' +
        '• [Date] — [Verbal warning issued]\n\n' +
        'Makenna Koffee Company\'s attendance policy requires employees to arrive on time for all scheduled shifts and to notify management at least [2 hours] in advance if they are unable to report to work. ' +
        'Failure to do so is a violation of our Employee Handbook and directly harms team operations and guest experience.\n\n' +
        '[EMPLOYEE NAME] is expected to demonstrate immediate and sustained improvement in attendance and punctuality. ' +
        'Any further attendance violations within the review period will result in final written warning or termination.',

      final_warning:
        'On [DATE], a FINAL written warning is being issued to [EMPLOYEE NAME] for continued attendance and time management violations.\n\n' +
        'This warning follows previous disciplinary actions including [list prior warnings with dates]. Despite these interventions, the attendance issues have continued.\n\n' +
        'Most recent incident: [Describe the incident that triggered this final warning.]\n\n' +
        'Attendance history (last 90 days):\n' +
        '• [Date] — [Incident details]\n' +
        '• [Date] — [Incident details]\n' +
        '• [Date] — [Prior verbal or written warning issued]\n\n' +
        'This is [EMPLOYEE NAME]\'s FINAL written warning. Any further attendance violation — including but not limited to tardiness, no call/no show, or early departure — ' +
        'will result in immediate termination of employment. No additional warnings will be issued.',

      suspension:
        'On [DATE], [EMPLOYEE NAME] is being suspended from work due to a serious attendance violation.\n\n' +
        'Incident: [EMPLOYEE NAME] [describe the incident — e.g., "failed to report to their scheduled shift on [date] and did not contact management. This constitutes a No Call / No Show and follows two prior written warnings for attendance violations."].\n\n' +
        'Given the history of attendance issues and prior disciplinary actions, a suspension is being issued. ' +
        '[EMPLOYEE NAME] is not to report to work during the suspension period listed above. ' +
        'Return to work on [RETURN DATE] is conditional on meeting the requirements outlined in this document.',
    },
  },

  {
    key: 'performance',
    label: 'Job Performance',
    subtitle: 'Quality of work, speed, recipe accuracy, skill gaps',
    emoji: '📊',
    defaultIncidentCategory: 'Performance / Quality of Work',
    relevantCategories: [
      'Performance / Quality of Work',
      'Customer Service',
      'Food Safety / Sanitation',
    ],
    defaultCorrectiveActions: [
      'Demonstrate consistent performance improvement',
      'Complete additional training',
      'Meet with manager weekly for check-in',
    ],
    descriptionByType: {
      verbal_warning:
        'On [DATE], a verbal warning was issued to [EMPLOYEE NAME] regarding job performance.\n\n' +
        'Specifically: [Describe the performance gap — e.g., "During the shift on [date], the employee consistently made recipe errors and was unable to keep up with bar volume during a moderate rush. Multiple drinks were remade and a guest complaint was received."]\n\n' +
        'Makenna Koffee Company holds all team members to a high standard of quality and efficiency. ' +
        'Our guests expect consistent, well-crafted drinks delivered with speed and care. ' +
        'This level of performance does not yet meet our expectations for someone at [EMPLOYEE NAME\'s] stage of training.\n\n' +
        'The employee was coached on the specific areas needing improvement (listed below) and offered additional support. ' +
        'We are committed to helping [EMPLOYEE NAME] succeed, and this conversation is intended as an early intervention.',

      write_up:
        'On [DATE], a formal written warning is being issued to [EMPLOYEE NAME] regarding job performance concerns that have persisted despite prior coaching.\n\n' +
        'Performance issues observed:\n' +
        '• [Date] — [Specific incident or observation, e.g., "Incorrect recipe — Maui Latte made without espresso, guest returned drink"]\n' +
        '• [Date] — [Specific incident or observation]\n' +
        '• [Date] — [Specific incident or observation]\n' +
        '• [Date] — Verbal coaching provided by [MANAGER NAME]\n\n' +
        'These performance gaps are impacting the guest experience and placing additional burden on the team. ' +
        'Despite prior coaching on [dates], the required improvements have not been demonstrated consistently.\n\n' +
        '[EMPLOYEE NAME] is expected to meet the corrective actions outlined below within the review period. ' +
        'A follow-up evaluation will be conducted at the end of the period to assess progress. ' +
        'Failure to demonstrate measurable improvement will result in further disciplinary action.',

      final_warning:
        'On [DATE], a FINAL written warning is being issued to [EMPLOYEE NAME] due to continued job performance issues that have not improved despite prior disciplinary action.\n\n' +
        'Prior disciplinary history: [List prior warnings and dates — e.g., "Verbal warning issued [date], written warning issued [date]."]\n\n' +
        'Since the last warning, the following performance issues have continued:\n' +
        '• [Date] — [Specific incident]\n' +
        '• [Date] — [Specific incident]\n\n' +
        'Makenna Koffee Company has invested in additional training and coaching to support [EMPLOYEE NAME], including [list support provided]. ' +
        'Despite this investment, performance has not reached the required standard.\n\n' +
        'This is [EMPLOYEE NAME\'s] FINAL written warning. If performance does not meet expectations by [END OF REVIEW PERIOD], ' +
        'employment will be terminated. No additional warnings will be issued.',

      pip:
        '[EMPLOYEE NAME] has been experiencing ongoing performance challenges that require a structured improvement plan.\n\n' +
        'Performance concerns identified:\n' +
        '• [Specific area — e.g., Recipe accuracy: drinks are frequently made incorrectly or inconsistently]\n' +
        '• [Specific area — e.g., Speed: unable to maintain bar pace during moderate volume]\n' +
        '• [Specific area — e.g., Guest interaction: limited eye contact, does not greet guests warmly]\n\n' +
        'The following incidents have been documented:\n' +
        '• [Date] — [Incident detail]\n' +
        '• [Date] — [Incident detail]\n' +
        '• [Date] — [Coaching conversation with manager]\n\n' +
        'Makenna Koffee Company is committed to [EMPLOYEE NAME\'s] success. ' +
        'This Performance Improvement Plan is designed to provide structure, clear expectations, and the support needed to reach the required standard.',
    },
  },

  {
    key: 'conduct',
    label: 'Conduct & Policy Violations',
    subtitle: 'Professionalism, policy violations, insubordination, device use',
    emoji: '⚠️',
    defaultIncidentCategory: 'Conduct / Professionalism',
    relevantCategories: [
      'Policy Violation',
      'Conduct / Professionalism',
      'Insubordination',
      'Cell Phone / Device Policy',
      'Social Media Policy',
      'Dress Code / Uniform',
      'Cash Handling / Theft',
      'Safety / Injury Risk',
    ],
    defaultCorrectiveActions: [
      'Maintain professional conduct at all times',
      'Follow all company policies as outlined in handbook',
      'No further policy violations',
    ],
    descriptionByType: {
      verbal_warning:
        'On [DATE], a verbal warning was issued to [EMPLOYEE NAME] regarding conduct and/or a policy violation.\n\n' +
        'Incident: [Describe specifically what occurred — e.g., "The employee was observed using their personal cell phone on the bar floor during an active rush, in violation of Makenna Koffee Company\'s device policy. A manager asked the employee to put the phone away; the employee did so but appeared visibly frustrated."]\n\n' +
        'Makenna Koffee Company expects all team members to maintain professional conduct at all times and to follow all policies outlined in the Employee Handbook. ' +
        'The behavior described above does not meet our standards and reflects poorly on our team and brand.\n\n' +
        'This matter was discussed privately with the employee today. The employee was reminded of the relevant policy and the expectations going forward.',

      write_up:
        'On [DATE], a formal written warning is being issued to [EMPLOYEE NAME] for a conduct violation and/or breach of company policy.\n\n' +
        'Incident details: [Describe what occurred with specifics — date, time, location, witnesses, and any relevant context. ' +
        'E.g., "On [date] at approximately [time], the employee [describe behavior]. ' +
        'This was witnessed by [name/role]. When addressed by management, the employee [describe response]."]\n\n' +
        'This behavior violates Makenna Koffee Company\'s [specific policy — e.g., "Personal Device Policy / Professional Conduct Standards / Employee Handbook Section X"] and is not acceptable.\n\n' +
        'Prior to this incident: [Note any prior coaching, verbal warnings, or relevant history. If none: "This is the first formal disciplinary action for this behavior, though verbal coaching was provided on [date]."]\n\n' +
        '[EMPLOYEE NAME] is expected to correct this behavior immediately and maintain compliance with all company policies going forward.',

      final_warning:
        'On [DATE], a FINAL written warning is being issued to [EMPLOYEE NAME] for continued conduct and/or policy violations.\n\n' +
        'Prior disciplinary actions: [EMPLOYEE NAME] previously received [list prior warnings with dates] for similar conduct. Despite these actions, the behavior has continued or a new serious violation has occurred.\n\n' +
        'Most recent incident: [Describe in detail — date, time, what happened, who witnessed it, what was said.]\n\n' +
        'Makenna Koffee Company takes conduct and policy compliance seriously. ' +
        'The continued pattern of behavior described above is unacceptable and cannot continue.\n\n' +
        'This is [EMPLOYEE NAME\'s] FINAL written warning. Any further violations of company policy or unprofessional conduct will result in immediate termination. ' +
        'There will be no additional warnings.',

      suspension:
        'On [DATE], [EMPLOYEE NAME] is being suspended from work following a serious conduct violation.\n\n' +
        'Incident: [Describe the incident in full — e.g., "On [date], the employee [describe conduct]. ' +
        'This conduct is a serious violation of Makenna Koffee Company\'s standards and policies and requires immediate action."]\n\n' +
        'Witnesses: [Name(s) or "No witnesses present."]\n\n' +
        'Due to the severity of this incident, [EMPLOYEE NAME] is suspended [with/without] pay effective immediately. ' +
        'A full review of this matter will be conducted during the suspension period. ' +
        '[EMPLOYEE NAME] will be contacted on [RETURN DATE] with the outcome of the review and next steps.',
    },
  },
];

// ─── INCIDENT CATEGORIES ────────────────────────────────────────────────────
const INCIDENT_CATEGORIES = [
  'Attendance / No Call No Show',
  'Tardiness / Late Arrival',
  'Early Departure',
  'Performance / Quality of Work',
  'Policy Violation',
  'Conduct / Professionalism',
  'Customer Service',
  'Food Safety / Sanitation',
  'Safety / Injury Risk',
  'Insubordination',
  'Cell Phone / Device Policy',
  'Cash Handling / Theft',
  'Social Media Policy',
  'Dress Code / Uniform',
  'Other',
];

const CORRECTIVE_ACTIONS = [
  'Immediate improvement in attendance',
  'Complete additional training',
  'Follow all company policies as outlined in handbook',
  'Meet with manager weekly for check-in',
  'Demonstrate consistent performance improvement',
  'No further policy violations',
  'Maintain professional conduct at all times',
  'Complete a Performance Improvement Plan (PIP)',
];

const CONSEQUENCE_OPTIONS = [
  'Further written warning',
  'Final written warning',
  'Suspension without pay',
  'Demotion',
  'Termination of employment',
];

const PRIOR_WARNINGS = [
  'Verbal warning',
  'Written warning',
  'Final written warning',
  'Suspension',
  'No prior warnings',
];

// ─── TEMPLATES ──────────────────────────────────────────────────────────────

export const ACCOUNTABILITY_TEMPLATES: Record<AccountabilityType, AccountabilityTemplate> = {

  verbal_warning: {
    type: 'verbal_warning',
    defaultTitle: 'Verbal Warning',
    formNote: 'A verbal warning is a documented conversation. The employee will be asked to acknowledge receipt.',
    fields: [
      {
        key: 'incidentCategory',
        label: 'Reason for Warning',
        type: 'dropdown',
        required: true,
        options: INCIDENT_CATEGORIES,
      },
      {
        key: 'incidentDate',
        label: 'Date of Incident',
        type: 'date',
        required: true,
      },
      {
        key: 'incidentDescription',
        label: 'Description of Incident',
        type: 'textarea',
        required: true,
        placeholder: 'Describe specifically what occurred...',
        defaultValue:
          'On [DATE], a verbal warning was issued to [EMPLOYEE NAME] regarding [SPECIFIC BEHAVIOR/INCIDENT].\n\n' +
          'Specifically: [Describe what happened, e.g., "The employee arrived 25 minutes late to their scheduled shift without prior notice or communication."]\n\n' +
          'This behavior is a violation of Makenna Koffee Company policy and directly impacts the team and our guests. ' +
          'This matter was discussed with the employee in person on the date of this document. ' +
          'The employee was informed that continuation of this behavior will result in further disciplinary action.',
      },
      {
        key: 'priorWarnings',
        label: 'Prior Disciplinary History',
        type: 'multi_select',
        options: PRIOR_WARNINGS,
      },
      {
        key: 'correctiveAction',
        label: 'Expected Corrective Actions',
        type: 'multi_select',
        required: true,
        options: CORRECTIVE_ACTIONS,
      },
      {
        key: 'consequenceIfRepeated',
        label: 'Consequence If Behavior Continues',
        type: 'dropdown',
        required: true,
        options: CONSEQUENCE_OPTIONS,
      },
    ],
    closingStatement: 'This verbal warning has been documented in the employee\'s record. The employee has been informed of the expectations going forward and the consequences of continued behavior.',
  },

  write_up: {
    type: 'write_up',
    defaultTitle: 'Written Warning',
    formNote: 'A written warning is a formal disciplinary document. The employee must acknowledge receipt by agreeing or disagreeing.',
    fields: [
      {
        key: 'incidentCategory',
        label: 'Reason for Written Warning',
        type: 'dropdown',
        required: true,
        options: INCIDENT_CATEGORIES,
      },
      {
        key: 'incidentDate',
        label: 'Date of Incident',
        type: 'date',
        required: true,
      },
      {
        key: 'incidentDescription',
        label: 'Description of Incident',
        type: 'textarea',
        required: true,
        placeholder: 'Describe specifically what occurred...',
        defaultValue:
          'On [DATE], a formal written warning is being issued to [EMPLOYEE NAME] regarding [SPECIFIC BEHAVIOR/INCIDENT].\n\n' +
          'Incident details: [Describe exactly what occurred, including date(s), time(s), location, and any witnesses. Be specific and factual.]\n\n' +
          'This conduct is in violation of Makenna Koffee Company\'s policies and standards of conduct as outlined in the Employee Handbook. ' +
          'This is not the first time this matter has been addressed. Prior discussions/warnings have taken place as noted in the disciplinary history above.\n\n' +
          'Makenna Koffee Company takes this matter seriously. [EMPLOYEE NAME] is expected to correct this behavior immediately. ' +
          'Failure to meet the corrective actions outlined below within the review period will result in further disciplinary action, up to and including termination.',
      },
      {
        key: 'priorWarnings',
        label: 'Prior Disciplinary History',
        type: 'multi_select',
        options: PRIOR_WARNINGS,
      },
      {
        key: 'correctiveAction',
        label: 'Required Corrective Actions',
        type: 'multi_select',
        required: true,
        options: CORRECTIVE_ACTIONS,
      },
      {
        key: 'reviewPeriod',
        label: 'Improvement Review Period',
        type: 'dropdown',
        required: true,
        options: ['30 days', '60 days', '90 days', 'Ongoing'],
      },
      {
        key: 'consequenceIfRepeated',
        label: 'Consequence If Behavior Continues',
        type: 'dropdown',
        required: true,
        options: CONSEQUENCE_OPTIONS,
      },
    ],
    closingStatement: 'This written warning is part of the employee\'s permanent personnel file. The employee\'s signature indicates receipt of this document, not necessarily agreement with its contents. The employee has the right to submit a written rebuttal within 5 business days.',
  },

  final_warning: {
    type: 'final_warning',
    defaultTitle: 'Final Written Warning',
    formNote: 'This is a final warning before potential termination. Document thoroughly.',
    fields: [
      {
        key: 'incidentCategory',
        label: 'Reason for Final Warning',
        type: 'dropdown',
        required: true,
        options: INCIDENT_CATEGORIES,
      },
      {
        key: 'incidentDate',
        label: 'Date of Incident',
        type: 'date',
        required: true,
      },
      {
        key: 'incidentDescription',
        label: 'Description of Incident',
        type: 'textarea',
        required: true,
        placeholder: 'Describe specifically what occurred. Reference any prior warnings...',
        defaultValue:
          'On [DATE], a final written warning is being issued to [EMPLOYEE NAME] regarding [SPECIFIC BEHAVIOR/INCIDENT].\n\n' +
          'Incident details: [Describe exactly what occurred.]\n\n' +
          'This employee has previously received disciplinary action for similar behavior as noted in the history above. ' +
          'Despite prior warnings and coaching, the behavior has continued or recurred.\n\n' +
          'This is [EMPLOYEE NAME]\'s FINAL written warning. Any further violations of company policy, failure to meet the corrective actions below, ' +
          'or recurrence of this behavior within or beyond the review period will result in immediate termination of employment. ' +
          'No further written warnings will be issued prior to termination.',
      },
      {
        key: 'priorWarnings',
        label: 'Prior Disciplinary History',
        type: 'multi_select',
        required: true,
        options: PRIOR_WARNINGS,
      },
      {
        key: 'correctiveAction',
        label: 'Required Corrective Actions',
        type: 'multi_select',
        required: true,
        options: CORRECTIVE_ACTIONS,
      },
      {
        key: 'reviewPeriod',
        label: 'Final Improvement Period',
        type: 'dropdown',
        required: true,
        options: ['30 days', '60 days', '90 days'],
      },
    ],
    closingStatement: 'This is a final written warning. Any further violations of company policy or failure to meet the corrective actions outlined above will result in immediate termination of employment. This document is part of the employee\'s permanent personnel file.',
  },

  suspension: {
    type: 'suspension',
    defaultTitle: 'Suspension Notice',
    formNote: 'Document the reason for suspension, the dates, and return-to-work conditions.',
    fields: [
      {
        key: 'incidentCategory',
        label: 'Reason for Suspension',
        type: 'dropdown',
        required: true,
        options: INCIDENT_CATEGORIES,
      },
      {
        key: 'incidentDate',
        label: 'Date of Incident',
        type: 'date',
        required: true,
      },
      {
        key: 'incidentDescription',
        label: 'Description of Incident',
        type: 'textarea',
        required: true,
        placeholder: 'Describe specifically what occurred...',
        defaultValue:
          'On [DATE], [EMPLOYEE NAME] is being suspended from work, effective immediately, due to [SPECIFIC REASON].\n\n' +
          'Incident details: [Describe what occurred that necessitates the suspension.]\n\n' +
          'After careful consideration, Makenna Koffee Company has determined that a suspension is appropriate pending [investigation / as disciplinary action]. ' +
          '[EMPLOYEE NAME] is not to report to work during the suspension period. ' +
          'The employee will be contacted at the end of the suspension period with next steps and conditions for return.',
      },
      {
        key: 'suspensionType',
        label: 'Suspension Type',
        type: 'dropdown',
        required: true,
        options: ['With pay (pending investigation)', 'Without pay'],
      },
      {
        key: 'suspensionDays',
        label: 'Number of Suspension Days',
        type: 'number',
        required: true,
        placeholder: 'e.g. 3',
      },
      {
        key: 'returnDate',
        label: 'Return-to-Work Date',
        type: 'date',
        required: true,
      },
      {
        key: 'returnConditions',
        label: 'Return-to-Work Conditions',
        type: 'textarea',
        placeholder: 'Any conditions the employee must meet before returning...',
      },
    ],
    closingStatement: 'The employee is suspended from work during the dates listed above. Return to work is contingent on meeting the conditions outlined. Failure to return on the scheduled date without prior approval may result in termination.',
  },

  pip: {
    type: 'pip',
    defaultTitle: 'Performance Improvement Plan',
    formNote: 'A PIP sets specific, measurable goals and a timeline. Be clear and concrete.',
    fields: [
      {
        key: 'performanceIssue',
        label: 'Performance Area of Concern',
        type: 'dropdown',
        required: true,
        options: [
          'Speed / Efficiency',
          'Quality of drinks / Food preparation',
          'Customer service',
          'Attendance / Punctuality',
          'Teamwork / Communication',
          'Following procedures',
          'Cash handling',
          'Cleanliness / Sanitation',
          'Other',
        ],
      },
      {
        key: 'issueDescription',
        label: 'Description of Performance Issues',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the specific performance gaps observed, with examples and dates...',
        defaultValue:
          '[EMPLOYEE NAME] has been experiencing ongoing performance challenges in the area of [PERFORMANCE AREA]. ' +
          'The following specific incidents have been observed and documented:\n\n' +
          '• [Date] — [Specific incident or observation]\n' +
          '• [Date] — [Specific incident or observation]\n' +
          '• [Date] — [Specific incident or observation]\n\n' +
          'These performance gaps are impacting the team, guests, and the overall quality of service at Makenna Koffee Company. ' +
          'Prior coaching and feedback has been provided on [dates], however the performance has not improved to the expected standard.',
      },
      {
        key: 'goals',
        label: 'Specific Goals & Expectations',
        type: 'textarea',
        required: true,
        placeholder: 'List specific, measurable goals...',
        defaultValue:
          'During the PIP period, [EMPLOYEE NAME] is expected to meet the following goals:\n\n' +
          '1. [Specific measurable goal — e.g., "Complete all required training certifications by [date]"]\n' +
          '2. [Specific measurable goal — e.g., "Zero tardiness or unexcused absences during the PIP period"]\n' +
          '3. [Specific measurable goal — e.g., "Receive a passing score on the next bar skills evaluation"]\n' +
          '4. [Specific measurable goal]\n\n' +
          'Progress will be evaluated at each check-in meeting and at the end of the review period.',
      },
      {
        key: 'supportProvided',
        label: 'Support / Resources Provided',
        type: 'textarea',
        placeholder: 'Additional training, mentorship, schedule adjustments, etc...',
        defaultValue:
          'Makenna Koffee Company is committed to supporting [EMPLOYEE NAME] in meeting these goals. The following resources and support will be provided:\n\n' +
          '• [e.g., Additional one-on-one training sessions with a certified trainer]\n' +
          '• [e.g., Temporary schedule adjustment to reduce peak-hour pressure]\n' +
          '• [e.g., Regular check-ins with the store manager]\n' +
          '• [e.g., Access to training materials and the Brain Blend study guide]',
      },
      {
        key: 'reviewPeriod',
        label: 'PIP Duration',
        type: 'dropdown',
        required: true,
        options: ['30 days', '60 days', '90 days'],
      },
      {
        key: 'checkInSchedule',
        label: 'Check-In Schedule',
        type: 'dropdown',
        options: ['Weekly with direct manager', 'Bi-weekly with manager', 'Monthly review', 'End of period only'],
      },
    ],
    closingStatement: 'Successful completion of this PIP will result in removal from probationary status. Failure to meet the goals outlined by the review date will result in further disciplinary action, up to and including termination.',
  },

  termination: {
    type: 'termination',
    defaultTitle: 'Termination Notice',
    formNote: 'Document all relevant details. Consult with leadership before issuing.',
    fields: [
      {
        key: 'terminationReason',
        label: 'Reason for Termination',
        type: 'dropdown',
        required: true,
        options: [
          'Performance — failure to improve after warnings',
          'Policy violation',
          'Gross misconduct',
          'Job abandonment (3+ no call / no show)',
          'Position eliminated',
          'End of seasonal employment',
          'Other',
        ],
      },
      {
        key: 'incidentDescription',
        label: 'Description / Summary',
        type: 'textarea',
        required: true,
        placeholder: 'Summarize the circumstances leading to termination, referencing prior warnings...',
        defaultValue:
          'After careful consideration, Makenna Koffee Company has made the decision to terminate the employment of [EMPLOYEE NAME], effective [LAST DAY].\n\n' +
          'Summary: [Describe the reason for termination, referencing prior disciplinary steps taken. Be factual and professional.]\n\n' +
          'The decision to terminate was not made lightly. [EMPLOYEE NAME] was previously issued [list prior warnings/discipline]. ' +
          'Despite these interventions, the required improvements were not sustained.\n\n' +
          'This termination is effective immediately / at the end of the employee\'s shift on [LAST DAY]. ' +
          '[EMPLOYEE NAME] should return all company property including keys, uniform items, and any other materials before departing.',
      },
      {
        key: 'lastDay',
        label: 'Last Day of Employment',
        type: 'date',
        required: true,
      },
      {
        key: 'priorWarnings',
        label: 'Prior Disciplinary History Referenced',
        type: 'multi_select',
        options: PRIOR_WARNINGS,
      },
      {
        key: 'equipmentReturned',
        label: 'Equipment / Keys / Uniforms',
        type: 'dropdown',
        options: ['Returned at time of termination', 'To be returned within 24 hours', 'N/A'],
      },
    ],
    closingStatement: 'The employee\'s employment with Makenna Koffee Company is terminated effective the date listed above. Final pay will be issued in accordance with California labor law. The employee should be directed to contact HR with any questions about final pay or benefits.',
  },

  resignation: {
    type: 'resignation',
    defaultTitle: 'Resignation Notice',
    formNote: 'Record the resignation details for the employee file.',
    fields: [
      {
        key: 'resignationMethod',
        label: 'How Resignation Was Submitted',
        type: 'dropdown',
        required: true,
        options: ['Verbal — in person', 'Verbal — phone call', 'Written — text', 'Written — email', 'Written — letter', 'Job abandonment (presumed)'],
      },
      {
        key: 'lastDay',
        label: 'Last Day of Employment',
        type: 'date',
        required: true,
      },
      {
        key: 'noticePeriod',
        label: 'Notice Given',
        type: 'dropdown',
        options: ['No notice', '1 day', '2 days', '1 week', '2 weeks', '3+ weeks'],
      },
      {
        key: 'notes',
        label: 'Additional Notes',
        type: 'textarea',
        placeholder: 'Any relevant context, rehire eligibility notes, etc...',
      },
    ],
    closingStatement: 'This resignation has been recorded in the employee\'s personnel file. Final pay will be issued in accordance with California labor law.',
  },
};
