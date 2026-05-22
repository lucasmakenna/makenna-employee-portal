'use client';

import type { W4Data } from '@/components/W4Form';

const FILING_STATUS_LABELS: Record<string, string> = {
  single_or_mfs: 'Single or Married filing separately',
  married_jointly: 'Married filing jointly or Qualifying surviving spouse',
  head_of_household: 'Head of household',
};

/** A bordered field box that looks like a filled-in form field */
function FieldBox({ label, value, mono, wide }: { label: string; value?: string | null; mono?: boolean; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <div className="border border-ink-400 rounded-sm min-h-[2rem] px-2 py-1 bg-white">
        <span className={`text-sm ${mono ? 'font-mono' : 'font-medium'} text-ink-900`}>{value || ''}</span>
      </div>
      <p className="text-[10px] text-ink-500 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function CheckBox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-default">
      <div className={`h-4 w-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${checked ? 'border-ink-800 bg-white' : 'border-ink-400 bg-white'}`}>
        {checked && <span className="text-ink-900 text-xs font-bold leading-none">✓</span>}
      </div>
      <span className="text-xs text-ink-700">{label}</span>
    </label>
  );
}

function StepHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-0 bg-ink-900">
      <div className="flex items-center justify-center w-10 self-stretch bg-ink-900 border-r border-white/20">
        <span className="text-white text-base font-black">{number}</span>
      </div>
      <div className="px-3 py-1.5">
        <span className="text-white text-xs font-bold uppercase tracking-wide">{title}</span>
        {subtitle && <span className="text-white/60 text-[10px] ml-2">{subtitle}</span>}
      </div>
    </div>
  );
}

