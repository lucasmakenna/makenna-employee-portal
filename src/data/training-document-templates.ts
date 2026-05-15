/**
 * Training document templates.
 *
 * Each entry maps to a `documentId` field on a TrainingSkill.
 * Two types:
 *   - `external`: Government or third-party PDF. Shown in an iframe.
 *     The signature captures the employee's attestation that they completed
 *     the form out-of-band (printed, mailed, etc.).
 *   - `custom`: Makenna Koffee form rendered in-app. Signature = legal
 *     e-signature on the template body text.
 */

export type TrainingDocumentTemplate = {
  id: string;
  title: string;
  /** Short description shown on the skill card button. */
  description: string;
  /** 'external' = government/third-party PDF shown via embed.
   *  'custom'   = Makenna form rendered as HTML with pre-populated fields. */
  type: 'external' | 'custom';
  /** For external docs: the URL to embed in the iframe. */
  externalUrl?: string;
  /**
   * The canonical text of the document at signing time.
   * SHA-256 of (title + templateBody) is saved in the audit record so any
   * future edit produces a different hash and proves which version was signed.
   * For external forms, this is the attestation/affirmation the signer agrees to.
   */
  templateBody: string;
  /**
   * Employee data fields that are pre-populated into the rendered document.
   * Keys are placeholder tokens {{firstName}}, {{lastName}}, etc.
   */
  populatedFields: Array<'firstName' | 'lastName' | 'email' | 'hireDate' | 'location' | 'role'>;
};

