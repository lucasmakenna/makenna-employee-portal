/**
 * Capability matrix — what each role can do.
 *
 * ============================================================================
 *   EDIT THIS FILE TO DEFINE FEATURES PER ROLE.
 * ============================================================================
 *
 * Pattern: every gated action has a capability key here. Components ask
 * `can(user.role, 'capability:key')` instead of hardcoding role checks.
 *
 * To grant a capability to a role, set its column to `true`. To revoke, false.
 * If a row is missing for a role, default is `false` (deny).
 *
 * Add new capabilities by adding a key to the CAPABILITIES list and a row
 * to the MATRIX. Components then call `can(role, 'your_new_key')`.
 */

import type { Role } from '@/types';

export type Capability =
  // Hiring
  | 'hiring.view_pipeline'
  | 'hiring.create_candidate'
  | 'hiring.move_stage'
  | 'hiring.hire'
  | 'hiring.reject'

  // Onboarding
  | 'onboarding.view'
  | 'onboarding.review_documents'
  | 'onboarding.manager_signoff'

  // Training — being trained
  | 'training.mark_own_progress'
  // Training — training others
  | 'training.signoff_skills'
  | 'training.signoff_station'
  | 'training.edit_curriculum'
  | 'training.view_all_trainees'

  // Schedule (Phase 2 hooks — we expose them now so we can gate UI)
  | 'schedule.view_own'
  | 'schedule.view_team'
  | 'schedule.publish'
  | 'schedule.approve_swaps'
  | 'schedule.pickup_open_shifts'

  // Clock in/out
  | 'clock.self_clock'
  | 'clock.clock_others_exception'
  | 'clock.edit_timecards'

  // People
  | 'team.view_directory'
  | 'team.view_pay'
  | 'team.discipline'
  | 'team.terminate'

  // Operations / store
  | 'ops.cash_drop'
  | 'ops.deposit_log'
  | 'ops.line_check'
  | 'ops.deep_clean_signoff'

  // Comms
  | 'comms.post_announcement'
  | 'comms.pin_announcement'
  | 'comms.message_team'

  // Admin
  | 'admin.manage_locations'
  | 'admin.manage_users'
  | 'admin.platform_settings';

type Matrix = Record<Capability, Partial<Record<Role, boolean>>>;

/**
 * Default capability matrix. These are sensible defaults — adjust as you need.
 *
 * NOTE FROM LUCAS: Update these to match how Makenna actually delegates work.
 * Common edits:
 *   - Should leads be able to publish schedules? (default: false)
 *   - Should trainers be able to do hire/reject? (default: hire only via manager)
 *   - Should managers see pay info, or only admin? (default: managers see scheduled hours, admin sees pay)
 */
export const MATRIX: Matrix = {
  // ──── Hiring ───────────────────────────────────────────────
  'hiring.view_pipeline':       { admin: true, manager: true, lead: true,  trainer: true,  barista: false },
  'hiring.create_candidate':    { admin: true, manager: true, lead: true,  trainer: false, barista: false },
  'hiring.move_stage':          { admin: true, manager: true, lead: false, trainer: false, barista: false },
  'hiring.hire':                { admin: true, manager: true, lead: false, trainer: false, barista: false },
  'hiring.reject':              { admin: true, manager: true, lead: false, trainer: false, barista: false },

  // ──── Onboarding ───────────────────────────────────────────
  'onboarding.view':            { admin: true, manager: true, lead: true,  trainer: true,  barista: false },
  'onboarding.review_documents':{ admin: true, manager: true, lead: false, trainer: true,  barista: false },
  'onboarding.manager_signoff': { admin: true, manager: true, lead: false, trainer: false, barista: false },

  // ──── Training ─────────────────────────────────────────────
  'training.mark_own_progress':     { admin: true, manager: true, lead: true,  trainer: true,  barista: true  },
  'training.signoff_skills':        { admin: true, manager: true, lead: true,  trainer: true,  barista: false },
  'training.signoff_station':       { admin: true, manager: true, lead: false, trainer: true,  barista: false },
  'training.edit_curriculum':       { admin: true, manager: true, lead: false, trainer: false, barista: false },
  'training.view_all_trainees':     { admin: true, manager: true, lead: true,  trainer: true,  barista: false },

  // ──── Schedule (Phase 2 hooks) ─────────────────────────────
  'schedule.view_own':              { admin: true, manager: true, lead: true,  trainer: true,  barista: true  },
  'schedule.view_team':             { admin: true, manager: true, lead: true,  trainer: false, barista: false },
  'schedule.publish':               { admin: true, manager: true, lead: false, trainer: false, barista: false },
  'schedule.approve_swaps':         { admin: true, manager: true, lead: true,  trainer: false, barista: false },
  'schedule.pickup_open_shifts':    { admin: true, manager: true, lead: true,  trainer: true,  barista: true  },

  // ──── Clock ────────────────────────────────────────────────
  'clock.self_clock':               { admin: true, manager: true, lead: true,  trainer: true,  barista: true  },
  'clock.clock_others_exception':   { admin: true, manager: true, lead: true,  trainer: false, barista: false },
  'clock.edit_timecards':           { admin: true, manager: true, lead: false, trainer: false, barista: false },

  // ──── People ───────────────────────────────────────────────
  'team.view_directory':            { admin: true, manager: true, lead: true,  trainer: true,  barista: true  },
  'team.view_pay':                  { admin: true, manager: false,lead: false, trainer: false, barista: false },
  'team.discipline':                { admin: true, manager: true, lead: false, trainer: false, barista: false },
  'team.terminate':                 { admin: true, manager: true, lead: false, trainer: false, barista: false },

  // ──── Operations ───────────────────────────────────────────
  'ops.cash_drop':                  { admin: true, manager: true, lead: true,  trainer: false, barista: false },
  'ops.deposit_log':                { admin: true, manager: true, lead: true,  trainer: false, barista: false },
  'ops.line_check':                 { admin: true, manager: true, lead: true,  trainer: true,  barista: true  },
  'ops.deep_clean_signoff':         { admin: true, manager: true, lead: true,  trainer: false, barista: false },

  // ──── Comms ────────────────────────────────────────────────
  'comms.post_announcement':        { admin: true, manager: true, lead: true,  trainer: false, barista: false },
  'comms.pin_announcement':         { admin: true, manager: true, lead: false, trainer: false, barista: false },
  'comms.message_team':             { admin: true, manager: true, lead: true,  trainer: true,  barista: false },

  // ──── Admin ────────────────────────────────────────────────
  'admin.manage_locations':         { admin: true, manager: false,lead: false, trainer: false, barista: false },
  'admin.manage_users':             { admin: true, manager: false,lead: false, trainer: false, barista: false },
  'admin.platform_settings':        { admin: true, manager: false,lead: false, trainer: false, barista: false },
};

/** Returns true if the role has the given capability. */
export function can(role: Role | undefined, cap: Capability): boolean {
  if (!role) return false;
  return MATRIX[cap]?.[role] === true;
}

/**
 * Convenience: returns the list of capabilities granted to a role.
 * Useful when rendering a "what can this role do" debug screen.
 */
export function capabilitiesFor(role: Role): Capability[] {
  return (Object.keys(MATRIX) as Capability[]).filter((c) => can(role, c));
}
