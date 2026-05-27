import { OnboardingPacket, OnboardingDocId } from '@/types';

/**
 * Onboarding documents.
 *
 * `templateBody` is the canonical text the signer agrees to. The audit
 * trail SHA-256-hashes title + templateBody so any future edit produces a
 * different hash, and you can prove which version was signed.
 *
 * For the W-4 and I-9 the templateBody here is a summary acknowledgement —
 * in production the full IRS/USCIS form renders inline (PDF) and the
 * acknowledgement text below is the explicit affirmation the signer makes.
 */
export const ONBOARDING_DOCS: {
  id: OnboardingDocId;
  title: string;
  description: string;
  required: boolean;
  templateBody: string;
}[] = [
  {
    id: 'w4',
    title: 'IRS Form W-4',
    description: 'Federal tax withholding. Determines how much federal income tax is held from each paycheck.',
    required: true,
    templateBody: `I have completed IRS Form W-4 truthfully and to the best of my knowledge. I understand that the information I have provided will be used to determine the federal income tax withheld from my pay. I will notify Makenna Koffee in writing if my filing status, dependents, or other tax-related information changes. Under penalties of perjury, I declare that this certificate, to the best of my knowledge and belief, is true, correct, and complete.`,
  },
  {
    id: 'i9',
    title: 'Form I-9 — Employment Eligibility',
    description: 'U.S. work authorization. Bring two (2) work-eligibility documents on Day 1 (e.g., passport — or driver\'s license + Social Security card). If you\'re under 18, you also need a school work permit.',
    required: true,
    templateBody: `I attest, under penalty of perjury, that I am one of the following: (a) a citizen of the United States; (b) a noncitizen national of the United States; (c) a lawful permanent resident; or (d) an alien authorized to work in the United States. I will present original supporting documentation to my Makenna Koffee Store Manager for in-person inspection on or before my first day of paid work — either one List A document (such as a U.S. passport) OR one List B document (such as a driver's license) and one List C document (such as a Social Security card). If I am under 18 years of age, I will also provide a current school work permit. I understand that my employment is contingent on this verification per federal law.`,
  },
  {
    id: 'direct_deposit',
    title: 'Direct Deposit Authorization',
    description: 'Routing and account info for payroll. Voided check or bank letter accepted.',
    required: true,
    templateBody: `I authorize Makenna Koffee Company to deposit my net pay into the bank account I have designated. I understand that this authorization remains in effect until I notify the company in writing of any change. If funds are deposited in error, I authorize Makenna Koffee to recover the funds via reverse deposit.`,
  },
  {
    id: 'emergency_contact',
    title: 'Emergency Contact',
    description: 'At least one contact and phone number we can reach in an emergency.',
    required: true,
    templateBody: `I have provided current emergency contact information for use by Makenna Koffee in the event of a medical or other emergency during the course of my employment. I will keep this information up to date and notify the company of any changes.`,
  },
  {
    id: 'handbook',
    title: 'Employee Handbook Acknowledgement',
    description: 'Confirms you\'ve read the Makenna Koffee handbook including dress code, scheduling, conduct, and discipline.',
    required: true,
    templateBody: `I acknowledge that I have received, read, and understand the Makenna Koffee Employee Handbook. I agree to comply with the policies and procedures outlined in it, including those covering attendance, scheduling, conduct, dress code, harassment-free workplace, drug and alcohol use, and discipline. I understand that my employment is at-will and that the handbook may be updated from time to time, with current versions provided to me through this portal.`,
  },
  {
    id: 'meal_period_waiver',
    title: 'Meal Period Waiver',
    description: 'California Labor Code §512 requires a 30-minute unpaid meal period for shifts over 5 hours. By mutual consent, this meal period may be waived for shifts of 6 hours or less.',
    required: true,
    templateBody: `CALIFORNIA MEAL PERIOD WAIVER — Labor Code §512 / IWC Wage Order No. 5

By signing below, I voluntarily and knowingly waive my right to a first off-duty meal period on any workday on which my total daily work period is no more than six (6) hours, pursuant to California Labor Code §512(a) and applicable IWC Wage Order No. 5.

I understand and agree to the following:

1. RIGHT TO MEAL PERIOD. California law entitles me to an uninterrupted, off-duty, 30-minute meal period when I work more than five (5) hours in a day.

2. WAIVER CONDITIONS. This waiver applies only on shifts where my total work period does not exceed six (6) hours. On any shift exceeding six (6) hours, I am entitled to a full 30-minute meal period and this waiver does not apply.

3. SECOND MEAL PERIOD. If I work more than ten (10) hours in a day, I am entitled to a second 30-minute meal period. That second meal period may be waived by mutual consent only if my total hours do not exceed twelve (12) AND I did not waive the first meal period. A separate written agreement is required for any second meal period waiver.

4. VOLUNTARY & REVOCABLE. This waiver is entirely voluntary. I may revoke it at any time by providing written notice to my Store Manager. Revocation does not affect my continued employment.

5. NO RETALIATION. I understand that Makenna Koffee will not retaliate against me for exercising my right to a meal period or for revoking this waiver.

This waiver is entered into by mutual consent of employee and employer.`,
  },
  {
    id: 'food_handler_attestation',
    title: 'Food Handler Certification (ServSafe)',
    description: 'Complete the ServSafe California Food Handler course on your first day using the in-store tablet. Makenna covers the fee and is paid training. The card is valid within 30 days of hire and is good for 3 years — renew before it expires.',
    required: true,
    templateBody: `I acknowledge that California Health and Safety Code §113948 requires me to obtain a California Food Handler card within 30 days of my date of hire. I will complete the ServSafe California Food Handler course (https://www.servsafe.com/access/SS/Catalog/ProductDetail/SSECT6CA) on Day 1 of my employment using the in-store tablet, with the $11.99 course fee paid by Makenna Koffee on the store's credit card. I understand that course time is paid (approximately 1 hour). I will provide a copy of my Food Handler card to my Store Manager for retention in my employee file, and I will renew the card prior to its 3-year expiration. I understand that maintaining a valid card is a condition of my continued employment.`,
  },
  {
    id: 'harassment_attestation',
    title: 'Harassment Prevention Training',
    description: 'California SB 1343 requires all team members to complete harassment prevention training within 6 months of hire — 1 hour for crew, 2 hours for supervisors. Complete the free state-provided course at calcivilrights.ca.gov/shpt, screenshot your completion screen, and upload it here before signing.',
    required: true,
    templateBody: `I acknowledge the obligation under California SB 1343 to complete harassment prevention training within 6 months of my date of hire (1 hour for non-supervisory employees, 2 hours for supervisors), and to repeat the training every 2 years. I have completed the California Civil Rights Department's free online Harassment Prevention Training (https://calcivilrights.ca.gov/shpt/) and have uploaded my completion screenshot for retention. I understand that this training must be repeated every 2 years.`,
  },
  {
    id: 'nda',
    title: 'Confidentiality & IP Agreement',
    description: 'Standard NDA covering customer data, recipes, and proprietary information.',
    required: false,
    templateBody: `In exchange for my employment with Makenna Koffee, I agree not to disclose, during or after my employment, any confidential information of the company, including but not limited to: customer data, financial information, drink recipes, training materials, vendor relationships, and operational procedures. I further agree that any work product I create in the scope of my employment is the property of Makenna Koffee Company.`,
  },
];