export const TRAINING_DOCUMENT_TEMPLATES: TrainingDocumentTemplate[] = [
  // ── Government Forms ────────────────────────────────────────────────────
  {
    id: 'w4',
    title: 'IRS Form W-4 — Federal Tax Withholding',
    description: 'Federal withholding. Download, complete, and return the original to your manager.',
    type: 'external',
    externalUrl: '/forms/w4.pdf',
    templateBody:
      'I have completed IRS Form W-4 truthfully and to the best of my knowledge. I understand that the information I have provided will be used to determine the federal income tax withheld from my pay. I will notify Makenna Koffee in writing if my filing status, dependents, or other tax-related information changes. Under penalties of perjury, I declare that this certificate, to the best of my knowledge and belief, is true, correct, and complete.',
    populatedFields: ['firstName', 'lastName', 'hireDate'],
  },
  {
    id: 'i9',
    title: 'USCIS Form I-9 — Employment Eligibility Verification',
    description: 'Work authorization. Bring 2 acceptable documents on Day 1.',
    type: 'external',
    externalUrl: '/forms/i9.pdf',
    templateBody:
      "I attest, under penalty of perjury, that I am a citizen or national of the United States, a lawful permanent resident, or an alien authorized to work in the United States. I will present original supporting documentation to my Makenna Koffee Store Manager for in-person inspection on or before my first day of paid work — either one List A document (such as a U.S. passport) OR one List B document (such as a driver's license) and one List C document (such as a Social Security card). If I am under 18 years of age, I will also provide a current school work permit. I understand that my employment is contingent on this verification per federal law.",
    populatedFields: ['firstName', 'lastName', 'hireDate'],
  },
  // ── Makenna Koffee Custom Forms ─────────────────────────────────────────
  {
    id: 'handbook_ack',
    title: 'Employee Handbook Acknowledgement',
    description: 'Confirms you have received and read the Makenna Koffee Employee Handbook.',
    type: 'custom',
    templateBody:
      'I, {{firstName}} {{lastName}}, acknowledge that I have received, read, and understand the Makenna Koffee Employee Handbook, effective {{hireDate}}. I agree to comply with the policies and procedures outlined in it, including those covering attendance, scheduling, conduct, dress code, harassment-free workplace, drug and alcohol use, and discipline. I understand that my employment is at-will and that the handbook may be updated from time to time; current versions are provided through this portal. My signature below confirms I accept these policies as a condition of my employment.',
    populatedFields: ['firstName', 'lastName', 'hireDate', 'location'],
  },
  {
    id: 'harassment_policy_ack',
    title: 'Workplace Harassment & Bullying Policy Acknowledgement',
    description: 'Confirms you have reviewed the Makenna Koffee Harassment & Bullying Policy.',
    type: 'custom',
    templateBody:
      'I, {{firstName}} {{lastName}}, acknowledge that I have reviewed the Makenna Koffee Workplace Harassment, Bullying, and Retaliation Policy on {{hireDate}}. I understand what constitutes harassment, bullying, and retaliation, and I understand all available reporting paths: (1) direct to a Shift Lead or Store Manager; (2) to a different Manager if my Store Manager is involved; (3) by email to mafiasupport@makennakoffee.com, haley@makennakoffee.com, or sabrina@makennakoffee.com; (4) via the posted Workplace Concern Form QR code. I understand that Makenna Koffee has zero tolerance for retaliation against any employee who reports a concern in good faith. My signature below confirms receipt and understanding of this policy.',
    populatedFields: ['firstName', 'lastName', 'hireDate'],
  },
  {
    id: 'nda',
    title: 'Makenna Koffee Nondisclosure Agreement',
    description: 'Confidentiality agreement covering recipes, operational systems, and business information.',
    type: 'custom',
    templateBody:
      'MAKENNA KOFFEE NONDISCLOSURE AGREEMENT\n\nThis Nondisclosure Agreement ("Agreement") is entered into as of {{hireDate}} between Makenna Koffee ("Company") and {{firstName}} {{lastName}} ("Employee") at the {{location}} location.\n\n1. CONFIDENTIAL INFORMATION. Employee agrees to keep strictly confidential all proprietary information of the Company, including but not limited to: drink recipes and preparation methods, pricing and cost structures, supplier relationships and pricing, operational systems and procedures, customer and employee data, and any other non-public business information ("Confidential Information").\n\n2. NON-DISCLOSURE. Employee agrees not to disclose, publish, reproduce, copy, or otherwise disseminate Confidential Information to any third party during employment or after separation, without prior written consent of the Company.\n\n3. NON-USE. Employee agrees to use Confidential Information solely for the purpose of performing employment duties at Makenna Koffee.\n\n4. EXCLUSIONS. This Agreement does not apply to information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was lawfully in Employee\'s possession prior to employment; or (c) is required by law or court order to be disclosed, provided Employee gives Company prompt notice.\n\n5. RETURN OF MATERIALS. Upon separation, Employee agrees to return all materials containing Confidential Information.\n\n6. REMEDIES. Employee acknowledges that breach of this Agreement would cause irreparable harm and that the Company is entitled to seek injunctive relief in addition to other remedies.\n\n7. GOVERNING LAW. This Agreement is governed by the laws of the State of California.\n\nBy signing below, Employee acknowledges reading, understanding, and agreeing to be bound by this Agreement.',
    populatedFields: ['firstName', 'lastName', 'hireDate', 'location'],
  },
  {
    id: 'meal_period_waiver',
    title: 'California Meal Period Waiver',
    description: 'Optional waiver allowing the option to skip the 30-min meal break on shifts ≤ 6 hours. Voluntary.',
    type: 'custom',
    templateBody:
      'CALIFORNIA MEAL PERIOD WAIVER\n\nEmployee: {{firstName}} {{lastName}}\nLocation: {{location}}\nEffective Date: {{hireDate}}\n\nPurpose: California Labor Code § 512 requires a 30-minute unpaid meal period when an employee works more than 5 hours. This waiver, per California law, permits the Employee to voluntarily waive that meal period only when the total work period for the day is no more than 6 hours.\n\nTerms:\n1. This waiver is VOLUNTARY. Signing this document is not a condition of employment. The Employee\'s decision to sign or not sign will not affect their job, their schedule, or their standing at Makenna Koffee.\n2. This waiver applies ONLY to shifts of 6 hours or less. It does not waive any meal period on shifts exceeding 6 hours.\n3. Having this waiver on file does NOT mean the Employee must skip their meal break on every shift. The choice belongs entirely to the Employee, shift by shift, without pressure from management.\n4. If a shift the Employee expected to be 6 hours or less extends beyond 6 hours, the meal break must be provided immediately.\n5. This waiver remains in effect for the duration of the Employee\'s employment unless revoked in writing.\n\nBy signing below, the Employee voluntarily waives their right to a 30-minute meal period on shifts of 6 hours or less, with full understanding of the terms above.',
    populatedFields: ['firstName', 'lastName', 'hireDate', 'location'],
  },
];

export function getTrainingDocTemplate(id: string): TrainingDocumentTemplate | undefined {
  return TRAINING_DOCUMENT_TEMPLATES.find((t) => t.id === id);
}
