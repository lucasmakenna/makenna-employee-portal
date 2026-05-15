'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, ShieldCheck, FileText } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { usePackets } from '@/data/store';
import { supabase } from '@/lib/supabase';
import { loadSignatureById, loadSignaturesForEmployee } from '@/data/signatures';
import type { SignatureAuditRecord } from '@/types';
import type { W4Data } from '@/components/W4Form';
import type { I9Data } from '@/components/I9Form';
import { format, parseISO } from 'date-fns';

// ─── Shared display primitives ────────────────────────────────────────────────

function FilledField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-0.5">{label}</div>
      <div className="rounded border border-ink-200 bg-ink-50 px-3 py-1.5 text-sm text-ink-800 min-h-[34px]">
        {value || <span className="text-ink-300 italic">—</span>}
      </div>
    </div>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-white text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-ink-800 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SignatureBlock({ record, label }: { record: SignatureAuditRecord | undefined; label: string }) {
  if (!record) return null;
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{label}</div>
      <div className="rounded-xl border-2 border-ink-200 bg-white p-3">
        {record.signatureImagePngDataUrl ? (
          <img
            src={record.signatureImagePngDataUrl}
            alt="Signature"
            className="h-16 max-w-xs object-contain"
          />
        ) : (
          <span className="text-ink-400 italic text-sm">Signature on file</span>
        )}
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-500">
          <span><strong>Signed by:</strong> {record.signerLegalName}</span>
          <span><strong>Date:</strong> {format(parseISO(record.signedAtIso), 'MM/dd/yyyy h:mm a')}</span>
          {record.ipAddress && <span><strong>IP:</strong> {record.ipAddress}</span>}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
          <ShieldCheck size={11} />
          <span>ESIGN Act compliant · Audit record #{record.id.slice(-8)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── W-4 completed view ───────────────────────────────────────────────────────

function W4View({ data, employeeRecord }: { data: W4Data; employeeRecord: SignatureAuditRecord | undefined }) {
  const filingLabels: Record<string, string> = {
    single_or_mfs: 'Single or Married filing separately',
    married_jointly: 'Married filing jointly or Qualifying surviving spouse',
    head_of_household: 'Head of household',
  };

  return (
    <div className="space-y-0 print:shadow-none">
      {/* Header */}
      <div className="rounded-t-xl border border-ink-200 bg-ink-800 text-white p-4 flex items-start justify-between print:rounded-none">
        <div>
          <div className="text-xs text-ink-300 uppercase tracking-wider">Department of the Treasury — Internal Revenue Service</div>
          <div className="text-lg font-bold mt-0.5">Employee's Withholding Certificate</div>
          <div className="text-xs text-ink-300 mt-0.5">Completed and signed electronically per the ESIGN Act.</div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-2xl font-bold">W-4</div>
          <div className="text-xs text-ink-300">OMB No. 1545-0074</div>
        </div>
      </div>

      <div className="border-x border-b border-ink-200 bg-white print:border-none">
        {/* Step 1 */}
        <div className="border-b border-ink-100 p-5 space-y-4">
          <SectionHeader number="1" title="Personal Information" />
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5"><FilledField label="First name" value={data.firstName} /></div>
            <div className="col-span-1"><FilledField label="M.I." value={data.middleInitial} /></div>
            <div className="col-span-6"><FilledField label="Last name" value={data.lastName} /></div>
          </div>
          <FilledField label="Social security number" value={data.ssn} />
          <FilledField label="Home address" value={data.address} />
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-6"><FilledField label="City" value={data.city} /></div>
            <div className="col-span-2"><FilledField label="State" value={data.state} /></div>
            <div className="col-span-4"><FilledField label="ZIP" value={data.zip} /></div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">Filing status</div>
            <div className="flex items-center gap-2 rounded border border-ink-200 bg-ink-50 px-3 py-2">
              <div className="h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <span className="text-sm text-ink-800">{filingLabels[data.filingStatus] ?? data.filingStatus}</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="border-b border-ink-100 p-5">
          <SectionHeader number="2" title="Multiple Jobs or Spouse Works" />
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${data.multipleJobsChecked ? 'bg-cyan-500 border-cyan-500' : 'border-ink-300 bg-white'}`}>
              {data.multipleJobsChecked && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}><path d="M2 6l3 3 5-5" /></svg>
              )}
            </div>
            <span className="text-sm text-ink-700">Two jobs at similar pay / spouse also works — checkbox {data.multipleJobsChecked ? 'checked' : 'not checked'}</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="border-b border-ink-100 p-5 space-y-3">
          <SectionHeader number="3" title="Claim Dependents" />
          <div className="grid grid-cols-3 gap-3">
            <FilledField label="Qualifying children × $2,000" value={data.qualifyingChildrenAmount ? `$${data.qualifyingChildrenAmount}` : '$0'} />
            <FilledField label="Other dependents × $500" value={data.otherDependentsAmount ? `$${data.otherDependentsAmount}` : '$0'} />
            <FilledField label="Total claim" value={data.dependentsTotalAmount ? `$${data.dependentsTotalAmount}` : '$0'} />
          </div>
        </div>

        {/* Step 4 */}
        <div className="border-b border-ink-100 p-5 space-y-3">
          <SectionHeader number="4" title="Other Adjustments (optional)" />
          <div className="grid grid-cols-3 gap-3">
            <FilledField label="(a) Other income" value={data.otherIncome ? `$${data.otherIncome}` : '$0'} />
            <FilledField label="(b) Deductions" value={data.deductions ? `$${data.deductions}` : '$0'} />
            <FilledField label="(c) Extra withholding" value={data.extraWithholding ? `$${data.extraWithholding}` : '$0'} />
          </div>
        </div>

        {/* Step 5 — Signature */}
        <div className="border-b border-ink-100 p-5">
          <SectionHeader number="5" title="Employee Signature" />
          <SignatureBlock record={employeeRecord} label="Signed by employee" />
        </div>

        {/* Employer section */}
        <div className="rounded-b-xl p-5 bg-ink-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">Employer's Use Only</h3>
          <div className="grid grid-cols-2 gap-3">
            <FilledField label="Employer name" value={data.employerName} />
            <FilledField label="Employer address" value={data.employerAddress} />
            <FilledField label="EIN" value={data.employerEIN} />
            <FilledField label="First date of employment" value={data.firstDateOfEmployment} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── I-9 completed view ───────────────────────────────────────────────────────

function I9View({ data, employeeRecord, employerRecord }: {
  data: I9Data;
  employeeRecord: SignatureAuditRecord | undefined;
  employerRecord: SignatureAuditRecord | undefined;
}) {
  const citizenLabels: Record<string, string> = {
    us_citizen: 'A citizen of the United States',
    noncitizen_national: 'A noncitizen national of the United States',
    lawful_permanent_resident: 'A lawful permanent resident',
    authorized_alien: 'An alien authorized to work',
  };

  return (
    <div className="space-y-0 print:shadow-none">
      {/* Header */}
      <div className="rounded-t-xl border border-ink-200 bg-ink-800 text-white p-4 flex items-start justify-between print:rounded-none">
        <div>
          <div className="text-xs text-ink-300 uppercase tracking-wider">U.S. Citizenship and Immigration Services</div>
          <div className="text-lg font-bold mt-0.5">Employment Eligibility Verification</div>
          <div className="text-xs text-ink-300 mt-0.5">Completed and signed electronically per the ESIGN Act.</div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-2xl font-bold">I-9</div>
          <div className="text-xs text-ink-300">OMB 1615-0047</div>
          <div className="text-xs text-ink-300">Expires 07/31/2026</div>
        </div>
      </div>

      <div className="border-x border-b border-ink-200 bg-white print:border-none">
        {/* Section 1 */}
        <div className="border-b border-ink-100">
          <div className="bg-cyan-50 border-b border-ink-100 px-5 py-3">
            <h3 className="font-bold text-ink-800 text-sm">Section 1 — Employee Information and Attestation</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5"><FilledField label="Last name" value={data.lastName} /></div>
              <div className="col-span-5"><FilledField label="First name" value={data.firstName} /></div>
              <div className="col-span-2"><FilledField label="M.I." value={data.middleInitial} /></div>
            </div>
            <FilledField label="Other last names used" value={data.otherLastNames || '—'} />
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8"><FilledField label="Address" value={data.address} /></div>
              <div className="col-span-4"><FilledField label="Apt. Number" value={data.aptNumber || '—'} /></div>
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5"><FilledField label="City" value={data.city} /></div>
              <div className="col-span-2"><FilledField label="State" value={data.state} /></div>
              <div className="col-span-2"><FilledField label="ZIP" value={data.zip} /></div>
              <div className="col-span-3"><FilledField label="Date of birth" value={data.dateOfBirth} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FilledField label="U.S. SSN (last 4)" value={data.ssn ? `XXX-XX-${data.ssn.slice(-4)}` : '—'} />
              <FilledField label="Email" value={data.email || '—'} />
              <FilledField label="Phone" value={data.phone || '—'} />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1">Citizenship / immigration status</div>
              <div className="flex items-center gap-2 rounded border border-ink-200 bg-ink-50 px-3 py-2">
                <div className="h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <span className="text-sm text-ink-800">{citizenLabels[data.citizenshipStatus] ?? data.citizenshipStatus}</span>
              </div>
              {data.citizenshipStatus === 'lawful_permanent_resident' && data.alienRegNumber && (
                <div className="mt-2"><FilledField label="Alien Registration Number" value={data.alienRegNumber} /></div>
              )}
              {data.citizenshipStatus === 'authorized_alien' && (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {data.workAuthorizationExpiration && <FilledField label="Work auth. expiration" value={data.workAuthorizationExpiration} />}
                  {data.uscisNumber && <FilledField label="USCIS A-Number" value={data.uscisNumber} />}
                  {data.i94Number && <FilledField label="I-94 Admission Number" value={data.i94Number} />}
                  {data.foreignPassportNumber && <FilledField label="Foreign Passport Number" value={data.foreignPassportNumber} />}
                  {data.foreignPassportCountry && <FilledField label="Country of issuance" value={data.foreignPassportCountry} />}
                </div>
              )}
            </div>
            <SignatureBlock record={employeeRecord} label="Employee signature — Section 1" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="border-b border-ink-100">
          <div className="bg-ink-50 border-b border-ink-100 px-5 py-3">
            <h3 className="font-bold text-ink-800 text-sm">Section 2 — Employer Review and Verification</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FilledField label="Employee last name" value={data.employeeLastName} />
              <FilledField label="Employee first name" value={data.employeeFirstName} />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-2">Documents presented</div>
              {data.documentListType === 'A' ? (
                <div className="rounded-lg border border-ink-200 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-500">List A Document</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FilledField label="Document title" value={data.listADocument.documentTitle} />
                    <FilledField label="Issuing authority" value={data.listADocument.issuingAuthority} />
                    <FilledField label="Document number" value={data.listADocument.documentNumber} />
                    <FilledField label="Expiration date" value={data.listADocument.expirationDate} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg border border-ink-200 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-500">List B — Identity Document</p>
                    <div className="grid grid-cols-2 gap-3">
                      <FilledField label="Document title" value={data.listBDocument.documentTitle} />
                      <FilledField label="Issuing authority" value={data.listBDocument.issuingAuthority} />
                      <FilledField label="Document number" value={data.listBDocument.documentNumber} />
                      <FilledField label="Expiration date" value={data.listBDocument.expirationDate} />
                    </div>
                  </div>
                  <div className="rounded-lg border border-ink-200 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-500">List C — Employment Authorization</p>
                    <div className="grid grid-cols-2 gap-3">
                      <FilledField label="Document title" value={data.listCDocument.documentTitle} />
                      <FilledField label="Issuing authority" value={data.listCDocument.issuingAuthority} />
                      <FilledField label="Document number" value={data.listCDocument.documentNumber} />
                      <FilledField label="Expiration date" value={data.listCDocument.expirationDate} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <FilledField label="Employee's first day of employment" value={data.employeeFirstDay} />
            <div className="grid grid-cols-2 gap-3">
              <FilledField label="Employer / Rep. title" value={data.employerTitle} />
              <FilledField label="Organization" value={data.employerOrganization} />
              <FilledField label="Employer address" value={data.employerAddress} />
              <FilledField label="City" value={data.employerCity} />
              <FilledField label="State" value={data.employerState} />
              <FilledField label="ZIP" value={data.employerZip} />
            </div>
            <SignatureBlock record={employerRecord} label="Employer / authorized representative signature — Section 2" />
          </div>
        </div>

        <div className="rounded-b-xl p-4 bg-ink-50">
          <p className="text-xs text-ink-400">USCIS Form I-9 · OMB No. 1615-0047 · Expires 07/31/2026 · Completed via Makenna Koffee Employee Portal under ESIGN Act / CA UETA.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompletedFormPage() {
  const params = useParams<{ employeeId: string; docId: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { get: getPacket, update: updatePacket } = usePackets();
  const [allSigs, setAllSigs] = useState<SignatureAuditRecord[]>([]);
  const [employeeRecord, setEmployeeRecord] = useState<SignatureAuditRecord | undefined>();
  const [packetLoaded, setPacketLoaded] = useState(false);
  const [sigsLoaded, setSigsLoaded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  // Pull the packet from Supabase on load so any device can view it
  useEffect(() => {
    supabase
      .from('onboarding_packets')
      .select('*')
      .eq('employee_id', params.employeeId)
      .single()
      .then(({ data }) => {
        if (data) {
          updatePacket(params.employeeId, {
            employeeId: data.employee_id,
            startDate: data.start_date,
            trainerEmployeeId: data.trainer_employee_id ?? undefined,
            tasks: data.tasks ?? [],
            managerSignOff: data.manager_sign_off ?? undefined,
          });
        }
        setPacketLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.employeeId]);

  const packet = getPacket(params.employeeId);
  const task = packet?.tasks.find((t) => t.id === params.docId);

  // Load signatures from Supabase so any device can view the completed form
  useEffect(() => {
    if (!packetLoaded) return;
    setSigsLoaded(false);
    const sigId = task?.signatureRecordId;
    Promise.all([
      sigId ? loadSignatureById(sigId) : Promise.resolve(undefined),
      loadSignaturesForEmployee(params.employeeId),
    ]).then(([empRec, sigs]) => {
      setEmployeeRecord(empRec);
      setAllSigs(sigs);
      setSigsLoaded(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packetLoaded, task?.signatureRecordId, params.employeeId]);

  // Auto-load stored PDF URL if already generated
  useEffect(() => {
    if (task?.pdfStorageUrl) setPdfUrl(task.pdfStorageUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.pdfStorageUrl]);

  if (!packetLoaded || !sigsLoaded) {
    return (
      <AppShell>
        <div className="flex items-center justify-center p-16 text-ink-400 text-sm">Loading completed form…</div>
      </AppShell>
    );
  }

  if (!user || !packet || !task || !task.signed) {
    return (
      <AppShell>
        <div className="p-8">
          <Link href={`/onboarding/${params.employeeId}`} className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700 mb-4">
            <ArrowLeft size={16} /> Back to packet
          </Link>
          <p className="text-ink-400">Form not found or not yet completed.</p>
        </div>
      </AppShell>
    );
  }

  if (!task.formData) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl p-8">
          <Link href={`/onboarding/${params.employeeId}`} className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700 mb-6">
            <ArrowLeft size={16} /> Back to packet
          </Link>
          <div className="rounded-xl border border-ink-200 bg-white p-6 space-y-4">
            <h2 className="font-bold text-ink-800">Form signed (legacy attestation)</h2>
            <p className="text-sm text-ink-500">
              This form was signed before fillable in-app forms were available. The employee completed and returned a physical copy. The electronic signature below confirms their attestation.
            </p>
            {employeeRecord && <SignatureBlock record={employeeRecord} label="Employee signature" />}
            {!employeeRecord && (
              <p className="text-sm text-ink-400 italic">Signature record not found — it may have been signed on a different device before cloud sync was enabled.</p>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  async function handleGeneratePdf() {
    if (!task?.formData) return;
    setPdfLoading(true);
    try {
      const res = await fetch('/api/forms/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: params.employeeId,
          docId: params.docId,
          formData: task.formData,
        }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const { publicUrl } = await res.json();
      // Update local store so the iframe shows immediately
      const updatedTasks = packet!.tasks.map((t) =>
        t.id === params.docId ? { ...t, pdfStorageUrl: publicUrl } : t
      );
      updatePacket(params.employeeId, { tasks: updatedTasks });
      setPdfUrl(publicUrl);
    } catch (err) {
      console.error(err);
      alert('Could not save PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }

  // For I-9: employer's Section 2 signature is a separate record
  const employerRecord = params.docId === 'i9'
    ? allSigs
        .filter((r) => {
          const c = r.context as any;
          return c.docId === 'i9' && c.employeeId === params.employeeId && r.id !== task.signatureRecordId;
        })
        .sort((a, b) => (a.signedAtIso > b.signedAtIso ? 1 : -1))[0]
    : undefined;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href={`/onboarding/${params.employeeId}`}
            className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
          >
            <ArrowLeft size={16} /> Back to packet
          </Link>
          <div className="flex items-center gap-2">
            {!pdfUrl ? (
              <button
                onClick={handleGeneratePdf}
                disabled={pdfLoading}
                className="flex items-center gap-2 rounded-full border border-cyan-400 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 transition disabled:opacity-50"
              >
                <FileText size={15} />
                {pdfLoading ? 'Saving to portal…' : `Generate & save ${params.docId.toUpperCase()} PDF`}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <FileText size={15} /> PDF saved in portal
              </span>
            )}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-full bg-ink-800 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700 transition"
            >
              <Printer size={15} /> Print
            </button>
          </div>
        </div>

        {params.docId === 'w4' && (
          <W4View
            data={task.formData as unknown as W4Data}
            employeeRecord={employeeRecord}
          />
        )}

        {params.docId === 'i9' && (
          <I9View
            data={task.formData as unknown as I9Data}
            employeeRecord={employeeRecord}
            employerRecord={employerRecord}
          />
        )}

        {/* Stored PDF viewer */}
        {pdfUrl && (
          <div className="mt-6 print:hidden">
            <div className="mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Official {params.docId.toUpperCase()} — stored in portal
              </h3>
            </div>
            <div className="rounded-xl overflow-hidden border border-ink-200 shadow-sm">
              <iframe
                src={pdfUrl}
                className="w-full"
                style={{ height: '80vh' }}
                title={`${params.docId.toUpperCase()} — official filled form`}
              />
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
