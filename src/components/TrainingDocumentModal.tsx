'use client';

/**
 * TrainingDocumentModal
 *
 * Opens in response to clicking a "View Document" button on a training skill.
 * Two modes:
 *   - external: government/third-party PDF rendered in an <iframe>.
 *     Employee fills the PDF using the browser's native PDF viewer, then
 *     signs the attestation below to record completion.
 *   - custom: Makenna Koffee form rendered as pre-populated HTML.
 *     Employee reads and signs directly in the modal.
 *
 * On successful signing:
 *   1. SignatureAuditRecord is created via stampSignature().
 *   2. Record saved locally via appendSignature().
 *   3. Record uploaded to Supabase Storage via uploadTrainingDocRecord().
 *   4. onSigned() callback is called so the parent can mark the skill complete.
 */

import { useState } from 'react';
import { X, ExternalLink, FileText, PenLine, CheckCircle2 } from 'lucide-react';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import { getTrainingDocTemplate } from '@/data/training-document-templates';
import { stampSignature, tryGetGeolocation } from '@/lib/signature-audit';
import { appendSignature, getMostRecentRecord } from '@/data/signatures';
import { uploadTrainingDocRecord } from '@/lib/training-docs-storage';
import { Employee } from '@/types';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { format, parseISO } from 'date-fns';

interface Props {
  documentId: string;
  employee: Employee;
  /** The trainer / manager who is overseeing this step — or the employee themselves for self-serve. */
  signerEmployee: Employee;
  skillName: string;
  onSigned: () => void;
  onClose: () => void;
}

export default function TrainingDocumentModal({
  documentId,
  employee,
  signerEmployee,
  skillName,
  onSigned,
  onClose,
}: Props) {
  const [signing, setSigning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const template = getTrainingDocTemplate(documentId);
  if (!template) return null;

  // Populate template body with employee data
  const hireDate = format(parseISO(employee.hiredOn), 'MMMM d, yyyy');
  const location = getLocation(employee.homeLocationId)?.name ?? employee.homeLocationId;

  const populatedBody = template.templateBody
    .replace(/\{\{firstName\}\}/g, employee.firstName)
    .replace(/\{\{lastName\}\}/g, employee.lastName)
    .replace(/\{\{email\}\}/g, employee.email)
    .replace(/\{\{hireDate\}\}/g, hireDate)
    .replace(/\{\{location\}\}/g, location)
    .replace(/\{\{role\}\}/g, employee.role);

  const handleSign = async (result: SignaturePadResult) => {
    setSaving(true);
    setError(null);
    try {
      const geo = await tryGetGeolocation();
      const prior = await getMostRecentRecord();

      const record = await stampSignature({
        context: {
          kind: 'training_skill',
          employeeId: employee.id,
          stationId: 'compliance-culture',
          skillId: documentId,
        },
        signerEmployeeId: signerEmployee.id,
        signerLegalName: result.signerLegalName,
        documentTitle: template.title,
        documentBody: populatedBody,
        signatureImagePngDataUrl: result.signaturePngDataUrl,
        consentAcknowledged: true,
        priorRecord: prior,
        geo,
      });

      appendSignature(record);
      await uploadTrainingDocRecord(employee.id, documentId, record);

      setDone(true);
      setSigning(false);
      // Brief pause so user sees the success state before the parent closes
      setTimeout(() => onSigned(), 1200);
    } catch (e) {
      setError('Something went wrong saving the signature. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-cyan-500" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Training Document
              </div>
              <h2 className="text-lg font-bold text-ink-700">{template.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Employee info strip */}
          <div className="border-b border-ink-100 bg-cyan-50/50 px-6 py-3">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-ink-400">Employee: </span>
                <span className="font-semibold text-ink-700">{fullName(employee)}</span>
              </div>
              <div>
                <span className="text-ink-400">Location: </span>
                <span className="font-semibold text-ink-700">{location}</span>
              </div>
              <div>
                <span className="text-ink-400">Hire date: </span>
                <span className="font-semibold text-ink-700">{hireDate}</span>
              </div>
              <div>
                <span className="text-ink-400">Skill: </span>
                <span className="font-semibold text-ink-700">{skillName}</span>
              </div>
            </div>
          </div>

          {/* Document content */}
          {template.type === 'external' ? (
            // External PDF: iframe + instructions
            <div className="flex flex-col gap-4 p-6">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold">📋 Instructions</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Click <strong>"Open form in new tab"</strong> below to open the official {template.title}.</li>
                  <li>Fill in the required fields using your employee information shown above.</li>
                  <li>Print and sign the physical form, or complete it digitally.</li>
                  <li>Return the completed form to your manager.</li>
                  <li>After the form is handed in, return here and add your e-signature below to record your attestation.</li>
                </ol>
              </div>

              <a
                href={template.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex w-fit items-center gap-2"
              >
                <ExternalLink size={16} />
                Open form in new tab
              </a>

              {/* Official form embed */}
              <div className="overflow-hidden rounded-xl border border-ink-100">
                <div className="border-b border-ink-100 bg-ink-50 px-4 py-2 text-xs text-ink-500">
                  Official form preview (use "Open in new tab" above to fill and download)
                </div>
                <iframe
                  src={template.externalUrl}
                  className="h-[480px] w-full"
                  title={template.title}
                />
              </div>

              {/* Attestation text */}
              <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Attestation — sign after completing the form above
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                  {populatedBody}
                </p>
              </div>
            </div>
          ) : (
            // Custom Makenna form: rendered HTML with pre-populated text
            <div className="p-6">
              <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-sm">
                <div className="mb-4 border-b border-ink-100 pb-4">
                  <h3 className="text-xl font-bold text-ink-700">{template.title}</h3>
                  <p className="mt-1 text-sm text-ink-400">{template.description}</p>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                  {populatedBody}
                </div>
              </div>
            </div>
          )}

          {/* Signature section */}
          <div className="border-t border-ink-100 p-6">
            {done ? (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-5 text-emerald-800">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <p className="font-bold">Document signed & saved</p>
                  <p className="text-sm">
                    Signature captured and saved to your training record. This skill will be marked
                    complete.
                  </p>
                </div>
              </div>
            ) : signing ? (
              <div>
                <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-ink-700">
                  <PenLine size={18} /> Sign &amp; Attest
                </h3>
                <p className="mb-4 text-sm text-ink-600">
                  By signing below, {fullName(signerEmployee)} confirms the above document has been
                  reviewed and completed for{' '}
                  <strong>{fullName(employee)}</strong>.
                </p>
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
                )}
                {saving ? (
                  <div className="py-6 text-center text-sm text-ink-400">Saving signature…</div>
                ) : (
                  <SignaturePad onSubmit={handleSign} signerName={fullName(signerEmployee)} />
                )}
              </div>
            ) : (
              <button
                onClick={() => setSigning(true)}
                className="btn-primary w-full"
              >
                <PenLine size={16} /> Sign &amp; record completion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
