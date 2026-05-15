/**
 * Supabase Storage helpers for training document signatures.
 *
 * Bucket: `training-docs`  (create in Supabase dashboard → Storage → New bucket)
 *   Suggested settings: private bucket, 20 MB file size limit.
 *
 * Path schema:
 *   training-docs/{employeeId}/{documentId}/{signatureRecordId}.json
 *
 * Each JSON file is a self-contained audit record: employee info, document
 * content hash, signer legal name, timestamp, and the signature PNG data URL.
 */

import { supabase } from '@/lib/supabase';
import { SignatureAuditRecord } from '@/types';

const BUCKET = 'training-docs';

export type TrainingDocSignedRecord = {
  employeeId: string;
  documentId: string;
  documentTitle: string;
  signedAt: string;
  signerLegalName: string;
  /** SHA-256 of title + templateBody at signing time — proves which version. */
  documentHash: string;
  signatureRecordId: string;
  /** The full SignatureAuditRecord stored for complete tamper-evidence. */
  auditRecord: SignatureAuditRecord;
};

/**
 * Upload a completed/signed training document record to Supabase Storage.
 * Returns the storage path on success, or null if Supabase is not configured.
 */
export async function uploadTrainingDocRecord(
  employeeId: string,
  documentId: string,
  auditRecord: SignatureAuditRecord,
): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'your-supabase-url') return null; // sandbox fallback

  const payload: TrainingDocSignedRecord = {
    employeeId,
    documentId,
    documentTitle: auditRecord.documentTitle,
    signedAt: auditRecord.signedAtIso,
    signerLegalName: auditRecord.signerLegalName,
    documentHash: auditRecord.documentHash,
    signatureRecordId: auditRecord.id,
    auditRecord,
  };

  const path = `${employeeId}/${documentId}/${auditRecord.id}.json`;
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    upsert: true,
    contentType: 'application/json',
  });

  if (error) {
    console.error('[training-docs-storage] upload error:', error.message);
    return null;
  }

  return path;
}

/**
 * List all signed document records for an employee + specific document.
 * Returns the most recent signed record, or null if none found.
 */
export async function getLatestTrainingDocRecord(
  employeeId: string,
  documentId: string,
): Promise<TrainingDocSignedRecord | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'your-supabase-url') return null;

  const prefix = `${employeeId}/${documentId}/`;
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    sortBy: { column: 'created_at', order: 'desc' },
    limit: 1,
  });

  if (error || !data || data.length === 0) return null;

  const { data: fileData, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(`${prefix}${data[0].name}`);

  if (downloadError || !fileData) return null;

  try {
    const text = await fileData.text();
    return JSON.parse(text) as TrainingDocSignedRecord;
  } catch {
    return null;
  }
}
