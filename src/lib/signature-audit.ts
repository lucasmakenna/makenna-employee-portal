'use client';

/**
 * In-house e-signature audit trail.
 *
 * ESIGN Act / California UETA require, for a signature to have the same legal
 * weight as a wet-ink signature, that we capture and retain:
 *
 *   1. INTENT to sign — the user actively performed the signature gesture
 *      (drew on a pad, clicked "Sign & save"), not auto-applied.
 *   2. CONSENT to do business electronically — captured once via captureConsent().
 *   3. ASSOCIATION — the signature is bound to the document hash, not floating.
 *   4. RETENTION — every record is kept in an append-only log
 *      (data/signatures.ts).
 *
 * The audit trail also captures contextual metadata that matters in litigation:
 *   - Server-stamped timestamp (sandbox here uses client clock; production
 *     posts to backend which stamps with its own clock).
 *   - IP address (production reads from req.headers; sandbox leaves blank).
 *   - User-agent / browser fingerprint.
 *   - Optional geolocation (best-effort, requires user permission).
 *   - SHA-256 hash of the canonical rendered document text.
 *   - Hash chain: each record references the prior record's id and hash, so
 *     tampering with any single record breaks every record after it.
 */

import type {
  ClientFingerprint,
  GeoCoordinate,
  SignatureAuditRecord,
  SignatureContext,
  ESIGNConsent,
} from '@/types';

// ---------------------------------------------------------------------------
// SHA-256 hashing via Web Crypto (no deps)
// ---------------------------------------------------------------------------

export async function sha256Hex(text: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return 'sha256-unavailable';
  }
  const data = new TextEncoder().encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Hash a record (without its own .id) for the chain. */
export async function hashRecord(
  record: Omit<SignatureAuditRecord, 'priorRecordId' | 'priorRecordHash' | 'id'>,
): Promise<string> {
  const canonical = JSON.stringify(record, Object.keys(record).sort());
  return sha256Hex(canonical);
}

// ---------------------------------------------------------------------------
// Client fingerprint
// ---------------------------------------------------------------------------

export function getClientFingerprint(): ClientFingerprint {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'server',
      language: 'en-US',
      timezone: 'UTC',
      screenSize: '0x0',
      viewport: '0x0',
    };
  }
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
}

// ---------------------------------------------------------------------------
// Geolocation (best-effort, optional)
// ---------------------------------------------------------------------------

export function tryGetGeolocation(): Promise<GeoCoordinate | undefined> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(undefined);
      return;
    }
    const timer = setTimeout(() => resolve(undefined), 4000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracyMeters: pos.coords.accuracy,
        });
      },
      () => {
        clearTimeout(timer);
        resolve(undefined);
      },
      { maximumAge: 60_000, timeout: 4000 },
    );
  });
}

// ---------------------------------------------------------------------------
// Stamping
// ---------------------------------------------------------------------------

export type StampParams = {
  context: SignatureContext;
  signerEmployeeId: string;
  signerLegalName: string;
  documentTitle: string;
  documentBody: string; // The exact rendered text the signer agreed to
  signatureImagePngDataUrl: string;
  consentAcknowledged: boolean;
  priorRecord: Pick<SignatureAuditRecord, 'id'> & { hashOfRecord: string } | null;
  /** Set if your component fetched geo before calling stamp. */
  geo?: GeoCoordinate;
};

/**
 * Generates a complete, signable audit record.
 *
 * In production this method body becomes a single fetch to your backend:
 *   const res = await fetch('/api/signatures', { method: 'POST', body: ... })
 *   return res.json();
 * The backend then:
 *   - reads `req.headers['x-forwarded-for']` for the real IP
 *   - stamps `signedAtIso` with its own clock (NTP-synced)
 *   - sets `serverStamped = true`
 *   - writes the record to an append-only Postgres table with a unique
 *     constraint on `priorRecordHash`, making the chain enforced at the DB
 *   - returns the saved record
 *
 * For now we run client-side and clearly mark serverStamped as false.
 */
export async function stampSignature(p: StampParams): Promise<SignatureAuditRecord> {
  const fingerprint = getClientFingerprint();
  const documentHash = await sha256Hex(`${p.documentTitle}\n\n${p.documentBody}`);

  const provisional: Omit<SignatureAuditRecord, 'priorRecordId' | 'priorRecordHash' | 'id'> = {
    context: p.context,
    signerEmployeeId: p.signerEmployeeId,
    signerLegalName: p.signerLegalName,
    signedAtIso: new Date().toISOString(),
    serverStamped: false,            // ← real backend flips to true
    ipAddress: undefined,            // ← real backend fills from req
    geo: p.geo,
    fingerprint,
    documentHash,
    documentTitle: p.documentTitle,
    documentBytes: new TextEncoder().encode(p.documentBody).length,
    signatureImagePngDataUrl: p.signatureImagePngDataUrl,
    consentAcknowledged: p.consentAcknowledged,
  };

  const recordId = `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: recordId,
    ...provisional,
    priorRecordId: p.priorRecord?.id ?? null,
    priorRecordHash: p.priorRecord?.hashOfRecord ?? null,
  };
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

const CONSENT_KEY = 'makenna-esign-consent';

export function hasConsented(employeeId: string): boolean {
  if (typeof window === 'undefined') return false;
  const raw = window.localStorage.getItem(`${CONSENT_KEY}:${employeeId}`);
  return !!raw;
}

export function captureConsent(employeeId: string): ESIGNConsent {
  const consent: ESIGNConsent = {
    employeeId,
    consentedAtIso: new Date().toISOString(),
    fingerprint: getClientFingerprint(),
  };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(`${CONSENT_KEY}:${employeeId}`, JSON.stringify(consent));
  }
  return consent;
}

export function getConsent(employeeId: string): ESIGNConsent | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(`${CONSENT_KEY}:${employeeId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ESIGNConsent;
  } catch {
    return null;
  }
}
