import { OnboardingPacket, OnboardingDocId } from '@/types';

/**
 * Onboarding documents.
 *
 * `templateBody` is the canonical text the signer agrees to. The audit
 * trail SHA-256-hashes title + templateBody so any future edit produces a
 * different hash, and you can prove which version was signed.
 */
export const ONBOARDING_DOCS: {
  id: OnboardingDocId;
  title: string;
  description: string;
  required: boolean;
  templateBody: string;
}[] = [
  {
    id: 'direct_deposit',
    title: 'Direct Deposit Authorization',
    description: 'Routing and account info for payroll. Voided check or bank letter accepted.',
    required: false,
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
    description: 'Signed in person — not via this app. Manager provides a physical copy on Day 1. Once the signed copy is returned, sign below to record acknowledgement in the portal.',
    required: true,
    templateBody: `I acknowledge that I have received, read, and understand the Makenna Koffee Employee Handbook. I agree to comply with the policies and procedures outlined in it, including those covering attendance, scheduling, conduct, dress code, harassment-free workplace, drug and alcohol use, and discipline. I understand that my employment is at-will and that the handbook may be updated from time to time, with current versions provided to me through this portal.`,
  },
  {
    id: 'meal_period_waiver',
    title: 'Meal Period Waiver',
    description: 'California Labor Code §512 requires a 30-minute unpaid meal period for shifts over 5 hours. By mutual consent, this meal period may be waived for shifts of 6 hours or less.',
    required: false,
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

export const PACKETS: Record<string, OnboardingPacket> = {};

export function getDocTemplate(id: OnboardingDocId) {
  return ONBOARDING_DOCS.find((d) => d.id === id);
}
