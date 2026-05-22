'use client';

import type { W4Data } from '@/components/W4Form';

const FILING_STATUS_LABELS: Record<string, string> = {
  single_or_mfs: 'Single or Married filing separately',
  married_jointly: 'Married filing jointly or Qualifying surviving spouse',
  head_of_household: 'Head of household',
};

function Row({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  if (!value && value !== '0') return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-ink-50 last:border-0">
      <span className="text-xs text-ink-500 leading-relaxed shrink-0 max-w-[55%]">{label}</span>
      <span className={`text-sm font-semibold text-ink-800 text-right break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 bg-ink-700 text-white px-4 py-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
        {number}
      </div>
      <div>
        <div className="text-sm font-bold">{title}</div>
        {subtitle && <div className="text-xs text-white/70 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
}

export default function W4FormView({ data, signatureImagePngDataUrl, signedAt, signerName }: {
  data: W4Data;
  signatureImagePngDataUrl?: string;
  signedAt?: string;
  signerName?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-ink-200 text-sm">
      {/* IRS Header */}
      <div className="bg-ink-800 text-white px-5 py-4 flex items-start justify-between">
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider">Department of the Treasury — Internal Revenue Service</div>
          <div className="text-lg font-bold mt-0.5">Employee's Withholding Certificate</div>
          <div className="text-xs text-white/60 mt-0.5">Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay.</div>
        </div>
        <div className="text-right shrink-0 ml-4">
          <div className="text-3xl font-black">W-4</div>
          <div className="text-xs text-white/60">OMB No. 1545-0074</div>
          <div className="text-xs text-white/60">{new Date().getFullYear()}</div>
        </div>
      </div>

      {/* Step 1 — Personal Information */}
      <SectionHeader number="1" title="Personal Information" subtitle="Name, address, and Social Security Number" />
      <div className="px-4 pt-2 pb-3 bg-white divide-y divide-ink-50">
        <Row label="(a) First name" value={data.firstName} />
        <Row label="Middle initial" value={data.middleInitial || '—'} />
        <Row label="Last name" value={data.lastName} />
        <Row label="Social security number" value={data.ssn} mono />
        <Row label="Home address" value={data.address} />
        <Row label="City or town" value={data.city} />
        <Row label="State" value={data.state} />
        <Row label="ZIP code" value={data.zip} />
        <Row label="(c) Filing status" value={FILING_STATUS_LABELS[data.filingStatus] ?? data.filingStatus} />
      </div>

      {/* Step 2 — Multiple Jobs */}
      <SectionHeader number="2" title="Multiple Jobs or Spouse Works" />
      <div className="px-4 pt-2 pb-3 bg-white">
        <Row
          label="Check box: only two jobs total"
          value={data.multipleJobsChecked ? '☑ Checked' : '☐ Not checked'}
        />
      </div>

      {/* Step 3 — Claim Dependents */}
      <SectionHeader number="3" title="Claim Dependents" subtitle="Total income ≤ $200,000 (≤ $400,000 if married jointly)" />
      <div className="px-4 pt-2 pb-3 bg-white divide-y divide-ink-50">
        <Row label="Qualifying children under age 17 (× $2,000)" value={data.qualifyingChildrenAmount ? `$${data.qualifyingChildrenAmount}` : '$0'} />
        <Row label="Other dependents (× $500)" value={data.otherDependentsAmount ? `$${data.otherDependentsAmount}` : '$0'} />
        <Row label="Total (add amounts above)" value={data.dependentsTotalAmount ? `$${data.dependentsTotalAmount}` : '$0'} />
      </div>

      {/* Step 4 — Other Adjustments */}
      <SectionHeader number="4" title="Other Adjustments" subtitle="Optional" />
      <div className="px-4 pt-2 pb-3 bg-white divide-y divide-ink-50">
        <Row label="(a) Other income not from jobs" value={data.otherIncome ? `$${data.otherIncome}` : '$0'} />
        <Row label="(b) Deductions" value={data.deductions ? `$${data.deductions}` : '$0'} />
        <Row label="(c) Extra withholding per pay period" value={data.extraWithholding ? `$${data.extraWithholding}` : '$0'} />
      </div>

      {/* Step 5 — Signature */}
      <SectionHeader number="5" title="Sign Here" />
      <div className="px-4 pt-2 pb-3 bg-white">
        {signatureImagePngDataUrl ? (
          <div>
            <p className="text-xs text-ink-400 mb-1">Employee's signature</p>
            <img src={signatureImagePngDataUrl} alt="Signature" className="h-14 w-auto max-w-xs" />
            {signerName && <p className="text-xs text-ink-600 font-semibold mt-1">{signerName}</p>}
            {signedAt && <p className="text-xs text-ink-400">{signedAt}</p>}
          </div>
        ) : (
          <p className="text-xs text-ink-400 italic">Signature not captured on this record</p>
        )}
      </div>

      {/* Employer Section */}
      <div className="bg-ink-50 border-t border-ink-200 px-4 pt-2 pb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Employer's Use Only</p>
        <div className="divide-y divide-ink-100">
          <Row label="Employer name" value={data.employerName} />
          <Row label="Employer address" value={data.employerAddress || '—'} />
          <Row label="Employer identification number (EIN)" value={data.employerEIN || '—'} mono />
          <Row label="First date of employment" value={data.firstDateOfEmployment} />
        </div>
      </div>
    </div>
  );
}
