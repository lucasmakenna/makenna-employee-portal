---
name: no-new-localstorage
description: This app is live with real users — don't add new localStorage-only state without explicit approval.
---

# No new localStorage without explicit approval

The Makenna Koffee Employee Portal is **live** — real employees, real data,
real Supabase backend. It is no longer a prototype.

`src/data/store.ts` has existing hooks (`useEmployees`, `useCandidates`,
`usePackets`, etc.) that are localStorage-first with a Supabase sync layer.
That existing pattern can stay as-is for now.

But going forward:

- **Do not introduce new localStorage-only state** for anything that
  represents real business data (employee info, onboarding docs, training
  progress, attachments, messages, schedules, etc.).
- Default to **Supabase** (via `syncToDb` / direct table reads) as the
  source of truth for any new feature or field.
- If something genuinely belongs in localStorage (e.g. pure UI state like
  "is this sidebar collapsed", a draft the user hasn't submitted yet, or a
  client-side cache of remote data), that's fine — but call it out
  explicitly and explain why it doesn't need to sync.
- If you think localStorage is the right call for something that *does*
  look like business data, **ask Lucas first** rather than defaulting to
  the old pattern. He may say yes — but it should be a conscious choice now,
  not a holdover from the prototype era.

This guards against repeats of issues like stale cached employee records
(e.g. retired demo employees `emp-001`/`emp-002`/`emp-009` lingering in
`mk-employees-v1` across devices) and silent sync failures that only show up
much later.
