'use client';

/**
 * Append-only signature log.
 *
 * In production this is a Postgres table with INSERT-only permissions. The
 * UI never deletes or mutates a record. Tampering is detected because each
 * record references the prior record's id and hash — change any record and
 * every record after it has an invalid chain.
 *
 * localStorage is the primary store; Supabase is synced fire-and-forget so
 * signatures survive across devices and reloads.
 */

import type { SignatureAuditRecord } from '@/types';
import { hashRecord } from '@/lib/signature-audit';
import { supabase } from '@/lib/supabase';

const LOG_KEY = 'makenna-signature-log';

function readAll(): SignatureAuditRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(LOG_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SignatureAuditRecord[];
  } catch {
    return [];
  }
}

function writeAll(records: SignatureAuditRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOG_KEY, JSON.stringify(records));
}

export function appendSignature(record: SignatureAuditRecord) {
  const all = readAll();
  all.push(record);
  writeAll(all);
  // Fire-and-forget sync to Supabase
  supabase.from('signature_audit_records').insert({
    id: record.id,
    context: record.context,
    signer_employee_id: record.signerEmployeeId,
    signer_legal_name: record.signerLegalName,
    signed_at_iso: record.signedAtIso,
    server_stamped: record.serverStamped,
    ip_address: record.ipAddress ?? null,
    fingerprint: record.fingerprint,
    document_hash: record.documentHash,
    document_title: record.documentTitle,
    document_bytes: record.documentBytes,
    signature_image_png: record.signatureImagePngDataUrl,
    consent_acknowledged: record.consentAcknowledged,
    prior_record_id: record.priorRecordId,
    prior_record_hash: record.priorRecordHash,
  }).then(() => {});
}

export function getAllSignatures(): SignatureAuditRecord[] {
  return readAll();
}

export function getSignatureById(id: string): SignatureAuditRecord | undefined {
  return readAll().find((r) => r.id === id);
}

export function getSignaturesForEmployee(employeeId: string): SignatureAuditRecord[] {
  return readAll().filter((r) => {
    const c = r.context as any;
    return c.employeeId === employeeId || r.signerEmployeeId === employeeId;
  });
}

function rowToRecord(row: any): SignatureAuditRecord {
  return {
    id: row.id,
    context: row.context,
    signerEmployeeId: row.signer_employee_id,
    signerLegalName: row.signer_legal_name,
    signedAtIso: row.signed_at_iso,
    serverStamped: row.server_stamped ?? false,
    ipAddress: row.ip_address ?? undefined,
    geo: row.geo ?? undefined,
    fingerprint: row.fingerprint,
    documentHash: row.document_hash,
    documentTitle: row.document_title,
    documentBytes: row.document_bytes,
    signatureImagePngDataUrl: row.signature_image_png_data_url,
    consentAcknowledged: row.consent_acknowledged ?? false,
    priorRecordId: row.prior_record_id,
    priorRecordHash: row.prior_record_hash,
  };
}

export async function loadSignatureById(id: string): Promise<SignatureAuditRecord | undefined> {
  const local = getSignatureById(id);
  if (local) return local;
  const { data } = await supabase.from('signature_audit_records').select('*').eq('id', id).single();
  return data ? rowToRecord(data) : undefined;
}

export async function loadSignaturesForEmployee(employeeId: string): Promise<SignatureAuditRecord[]> {
  const { data } = await supabase
    .from('signature_audit_records')
    .select('*')
    .or(`context->>'employeeId'.eq.${employeeId},signer_employee_id.eq.${employeeId}`);
  if (!data || data.length === 0) return getSignaturesForEmployee(employeeId);
  return data.map(rowToRecord);
}

export async function getMostRecentRecord(): Promise<
  { id: string; hashOfRecord: string } | null
> {
  const all = readAll();
  if (all.length === 0) return null;
  const last = all[all.length - 1];
  const { id, priorRecordId: _a, priorRecordHash: _b, ...rest } = last;
  const hash = await hashRecord(rest as any);
  return { id, hashOfRecord: hash };
}

/**
 * Verify the chain. Returns the index of the first broken record, or -1 if all
 * records are intact. Useful for an admin "audit log integrity" check.
 */
export async function verifyChain(): Promise<{ valid: boolean; firstBrokenIndex: number }> {
  const all = readAll();
  let prior: { id: string; hash: string } | null = null;
  for (let i = 0; i < all.length; i++) {
    const r = all[i];
    if (r.priorRecordId !== (prior?.id ?? null)) {
      return { valid: false, firstBrokenIndex: i };
    }
    if (r.priorRecordHash !== (prior?.hash ?? null)) {
      return { valid: false, firstBrokenIndex: i };
    }
    const { id, priorRecordId: _a, priorRecordHash: _b, ...rest } = r;
    const hash = await hashRecord(rest as any);
    prior = { id, hash };
  }
  return { valid: true, firstBrokenIndex: -1 };
}
