'use client';

import { useState, useEffect } from 'react';
import { X, Lock, Download, CheckCircle2 } from 'lucide-react';
import ESIGNConsentGate from '@/components/ESIGNConsentGate';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import W4Form, { W4Data } from '@/components/W4Form';
import I9Form, { I9Data, I9Signatures } from '@/components/I9Form';
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
  const [signedData, setSignedData] = useState<{ docId: 'w4' | 'i9'; formData: object } | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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
  // Don't block if we just signed in this session (signedData is set) — show download screen instead
  const blocked = alreadySigned && !signedData;

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

  const handleW4Submit = async (formData: W4Data, signature: SignaturePadResult) => {
    const documentBody = [
      `IRS Form W-4 — Employee's Withholding Certificate`,
      `Employee: ${formData.firstName} ${formData.middleInitial} ${formData.lastName}`.trim(),
      `SSN: ${formData.ssn}`,
      `Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
      `Filing status: ${formData.filingStatus}`,
      `Multiple jobs checkbox: ${formData.multipleJobsChecked ? 'Checked' : 'Not checked'}`,
      `Qualifying children amount: $${formData.qualifyingChildrenAmount || '0'}`,
      `Other dependents amount: $${formData.otherDependentsAmount || '0'}`,
      `Dependents total: $${formData.dependentsTotalAmount || '0'}`,
      `Other income: $${formData.otherIncome || '0'}`,
      `Deductions: $${formData.deductions || '0'}`,
      `Extra withholding: $${formData.extraWithholding || '0'}`,
      `Employer: ${formData.employerName}`,
      `First date of employment: ${formData.firstDateOfEmployment}`,
    ].join('\n');
    const geo = await tryGetGeolocation();
    const prior = await getMostRecentRecord();
    const record = await stampSignature({
      context: { kind: 'onboarding', employeeId, docId: 'w4' },
      signerEmployeeId: employeeId,
      signerLegalName: signature.signerLegalName,
      documentTitle: "IRS Form W-4 — Employee's Withholding Certificate",
      documentBody,
      signatureImagePngDataUrl: signature.signaturePngDataUrl,
      consentAcknowledged: true,
      priorRecord: prior,
      geo,
    });
    appendSignature(record);
    const w4Task = { id: 'w4' as const, title: "IRS Form W-4", description: "Federal tax withholding.", required: true, signed: true, signedAt: record.signedAtIso, signedByName: signature.signerLegalName, signatureRecordId: record.id, formData: formData as unknown as Record<string, unknown> };
    const existingW4Tasks = packet!.tasks ?? [];
    const updatedTasks = existingW4Tasks.some((t) => t.id === 'w4')
      ? existingW4Tasks.map((t) => t.id === 'w4' ? { ...t, ...w4Task } : t)
      : [...existingW4Tasks, w4Task];
    updatePacket(employeeId, { tasks: updatedTasks });
    fetch('/api/forms/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, docId: 'w4', formData }),
    }).then((r) => r.ok ? r.json() : null).then((json) => {
      if (json?.publicUrl) {
        updatePacket(employeeId, { tasks: updatedTasks.map((t) => t.id === 'w4' ? { ...t, pdfStorageUrl: json.publicUrl } : t) });
      }
    }).catch(() => {});
    setSignedData({ docId: 'w4', formData });
  };

  const handleI9Submit = async (formData: I9Data, signatures: I9Signatures) => {
    const docListSummary = formData.documentListType === 'A'
      ? `List A: ${formData.listADocument.documentTitle} (${formData.listADocument.documentNumber})`
      : `List B: ${formData.listBDocument.documentTitle} (${formData.listBDocument.documentNumber}) | List C: ${formData.listCDocument.documentTitle} (${formData.listCDocument.documentNumber})`;
    const documentBody = [
      `USCIS Form I-9 — Employment Eligibility Verification`,
      `Employee: ${formData.firstName} ${formData.middleInitial} ${formData.lastName}`.trim(),
      `Address: ${formData.address}${formData.aptNumber ? ' Apt ' + formData.aptNumber : ''}, ${formData.city}, ${formData.state} ${formData.zip}`,
      `Date of birth: ${formData.dateOfBirth}`,
      `Citizenship status: ${formData.citizenshipStatus}`,
      `Documents presented: ${docListSummary}`,
      `Employee first day: ${formData.employeeFirstDay}`,
      `Employer: ${formData.employerOrganization} — ${formData.employerTitle}`,
    ].join('\n');
    const geo = await tryGetGeolocation();
    const prior = await getMostRecentRecord();
    const empRecord = await stampSignature({
      context: { kind: 'onboarding', employeeId, docId: 'i9' },
      signerEmployeeId: employeeId,
      signerLegalName: signatures.employee.signerLegalName,
      documentTitle: 'Form I-9 Section 1 — Employee Attestation',
      documentBody,
      signatureImagePngDataUrl: signatures.employee.signaturePngDataUrl,
      consentAcknowledged: true,
      priorRecord: prior,
      geo,
    });
    appendSignature(empRecord);
    const prior2 = await getMostRecentRecord();
    const emplorRecord = await stampSignature({
      context: { kind: 'onboarding', employeeId, docId: 'i9' },
      signerEmployeeId: user.id,
      signerLegalName: signatures.employer.signerLegalName,
      documentTitle: 'Form I-9 Section 2 — Employer Verification',
      documentBody,
      signatureImagePngDataUrl: signatures.employer.signaturePngDataUrl,
      consentAcknowledged: true,
      priorRecord: prior2,
      geo,
    });
    appendSignature(emplorRecord);
    const i9Task = { id: 'i9' as const, title: "Form I-9 — Employment Eligibility", description: "U.S. work authorization.", required: true, signed: true, signedAt: emplorRecord.signedAtIso, signedByName: signatures.employer.signerLegalName, signatureRecordId: empRecord.id, formData: formData as unknown as Record<string, unknown> };
    const existingI9Tasks = packet!.tasks ?? [];
    const updatedTasks = existingI9Tasks.some((t) => t.id === 'i9')
      ? existingI9Tasks.map((t) => t.id === 'i9' ? { ...t, ...i9Task } : t)
      : [...existingI9Tasks, i9Task];
    updatePacket(employeeId, { tasks: updatedTasks });
    fetch('/api/forms/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, docId: 'i9', formData }),
    }).then((r) => r.ok ? r.json() : null).then((json) => {
      if (json?.publicUrl) {
        updatePacket(employeeId, { tasks: updatedTasks.map((t) => t.id === 'i9' ? { ...t, pdfStorageUrl: json.publicUrl } : t) });
      }
    }).catch(() => {});
    setSignedData({ docId: 'i9', formData });
  };

  const handleDownloadPdf = async () => {
    if (!signedData) return;
    setDownloadingPdf(true);
    try {
      const res = await fetch('/api/forms/pdf/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signedData),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${signedData.docId.toUpperCase()}_${new Date().getFullYear()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail — user can still continue
    } finally {
      setDownloadingPdf(false);
    }
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
              ) : signedData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-5 text-emerald-800">
                    <CheckCircle2 size={24} className="shrink-0" />
                    <div>
                      <p className="font-bold">Document signed!</p>
                      <p className="text-sm">Signature captured and saved.</p>
                    </div>
                  </div>
                  <p className="text-sm text-ink-600">
                    Download the completed {signedData.docId === 'w4' ? 'W-4' : 'I-9'} PDF to keep for your records or print for submission.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      className="btn-cyan flex-1 flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      {downloadingPdf ? 'Generating PDF…' : `Download filled ${signedData.docId.toUpperCase()} PDF`}
                    </button>
                    <button onClick={onSigned} className="btn-ghost flex-1">Continue →</button>
                  </div>
                </div>
              ) : (
                <>
                  {docId === 'w4' && (
                    <W4Form
                      employeeName={fullName(employee)}
                      defaultFirstDateOfEmployment={packet!.startDate}
                      onSubmit={handleW4Submit}
                      onCancel={onClose}
                    />
                  )}
                  {docId === 'i9' && (
                    <I9Form
                      employeeName={fullName(employee)}
                      defaultFirstDay={packet!.startDate}
                      currentUserName={fullName(user)}
                      onSubmit={handleI9Submit}
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
