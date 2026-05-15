// Core domain types for the Employee Platform.
// In production these are mirrored on a shared backend (Postgres + Prisma
// recommended). Until then, both web and mobile use the seed in @/data.

/**
 * Role hierarchy for Makenna Koffee, top → bottom of the org chart.
 *
 * - admin    — owners / HQ. Full access across all 9 locations.
 * - manager  — store manager. Runs hiring, scheduling, accountability for one store.
 * - lead     — shift lead. Runs the floor on shift, opens/closes, light approvals.
 * - trainer  — certified to sign off on training stations & onboard new hires.
 * - barista  — frontline staff. May be in-training or fully signed off.
 *
 * Anyone can be "in training" — that's a derived state from
 * trainingProgressByStation, not a role. Use isInTraining(employee) to check.
 */
export type Role = 'admin' | 'manager' | 'lead' | 'trainer' | 'barista';

export const ROLES: Role[] = ['admin', 'manager', 'lead', 'trainer', 'barista'];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  manager: 'Manager',
  lead: 'Shift Lead',
  trainer: 'Trainer',
  barista: 'Barista',
};

export type LocationId =
  | 'simi-valley'
  | 'ventura'
  | 'camarillo'
  | 'valencia'
  | 'orange'
  | 'westlake'
  | 'santa-monica'
  | 'beach-house'
  | 'coffee-truck';

export type Location = {
  id: LocationId;
  name: string;
  city: string;
  manager?: string; // employee id
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  homeLocationId: LocationId;
  hiredOn: string; // ISO
  birthday?: string; // MM-DD
  certifications: Certification[];
  trainingProgressByStation: Record<string, StationProgress>;
  avatarColor: string; // hex for initial avatar
  active: boolean;
};

export type Certification = {
  id: string;
  name: 'Food Handler' | 'Harassment Prevention' | 'Allergen Awareness';
  issuedOn: string;
  expiresOn: string;
  fileUrl?: string;
};

export type StationProgress = {
  stationId: string;
  skillsCompleted: string[]; // skill ids
  signedOffBy?: string; // trainer employee id
  signedOffAt?: string; // ISO
};

// ---------------------------------------------------------------------------
// Hiring pipeline
// ---------------------------------------------------------------------------

export type CandidateStage =
  | 'applied'
  | 'phone_screen'
  | 'in_person'
  | 'offer'
  | 'hired'
  | 'rejected';

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedFor: 'Barista' | 'Shift Lead' | 'Manager';
  appliedToLocationId: LocationId;
  appliedOn: string;
  stage: CandidateStage;
  notes: CandidateNote[];
  resumeUrl?: string;
  source: 'Indeed' | 'Walk-in' | 'Referral' | 'Instagram' | 'Other';
};

export type CandidateNote = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

export type OnboardingDocId =
  | 'w4'
  | 'i9'
  | 'nda'
  | 'handbook'
  | 'food_handler_attestation'
  | 'harassment_attestation'
  | 'direct_deposit'
  | 'emergency_contact';

export type OnboardingTask = {
  id: OnboardingDocId;
  title: string;
  description: string;
  required: boolean;
  signed: boolean;
  signedAt?: string;
  signedByName?: string;
  /** Audit record id if signed. Lookup in @/data/signatures. */
  signatureRecordId?: string;
  /** Filled form data for W-4 and I-9. */
  formData?: Record<string, unknown>;
  /** Supabase Storage URL for the generated filled PDF. */
  pdfStorageUrl?: string;
};

// ---------------------------------------------------------------------------
// E-signature audit trail (ESIGN Act / CA UETA)
// ---------------------------------------------------------------------------

export type SignatureContext =
  | { kind: 'onboarding'; employeeId: string; docId: OnboardingDocId }
  | { kind: 'training_skill'; employeeId: string; stationId: string; skillId: string }
  | { kind: 'training_station'; employeeId: string; stationId: string }
  | { kind: 'manager_signoff'; employeeId: string };

export type ClientFingerprint = {
  userAgent: string;
  language: string;
  timezone: string;
  screenSize: string;
  viewport: string;
};

export type GeoCoordinate = {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
};