/**
 * Work permit document — NOT included in the default onboarding packet.
 * Dynamically injected by the onboarding page when the I-9 date of birth
 * reveals the employee is under 18.
 */
export const WORK_PERMIT_DOC: {
  id: OnboardingDocId;
  title: string;
  description: string;
  required: boolean;
  templateBody: string;
} = {
  id: 'work_permit',
  title: 'California Work Permit',
  description: 'California law requires all employees under 18 to have a valid work permit (CDE Form B1-4) issued by their school district. Present your current permit on Day 1. Permits expire at the end of each school year and must be renewed.',
  required: true,
  templateBody: `CALIFORNIA MINOR WORK PERMIT — Manager Attestation

I, the undersigned manager/authorized employer representative of Makenna Koffee Company, attest that:

1. PERMIT INSPECTED. I have physically inspected the California Work Permit (CDE Form B1-4) presented by this minor employee and verified that it is current, valid, and authorizes employment at this establishment.

2. PHOTO ON FILE. I have photographed the permit and uploaded it to this portal for retention in the employee's file.

3. WORK HOUR COMPLIANCE. I understand that California law (Education Code §49112) restricts the hours a minor may work based on their age, school enrollment status, and whether school is in session. I will schedule this employee in compliance with these restrictions at all times.

4. PERMIT RENEWAL. I understand that work permits typically expire at the end of the school year. I will ensure the employee provides a renewed permit before their current permit expires, and will suspend their schedule if a valid permit is not on file.

5. PERMIT REVOCATION. If the school revokes this employee's work permit, I understand that Makenna Koffee is required by law to immediately cease their employment until a new valid permit is obtained.

By signing below, I confirm that I have reviewed the physical work permit and that all information uploaded is accurate.`,
};

export function freshPacket(employeeId: string, startDate: string, trainerId?: string): OnboardingPacket {
  return {
    employeeId,
    startDate,
    trainerEmployeeId: trainerId,
    tasks: ONBOARDING_DOCS.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      required: d.required,
      signed: false,
    })),
  };
}

export const PACKETS: Record<string, OnboardingPacket> = {
  'emp-005': {
    employeeId: 'emp-005',
    startDate: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    trainerEmployeeId: 'emp-003',
    tasks: ONBOARDING_DOCS.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      required: d.required,
      signed: ['w4', 'direct_deposit', 'emergency_contact'].includes(d.id),
      signedAt: ['w4', 'direct_deposit', 'emergency_contact'].includes(d.id)
        ? new Date(Date.now() - 4 * 86400000).toISOString()
        : undefined,
      signedByName: ['w4', 'direct_deposit', 'emergency_contact'].includes(d.id)
        ? 'Diego Ramirez'
        : undefined,
    })),
  },
  'emp-006': {
    employeeId: 'emp-006',
    startDate: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10),
    trainerEmployeeId: 'emp-003',
    tasks: ONBOARDING_DOCS.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      required: d.required,
      signed: d.id !== 'nda' && d.id !== 'harassment_attestation',
      signedAt:
        d.id !== 'nda' && d.id !== 'harassment_attestation'
          ? new Date(Date.now() - 11 * 86400000).toISOString()
          : undefined,
      signedByName:
        d.id !== 'nda' && d.id !== 'harassment_attestation' ? 'Ava Nguyen' : undefined,
    })),
    managerSignOff: undefined,
  },
};

export function getDocTemplate(id: OnboardingDocId) {
  return ONBOARDING_DOCS.find((d) => d.id === id);
}
