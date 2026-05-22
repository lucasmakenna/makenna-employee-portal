'use client';

import { useState, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import ESIGNConsentGate from '@/components/ESIGNConsentGate';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import PDFFormViewer from '@/components/PDFFormViewer';
import { getDocTemplate, ONBOARDING_DOCS } from '@/data/onboarding';
import { fullName } from '@/data/employees';
import { usePackets } from '@/data/store';
import { stampSignature, hasConsented, tryGetGeolocation } from '@/lib/signature-audit';
import { appendSignature, getMostRecentRecord } from '@/data/signatures';
import type { Employee, OnboardingDocId } from '@/types';

interface Props {
  employeeId: string;
  docId: OnboardingDocId;
  employee: Employee;
  user: Employee;
  onSigned: () => void;
  onClose: () => void;
}

export default function OnboardingDocModal({ employeeId, docId, employee, user, onSigned, onClose }: Props) {
  const { get: getPacket, update: updatePacket, create: createPacket } = usePackets();
  const packet = getPacket(employeeId);

  const [showConsent, setShowConsent] = useState(false);
  const [ready, setReady] = useState(false);

  // Auto-create packet if missing, or repair one with empty tasks
  useEffect(() => {
    const existing = getPacket(employeeId);
    if (!existing) {
      createPacket(employeeId, employee.hiredOn);
    } else if (!existing.tasks || existing.tasks.length === 0) {
      updatePacket(employeeId, {
        tasks: ONBOARDING_DOCS.map((d) => ({ id: d.id, title: d.title, description: d.description, required: d.required, signed: false })),
      });
    }
  }, [employeeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hasConsented(employeeId)) {
      setReady(true);
    } else {
      setShowConsent(true);
    }
  }, [employeeId]);

  const task = packet?.tasks.find((t) => t.id === docId);
  const alreadySigned = !!task?.signed;
  const blocked = alreadySigned;

  const tpl = getDocTemplate(docId);

  const handleSign = async (result: SignaturePadResult) => {
    const documentTitle = tpl?.title ?? docId;
    const documentBody = tpl?.templateBody ?? '';
    const geo = await tryGetGeolocation();
    const prior = await getMostRecentRecord();
    const record = await stampSignature({
      context: { kind: 'onboarding', employeeId, docId },
      signerEmployeeId: employeeId,
      signerLegalName: result.signerLegalName,
      documentTitle,
      documentBody,
      signatureImagePngDataUrl: result.signaturePngDataUrl,
      consentAcknowledged: true,
      priorRecord: prior,
      geo,
    });
    appendSignature(record);
    const signedTask = { id: docId, title: tpl?.title ?? docId, description: tpl?.templateBody?.slice(0, 80) ?? '', required: true, signed: true, signedAt: record.signedAtIso, signedByName: result.signerLegalName, signatureRecordId: record.id };
    const existingTasks = packet!.tasks ?? [];
    const hasTask = existingTasks.some((t) => t.id === docId);
    updatePacket(employeeId, {
      tasks: hasTask ? existingTasks.map((t) => t.id === docId ? { ...t, ...signedTask } : t) : [...existingTasks, signedTask],
    });
    onSigned();
  };

  // Already-signed or missing-packet: show a simple informational modal instead of silent nothing
  if (blocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="text-lg font-bold text-ink-700">{tpl?.title ?? docId}</h2>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-ink-100">
              <X size={20} className="text-ink-400" />
            </button>
          </div>
          <div className="p-6">
            {alreadySigned ? (
              <p className="text-sm text-emerald-700 font-semibold">
                ✓ This document has already been signed for {fullName(employee)}.
              </p>
            ) : (
              <p className="text-sm text-ink-600">
                No onboarding packet found for {fullName(employee)}. Please complete onboarding first.
              </p>
            )}
            <button onClick={onClose} className="btn-cyan mt-4 w-full">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showConsent && (
        <ESIGNConsentGate
          employeeId={employeeId}
          employeeName={fullName(employee)}
          onConsent={() => { setShowConsent(false); setReady(true); }}
          onCancel={onClose}
        />
      )}

      {ready && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white px-6 py-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Onboarding document — {fullName(employee)}
                </div>
                <h2 className="text-lg font-bold text-ink-700">{tpl?.title ?? task?.title ?? docId}</h2>
              </div>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-ink-100">
                <X size={20} className="text-ink-400" />
              </button>
            </div>

            <div className="p-6">
              {!packet ? (
                <p className="py-8 text-center text-sm text-ink-400">Setting up onboarding packet…</p>
              ) : (
                <>
                  {docId === 'w4' && (
                    <PDFFormViewer
                      pdfUrl="/forms/w4.pdf"
                      title="IRS Form W-4 — Employee's Withholding Certificate"
                      instructions={
                        <>
                          <strong>Review the W-4 below.</strong> Download and print it to fill out by hand, or your manager will have a blank copy on Day 1. Sign the attestation below once you've reviewed it.
                        </>
                      }
                      attestationText={getDocTemplate('w4')?.templateBody ?? ''}
                      signerName={fullName(employee)}
                      onSubmit={(result) => handleSign(result)}
                      onCancel={onClose}
                    />
                  )}
                  {docId === 'i9' && (
                    <PDFFormViewer
                      pdfUrl="/forms/i9.pdf"
                      title="USCIS Form I-9 — Employment Eligibility Verification"
                      instructions={
                        <>
                          <strong>Review the I-9 below.</strong> Complete Section 1 on or before your first day of paid work. Bring original documents on Day 1 — your manager will complete Section 2 in person. Sign the attestation below to confirm you understand the requirement.
                        </>
                      }
                      attestationText={getDocTemplate('i9')?.templateBody ?? ''}
                      signerName={fullName(employee)}
                      onSubmit={(result) => handleSign(result)}
                      onCancel={onClose}
                    />
                  )}
                  {docId !== 'w4' && docId !== 'i9' && tpl && (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-cyan-50/50 p-4 text-sm text-ink-700">
                        <p className="font-semibold text-ink-700 mb-2 flex items-center gap-2">
                          <Lock size={14} /> What you are signing
                        </p>
                        <p className="leading-relaxed whitespace-pre-line">{tpl.templateBody}</p>
                      </div>
                      <SignaturePad onSubmit={handleSign} signerName={fullName(employee)} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
