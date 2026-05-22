'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lock,
  Shield,
  ShieldCheck,
  Stamp,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import ESIGNConsentGate from '@/components/ESIGNConsentGate';
import W4Form, { W4Data } from '@/components/W4Form';
import I9Form, { I9Data, I9Signatures } from '@/components/I9Form';
import FormSheet from '@/components/FormSheet';
import { useCurrentUser } from '@/lib/auth';
import { getDocTemplate } from '@/data/onboarding';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { useEmployees, usePackets } from '@/data/store';
import { OnboardingTask } from '@/types';
import { format, parseISO } from 'date-fns';
import { stampSignature, hasConsented, tryGetGeolocation } from '@/lib/signature-audit';
import { appendSignature, getMostRecentRecord } from '@/data/signatures';

export default function OnboardingDetail() {
  const params = useParams<{ employeeId: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();

  const { get: getPacket, update: updatePacket } = usePackets();
  const { getById: getEmployeeById } = useEmployees();
  const packet = getPacket(params.employeeId);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  useEffect(() => {
    if (packet) setConsented(hasConsented(packet.employeeId));
  }, [packet]);

  // Auto-open a specific doc when linked from training (e.g. ?open=i9)
  useEffect(() => {
    if (!packet) return;
    const openDoc = new URLSearchParams(window.location.search).get('open');
    if (!openDoc) return;
    const task = packet.tasks.find((t) => t.id === openDoc);
    if (!task || task.signed) return;
    // Inline startSign logic (avoids TDZ — startSign is defined after early returns below)
    if (!hasConsented(packet.employeeId)) {
      setPendingTaskId(openDoc);
    } else {
      setActiveTaskId(openDoc);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packet]);

  if (!packet || !user) {
    return (
      <AppShell>
        <p>Onboarding packet not found.</p>
      </AppShell>
    );
  }

  const employee = getEmployeeById(packet.employeeId);
  const trainer = packet.trainerEmployeeId ? getEmployeeById(packet.trainerEmployeeId) : null;
  if (!employee) return null;

  const total = packet.tasks.length;
  const done = packet.tasks.filter((t) => t.signed).length;
  const allDone = done === total;

  const startSign = (taskId: string) => {
    if (!consented) {
      setPendingTaskId(taskId);
      return;
    }
    setActiveTaskId(taskId);
  };

  const handleSign = async (taskId: string, result: SignaturePadResult) => {
    const tpl = getDocTemplate(taskId as any);
    const documentTitle = tpl?.title ?? taskId;
    const documentBody = tpl?.templateBody ?? '';

    const geo = await tryGetGeolocation();
    const prior = await getMostRecentRecord();

    const record = await stampSignature({
      context: { kind: 'onboarding', employeeId: packet.employeeId, docId: taskId as any },
      signerEmployeeId: packet.employeeId,
      signerLegalName: result.signerLegalName,
      documentTitle,
      documentBody,
      signatureImagePngDataUrl: result.signaturePngDataUrl,
      consentAcknowledged: true,
      priorRecord: prior,
      geo,
    });
    appendSignature(record);

    updatePacket(packet.employeeId, {
      tasks: packet.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              signed: true,
              signedAt: record.signedAtIso,
              signedByName: result.signerLegalName,
              signatureRecordId: record.id,
            }
          : t,
      ),
    });
    setActiveTaskId(null);
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
      context: { kind: 'onboarding', employeeId: packet.employeeId, docId: 'w4' },
      signerEmployeeId: packet.employeeId,
      signerLegalName: signature.signerLegalName,
      documentTitle: "IRS Form W-4 — Employee's Withholding Certificate",
      documentBody,
      signatureImagePngDataUrl: signature.signaturePngDataUrl,
      consentAcknowledged: true,
      priorRecord: prior,
      geo,
    });
    appendSignature(record);
    updatePacket(packet.employeeId, {
      tasks: packet.tasks.map((t) =>
        t.id === 'w4'
          ? { ...t, signed: true, signedAt: record.signedAtIso, signedByName: signature.signerLegalName, signatureRecordId: record.id, formData: formData as unknown as Record<string, unknown> }
          : t,
      ),
    });
    setActiveTaskId(null);
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
      context: { kind: 'onboarding', employeeId: packet.employeeId, docId: 'i9' },
      signerEmployeeId: packet.employeeId,
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
      context: { kind: 'onboarding', employeeId: packet.employeeId, docId: 'i9' },
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
    updatePacket(packet.employeeId, {
      tasks: packet.tasks.map((t) =>
        t.id === 'i9'
          ? { ...t, signed: true, signedAt: emplorRecord.signedAtIso, signedByName: signatures.employer.signerLegalName, signatureRecordId: empRecord.id, formData: formData as unknown as Record<string, unknown> }
          : t,
      ),
    });
    setActiveTaskId(null);
  };

  const handleManagerSignOff = () => {
    updatePacket(packet.employeeId, {
      managerSignOff: {
        byId: user.id,
        byName: fullName(user),
        at: new Date().toISOString(),
      },
    });
  };

  // W-4 full-screen sheet
  const w4Task = packet.tasks.find((t) => t.id === 'w4');
  const i9Task = packet.tasks.find((t) => t.id === 'i9');

  return (
    <AppShell>
      {/* W-4 full-screen form sheet */}
      {activeTaskId === 'w4' && w4Task && !w4Task.signed && (
        <FormSheet
          title="IRS Form W-4"
          subtitle="Employee's Withholding Certificate"
          onClose={() => setActiveTaskId(null)}
        >
          <W4Form
            employeeName={fullName(employee)}
            defaultFirstDateOfEmployment={packet.startDate}
            onSubmit={handleW4Submit}
            onCancel={() => setActiveTaskId(null)}
          />
        </FormSheet>
      )}

      {/* I-9 full-screen form sheet */}
      {activeTaskId === 'i9' && i9Task && !i9Task.signed && (
        <FormSheet
          title="Form I-9"
          subtitle="Employment Eligibility Verification"
          onClose={() => setActiveTaskId(null)}
        >
          <I9Form
            employeeName={fullName(employee)}
            defaultFirstDay={packet.startDate}
            currentUserName={fullName(user)}
            onSubmit={handleI9Submit}
            onCancel={() => setActiveTaskId(null)}
          />
        </FormSheet>
      )}

      {pendingTaskId && (
        <ESIGNConsentGate
          employeeId={packet.employeeId}
          employeeName={fullName(employee)}
          onConsent={() => {
            setConsented(true);
            setActiveTaskId(pendingTaskId);
            setPendingTaskId(null);
          }}
          onCancel={() => setPendingTaskId(null)}
        />
      )}
      <div className="mx-auto max-w-6xl">
        <Link
          href="/onboarding"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> All onboarding
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-4">
                <Avatar employee={employee} size="xl" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-400">
                    New hire
                  </div>
                  <h1 className="text-2xl font-bold text-ink-700">{fullName(employee)}</h1>
                  <p className="text-sm text-ink-400">
                    {getLocation(employee.homeLocationId)?.name}
                  </p>
                </div>
              </div>
              <dl className="mt-5 grid gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-400">Start date</dt>
                  <dd className="font-semibold text-ink-700">
                    {format(parseISO(packet.startDate), 'MMM d, yyyy')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Trainer</dt>
                  <dd className="font-semibold text-ink-700">
                    {trainer ? fullName(trainer) : 'Unassigned'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Email</dt>
                  <dd className="font-semibold text-ink-700">{employee.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-400">Phone</dt>
                  <dd className="font-semibold text-ink-700">{employee.phone}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-ink-100 pt-2">
                  <dt className="text-ink-400 flex items-center gap-1">
                    <Shield size={12} /> ESIGN consent
                  </dt>
                  <dd className="font-semibold text-emerald-700">
                    {consented ? 'Captured' : 'Pending first signature'}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-ink-100 pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Progress
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-ink-700">{done}</span>
                  <span className="text-sm text-ink-400">of {total} signed</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-cyan-50">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${(done / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Manager sign-off */}
            <div className="card p-6">
              <div className="flex items-center gap-2 text-ink-700">
                <ShieldCheck size={18} />
                <h2 className="font-bold">Manager sign-off</h2>
              </div>
              {packet.managerSignOff ? (
                <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                  Approved by{' '}
                  <span className="font-semibold">{packet.managerSignOff.byName}</span> on{' '}
                  {format(parseISO(packet.managerSignOff.at), 'MMM d, h:mm a')}
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-ink-400">
                    Once all required documents are signed, a manager confirms the new hire is
                    cleared to start.
                  </p>
                  <button
                    onClick={handleManagerSignOff}
                    disabled={!allDone}
                    className="btn-primary mt-4 w-full disabled:opacity-40"
                  >
                    <Stamp size={16} />
                    {allDone ? 'Sign off & clear to work' : 'Pending document signatures'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-bold text-ink-700">Day One Packet</h2>
            <p className="-mt-2 text-sm text-ink-400">
              Tap any document to review and sign. Each signature is paired with an audit trail —
              tap "View certificate" after signing to see it.
            </p>

            {packet.tasks.map((t) => {
              const isExpanded = activeTaskId === t.id;
              const toggle = () => {
                if (isExpanded) { setActiveTaskId(null); return; }
                if (t.signed) {
                  if (t.signatureRecordId) router.push(`/onboarding/${packet.employeeId}/certificate/${t.signatureRecordId}`);
                  return;
                }
                startSign(t.id);
              };

              if (t.id === 'w4' || t.id === 'i9') {
                const formToggle = () => {
                  if (t.signed) {
                    if (t.signatureRecordId) router.push(`/onboarding/${packet.employeeId}/certificate/${t.signatureRecordId}`);
                    return;
                  }
                  startSign(t.id);
                };
                return (
                  <TaskRow key={t.id} task={t} expanded={false} onToggle={formToggle} onSign={() => {}} />
                );
              }

              return (
                <TaskRow
                  key={t.id}
                  task={t}
                  expanded={isExpanded}
                  onToggle={toggle}
                  onSign={(result) => handleSign(t.id, result)}
                  signerName={fullName(employee)}
                  templateBody={getDocTemplate(t.id)?.templateBody ?? t.description}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function TaskRow({
  task,
  expanded,
  onToggle,
  onSign,
  signerName,
  templateBody,
  children,
}: {
  task: OnboardingTask;
  expanded: boolean;
  onToggle: () => void;
  onSign: (result: SignaturePadResult) => void;
  signerName?: string;
  templateBody?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`card overflow-hidden transition ${
        task.signed ? 'border-emerald-200 bg-emerald-50/40' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            task.signed ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-50 text-ink-700'
          }`}
        >
          {task.signed ? <CheckCircle2 size={22} /> : <FileText size={22} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="font-bold text-ink-700">{task.title}</div>
            {task.required ? (
              <span className="pill bg-amber-100 text-amber-800">Required</span>
            ) : (
              <span className="pill bg-cyan-50 text-ink-400">Optional</span>
            )}
            {task.signed && task.signedAt && (
              <span className="text-xs text-ink-400">
                Signed by {task.signedByName} ·{' '}
                {format(parseISO(task.signedAt), 'MMM d, h:mm a')}
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-ink-400">{task.description}</p>
        </div>
        <span className="hidden sm:block text-sm font-semibold text-ink-400">
          {task.signed ? 'View certificate' : expanded ? 'Close' : 'Sign'}
        </span>
      </button>

      {/* W-4 / I-9: render the full form as children */}
      {expanded && !task.signed && children && (
        <div className="border-t border-ink-100 p-4 bg-ink-50">
          {children}
        </div>
      )}

      {/* All other docs: show attestation text + signature pad */}
      {expanded && !task.signed && !children && templateBody && signerName && (
        <div className="border-t border-ink-100 p-4 bg-white space-y-4">
          <div className="rounded-lg bg-cyan-50/50 p-4 text-sm text-ink-700">
            <p className="font-semibold text-ink-700 mb-2 flex items-center gap-2">
              <Lock size={14} /> What you are signing
            </p>
            <p className="leading-relaxed whitespace-pre-line">{templateBody}</p>
          </div>
          <div>
            <SignaturePad onSubmit={onSign} signerName={signerName} />
          </div>
        </div>
      )}
    </div>
  );
}