export default function W4FormView({
  data,
  signatureImagePngDataUrl,
  signedAt,
  signerName,
}: {
  data: W4Data;
  signatureImagePngDataUrl?: string;
  signedAt?: string;
  signerName?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-ink-300 bg-white font-sans text-xs">

      {/* ── IRS Header ────────────────────────────────────────────────── */}
      <div className="bg-ink-900 text-white px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">Department of the Treasury — Internal Revenue Service</div>
          <div className="text-base font-black tracking-tight">Employee's Withholding Certificate</div>
          <div className="text-[10px] text-white/60 mt-0.5">Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay.</div>
        </div>
        <div className="text-right shrink-0 border-l border-white/20 pl-4">
          <div className="text-4xl font-black tracking-tighter text-white">W-4</div>
          <div className="text-[10px] text-white/60">OMB No. 1545-0074</div>
          <div className="text-[10px] text-white/60">{new Date().getFullYear()}</div>
        </div>
      </div>

      {/* ── Step 1: Personal Information ───────────────────────────────── */}
      <StepHeader number="1" title="Enter Personal Information" subtitle="(a) Name · (b) SSN · (c) Filing status" />
      <div className="border-b border-ink-200 p-3 space-y-2 bg-white">
        <div className="grid grid-cols-3 gap-2">
          <FieldBox label="(a) First name" value={data.firstName} />
          <FieldBox label="Middle initial" value={data.middleInitial || '—'} />
          <FieldBox label="Last name" value={data.lastName} />
        </div>
        <FieldBox label="Home address (number and street or rural route)" value={data.address} />
        <div className="grid grid-cols-3 gap-2">
          <FieldBox label="City or town" value={data.city} />
          <FieldBox label="State" value={data.state} />
          <FieldBox label="ZIP code" value={data.zip} />
        </div>
        <FieldBox label="(b) Social security number" value={data.ssn} mono />
        <div>
          <p className="text-[10px] text-ink-500 mb-1">(c) Filing status — check only one box</p>
          <div className="space-y-1">
            <CheckBox checked={data.filingStatus === 'single_or_mfs'} label="Single or Married filing separately" />
            <CheckBox checked={data.filingStatus === 'married_jointly'} label="Married filing jointly or Qualifying surviving spouse" />
            <CheckBox checked={data.filingStatus === 'head_of_household'} label="Head of household (Check only if you're unmarried and pay more than half the costs of keeping up a home for yourself and a qualifying individual.)" />
          </div>
        </div>
      </div>

      {/* ── Step 2: Multiple Jobs ───────────────────────────────────────── */}
      <StepHeader number="2" title="Multiple Jobs or Spouse Works" />
      <div className="border-b border-ink-200 p-3 bg-white">
        <CheckBox
          checked={data.multipleJobsChecked}
          label="If there are only two jobs total, you may check this box. Do this for both jobs."
        />
        <p className="text-[10px] text-ink-400 mt-1.5 ml-6">
          If you have more than two jobs or use a different method, see the Multiple Jobs Worksheet on page 3.
        </p>
      </div>

      {/* ── Step 3: Claim Dependents ─────────────────────────────────────── */}
      <StepHeader number="3" title="Claim Dependents" subtitle="Total income ≤ $200,000 (≤ $400,000 MFJ)" />
      <div className="border-b border-ink-200 p-3 space-y-2 bg-white">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-700 flex-1">Multiply the number of qualifying children under age 17 by $2,000</span>
          <div className="w-28 border border-ink-400 rounded-sm px-2 py-1 text-right font-medium">{data.qualifyingChildrenAmount ? `$${data.qualifyingChildrenAmount}` : '$0'}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-700 flex-1">Multiply the number of other dependents by $500</span>
          <div className="w-28 border border-ink-400 rounded-sm px-2 py-1 text-right font-medium">{data.otherDependentsAmount ? `$${data.otherDependentsAmount}` : '$0'}</div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-ink-200">
          <span className="text-[11px] font-bold text-ink-800 flex-1">Add the amounts above and enter the total here</span>
          <div className="w-28 border-2 border-ink-600 rounded-sm px-2 py-1 text-right font-bold">{data.dependentsTotalAmount ? `$${data.dependentsTotalAmount}` : '$0'}</div>
        </div>
      </div>

      {/* ── Step 4: Other Adjustments ────────────────────────────────────── */}
      <StepHeader number="4" title="Other Adjustments" subtitle="Optional" />
      <div className="border-b border-ink-200 p-3 space-y-2 bg-white">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-700 flex-1">(a) Other income (not from jobs). Enter the amount of other income you expect this year that won't have withholding.</span>
          <div className="w-28 border border-ink-400 rounded-sm px-2 py-1 text-right font-medium">{data.otherIncome ? `$${data.otherIncome}` : '$0'}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-700 flex-1">(b) Deductions. If you expect to claim deductions other than the standard deduction, enter the result here.</span>
          <div className="w-28 border border-ink-400 rounded-sm px-2 py-1 text-right font-medium">{data.deductions ? `$${data.deductions}` : '$0'}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-ink-700 flex-1">(c) Extra withholding. Enter any additional tax you want withheld each pay period.</span>
          <div className="w-28 border border-ink-400 rounded-sm px-2 py-1 text-right font-medium">{data.extraWithholding ? `$${data.extraWithholding}` : '$0'}</div>
        </div>
      </div>

      {/* ── Step 5: Signature ─────────────────────────────────────────────── */}
      <StepHeader number="5" title="Sign Here" />
      <div className="border-b border-ink-200 p-3 bg-white">
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[10px] text-amber-800 mb-3">
          <strong>Under penalties of perjury,</strong> I declare that this certificate, to the best of my knowledge and belief, is true, correct, and complete.
        </div>
        <div className="flex items-end gap-6">
          <div className="flex-1">
            <p className="text-[10px] text-ink-500 mb-1">Employee's signature (This form is not valid unless you sign it.)</p>
            <div className="border-b-2 border-ink-700 min-h-[3.5rem] flex items-end pb-1">
              {signatureImagePngDataUrl ? (
                <img src={signatureImagePngDataUrl} alt="Signature" className="h-12 w-auto max-w-[220px]" />
              ) : (
                <span className="text-ink-300 text-xs italic">No signature</span>
              )}
            </div>
            {signerName && <p className="text-[10px] text-ink-500 mt-0.5">{signerName}</p>}
          </div>
          <div className="w-40 shrink-0">
            <p className="text-[10px] text-ink-500 mb-1">Date</p>
            <div className="border-b-2 border-ink-700 pb-1 min-h-[3.5rem] flex items-end">
              <span className="text-xs text-ink-700">{signedAt ?? ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Employer Section ────────────────────────────────────────────── */}
      <div className="bg-ink-50 p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500 mb-2 border-b border-ink-300 pb-1">Employers Only</p>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox label="Employer's name and address" value={[data.employerName, data.employerAddress].filter(Boolean).join(', ')} />
          <FieldBox label="First date of employment" value={data.firstDateOfEmployment} />
          <FieldBox label="Employer identification number (EIN)" value={data.employerEIN || '—'} mono />
        </div>
      </div>
    </div>
  );
}