export type SignatureAuditRecord = {
  id: string;
  /** What was signed and on whose behalf. */
  context: SignatureContext;
  /** Who signed. */
  signerEmployeeId: string;
  signerLegalName: string;
  /** Server-stamped time in production; client-stamped in sandbox. */
  signedAtIso: string;
  serverStamped: boolean;
  /** Where the signer was. */
  ipAddress?: string;
  geo?: GeoCoordinate;
  fingerprint: ClientFingerprint;
  /** SHA-256 of the canonical rendered document at signing time. */
  documentHash: string;
  /** Title + length so the audit cert can show what was signed even if the
   *  template later changes. */
  documentTitle: string;
  documentBytes: number;
  /** PNG data-URL of the hand-drawn signature. */
  signatureImagePngDataUrl: string;
  /** Did the user check the ESIGN consent box this session? */
  consentAcknowledged: boolean;
  /** Hash chain: each new record references the prior record's id+hash so the
   *  log is tamper-evident. Prior record is `null` if first signature. */
  priorRecordId: string | null;
  priorRecordHash: string | null;
};

export type ESIGNConsent = {
  employeeId: string;
  consentedAtIso: string;
  fingerprint: ClientFingerprint;
  ipAddress?: string;
};

export type OnboardingPacket = {
  employeeId: string;
  startDate: string;
  trainerEmployeeId?: string;
  tasks: OnboardingTask[];
  managerSignOff?: { byId: string; byName: string; at: string };
};

// ---------------------------------------------------------------------------
// Training
// ---------------------------------------------------------------------------

export type TrainingStation = {
  id: string;
  name: string;
  description: string;
  order: number;
  skills: TrainingSkill[];
  contentVersion: number;
  updatedAt: string;
};

export type TrainingSkill = {
  id: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  steps?: string[];
  competencyCriteria: string[];
  /**
   * If set, a "View Document" button appears on the skill card.
   * Value maps to a key in TRAINING_DOCUMENT_TEMPLATES.
   * Signing the document automatically marks the skill complete.
   */
  documentId?: string;
};

export type TrainingSignoff = {
  employeeId: string;
  stationId: string;
  skillId: string;
  trainerId: string;
  trainerName: string;
  signedAt: string;
  notes?: string;
};

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export type ConversationType =
  | 'location_channel' // everyone at one store
  | 'all_hands'        // org-wide
  | 'dm'               // direct message between two employees
  | 'shift_cover';     // "can someone cover my shift?"

export type Conversation = {
  id: string;
  type: ConversationType;
  name: string;
  /** For location_channel: the store id. */
  locationId?: LocationId;
  /** Who can see/post in this conversation. Empty for location_channel/all_hands
   *  (everyone at the location / everyone). For DMs and shift_cover, the explicit list. */
  participantIds: string[];
  /** Shift cover requests: link to the shift being offered. */
  shiftDate?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  shiftLocationId?: LocationId;
  shiftCovered?: boolean;
  shiftCoveredById?: string;
  /** Audit. */
  createdBy: string;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  /** Marked as a formal announcement (manager/admin posts get bigger styling). */
  announcement?: boolean;
  pinned?: boolean;
  /** Employees who have opened the conversation since this message. */
  readBy: string[];
};

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** A 4-hour block of the day. Morning is roughly the AM rush; midday the
 *  lunch lull; afternoon the school-out window; evening for late hours. */
export type TimeBlock = 'morning' | 'midday' | 'afternoon' | 'evening';

export type AvailabilityStatus =
  | 'available'   // can work this slot
  | 'preferred'   // wants to work this slot
  | 'unavailable'; // can't work

export type Availability = {
  employeeId: string;
  /** day -> block -> status. Missing entries default to 'available'. */
  weekly: Partial<Record<DayOfWeek, Partial<Record<TimeBlock, AvailabilityStatus>>>>;
  preferredMinHours: number;
  preferredMaxHours: number;
  notes?: string;
  updatedAt: string;
};

export type TimeOffRequest = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Recipes Test
// ---------------------------------------------------------------------------

export type RecipesTestAnswer = 'a' | 'b' | 'c' | 'd';

export type RecipesTestQuestion = {
  id: string;
  question: string;
  options: Record<RecipesTestAnswer, string>;
  correct_answer: RecipesTestAnswer;
  drink: string;
  size: string;
};

export type RecipesTestAttempt = {
  id: string;
  employeeId: string;
  startedAt: string;
  completedAt?: string;
  questionOrder: string[];
  answers: Record<string, RecipesTestAnswer>;
  score?: number;
  passed?: boolean;
};

export const RECIPES_TEST_PASSING_SCORE = 90;
