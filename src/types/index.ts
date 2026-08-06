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
  | 'coffee-truck'
  | 'balboa'
  | 'reseda';

export type Location = {
  id: LocationId;
  name: string;
  city: string;
  manager?: string; // employee id
  /** Store PIN code (e.g. alarm/POS access code). */
  pin?: string;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  /** Primary / home location */
  homeLocationId: LocationId;
  /** Additional locations this employee works at (e.g. cross-trained, floater) */
  additionalLocationIds?: LocationId[];
  hiredOn: string; // ISO
  birthday?: string; // MM-DD
  certifications: Certification[];
  trainingProgressByStation: Record<string, StationProgress>;
  avatarColor: string; // hex for initial avatar
  active: boolean;
  /** Photos / scans uploaded to this employee's file (IDs, notes, etc.). */
  attachments?: EmployeeAttachment[];
  /** UUID token for the read-only "view my file" share link. Generated on demand by a manager. */
  shareToken?: string;
  /** Soft-delete audit trail — set when an admin removes the employee */
  deactivatedAt?: string;
  deactivatedById?: string;
  deactivatedByName?: string;
  deactivationReason?: string;
};

export type EmployeeAttachment = {
  id: string;
  name: string;
  /** Compressed JPEG/PNG as a data URL. */
  dataUrl: string;
  uploadedAt: string; // ISO
  uploadedBy: string; // employee id of uploader
  /** Optional link to an onboarding document this file represents (e.g. a
   *  photo of a signed W-4 or work permit), or 'other' for general files. */
  category?: OnboardingDocId | 'other';
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
  | 'meal_period_waiver'
  | 'work_permit'
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
  /** Compressed screenshot data URL for external training completions (e.g. SHPT). */
  completionProofDataUrl?: string;
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
  /**
   * If set, this skill is completed by signing the corresponding onboarding document.
   * Value maps to an onboarding task id (e.g. 'w4', 'i9').
   * The training page auto-checks this skill when the onboarding doc is signed,
   * and shows a "Go to Onboarding" button when it isn't.
   */
  onboardingDocId?: string;
  /**
   * Reference images from the Brain Blend document shown inline on the skill card.
   * Paths are relative to /public (e.g. '/training/bean-bags.jpg').
   * Each entry has a src and an optional caption.
   */
  images?: { src: string; caption?: string }[];
  /**
   * If set, clicking the skill opens an End-of-Day quiz modal instead of a plain checkbox.
   * The skill is marked complete only when the trainee reaches the passing score.
   */
  quiz?: {
    questions: string[];
    /**
     * Answer key shown to the trainer after each question is marked.
     * Parallel array to `questions` — index i is the expected answer for question i.
     */
    answers?: string[];
    /** Minimum correct answers needed to pass */
    passingScore: number;
  };
  /**
   * YouTube embed URL (use https://www.youtube.com/embed/VIDEO_ID format).
   * Renders an inline video player on the skill card.
   */
  videoUrl?: string;
  /**
   * Array of image URLs to display on the skill card as visual reference.
   */
  imageUrls?: string[];
  /**
   * If true, competencyCriteria render as interactive checkboxes (session-only).
   * Use for policy walkthroughs where the trainer ticks each point as they cover it.
   */
  criteriaChecklist?: boolean;
  /**
   * Trainer-only notes, parallel array to competencyCriteria. Explains what
   * each item is testing for. Never shown to the trainee — only rendered for
   * trainer/manager/admin roles.
   */
  trainerNotes?: string[];
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

// Recipe Fill-In Test
export type RecipeFillBlankType = 'quantity' | 'syrup' | 'sauce' | 'powder' | 'cream' | 'drizzle' | 'topping' | 'fill_oz';

export type RecipeFillBlank = {
  index: number;
  type: RecipeFillBlankType;
  correct: string;
};

export type RecipeFillQuestion = {
  id: string;
  drink: string;
  size: string;
  template: string;
  blanks: RecipeFillBlank[];
};

export type RecipeFillAnswers = Record<string, string>; // key: `${questionId}-${blankIndex}`

export type RecipeFillAttempt = {
  id: string;
  employeeId: string;
  startedAt: string;
  completedAt?: string;
  questionOrder: string[];
  answers: RecipeFillAnswers;
  score?: number;
  passed?: boolean;
};

// Accountability & HR Records
export type AccountabilityType = 'write_up' | 'verbal_warning' | 'final_warning' | 'suspension' | 'termination' | 'resignation' | 'pip';

export const ACCOUNTABILITY_LABELS: Record<AccountabilityType, string> = {
  write_up: 'Written Warning',
  verbal_warning: 'Verbal Warning',
  final_warning: 'Final Warning',
  suspension: 'Suspension',
  termination: 'Termination',
  resignation: 'Resignation',
  pip: 'Performance Improvement Plan',
};

export const ACCOUNTABILITY_COLORS: Record<AccountabilityType, string> = {
  write_up: 'bg-amber-100 text-amber-700',
  verbal_warning: 'bg-yellow-100 text-yellow-700',
  final_warning: 'bg-orange-100 text-orange-700',
  suspension: 'bg-red-100 text-red-700',
  termination: 'bg-red-200 text-red-800',
  resignation: 'bg-ink-100 text-ink-600',
  pip: 'bg-blue-100 text-blue-700',
};

export type AccountabilityRecord = {
  id: string;
  employeeId: string;
  type: AccountabilityType;
  issuedAt: string; // ISO date
  issuedByEmployeeId: string;
  issuedByName: string;
  locationId: string;
  title: string;
  description: string;
  /** Structured template field values filled in at creation time */
  templateData?: Record<string, unknown>;
  /** Employee's acknowledgment — captured when they read it in the portal */
  employeeAcknowledgedAt?: string;
  /** true = employee agrees, false = employee disagrees */
  employeeAgreed?: boolean;
  /** Optional rebuttal written by the employee */
  employeeResponse?: string;
  /** When the employee submitted their agree/disagree response */
  employeeRespondedAt?: string;
  /** Attachments / notes added later */
  followUpNotes?: string;
  /** For termination/resignation: last day */
  separationDate?: string;
};

export const RECIPE_FILL_PASSING_SCORE = 95;

// ---------------------------------------------------------------------------
// Training handoff notes
// ---------------------------------------------------------------------------

export type TrainingNote = {
  id: string;
  employeeId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};
