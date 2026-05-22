'use client';

import { useState, useRef } from 'react';
import { FileText } from 'lucide-react';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import { format } from 'date-fns';

export type W4Data = {
  firstName: string;
  middleInitial: string;
  lastName: string;
  ssn: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  filingStatus: 'single_or_mfs' | 'married_jointly' | 'head_of_household';
  multipleJobsChecked: boolean;
  qualifyingChildrenAmount: string;
  otherDependentsAmount: string;
  dependentsTotalAmount: string;
  otherIncome: string;
  deductions: string;
  extraWithholding: string;
  // Employer section (filled by HR/admin)
  employerName: string;
  employerAddress: string;
  employerEIN: string;
  firstDateOfEmployment: string;
};

interface W4FormProps {
  employeeName: string;
  defaultFirstDateOfEmployment?: string;
  onSubmit: (data: W4Data, signature: SignaturePadResult) => Promise<void>;
  onCancel: () => void;
}

const FILING_STATUS_LABELS = {
  single_or_mfs: 'Single or Married filing separately',
  married_jointly: 'Married filing jointly or Qualifying surviving spouse',
  head_of_household: 'Head of household',
};

function Field({ label, children, required, note }: { label: string; children: React.ReactNode; required?: boolean; note?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-600 mb-1">
        {label}{required && <span className="text-hibiscus-500 ml-0.5">*</span>}
      </label>
      {children}
      {note && <p className="mt-1 text-xs text-ink-400">{note}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 placeholder-ink-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 ${className}`}
    />
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

function formatSSN(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export default function W4Form({ employeeName, defaultFirstDateOfEmployment, onSubmit, onCancel }: W4FormProps) {
  const [data, setData] = useState<W4Data>({
    firstName: '',
    middleInitial: '',
    lastName: '',
    ssn: '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    filingStatus: 'single_or_mfs',
    multipleJobsChecked: false,
    qualifyingChildrenAmount: '',
    otherDependentsAmount: '',
    dependentsTotalAmount: '',
    otherIncome: '',
    deductions: '',
    extraWithholding: '',
    employerName: 'Makenna Koffee Company',
    employerAddress: '',
    employerEIN: '',
    firstDateOfEmployment: defaultFirstDateOfEmployment ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof W4Data, string>>>({});
  const [previewLoading, setPreviewLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof W4Data, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Partial<Record<keyof W4Data, string>> = {};
    if (!data.firstName.trim()) e.firstName = 'Required';
    if (!data.lastName.trim()) e.lastName = 'Required';
    if (!data.ssn.trim() || data.ssn.replace(/\D/g, '').length !== 9) e.ssn = 'Enter a valid 9-digit SSN';
    if (!data.address.trim()) e.address = 'Required';
    if (!data.city.trim()) e.city = 'Required';
    if (!data.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSign = async (result: SignaturePadResult) => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(data, result);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = async () => {
    if (!validate()) return;
    setPreviewLoading(true);
    try {
      const res = await fetch('/api/forms/pdf/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: 'w4', formData: data }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      // silently fail
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div ref={formRef} className="space-y-0">
      {/* IRS Form Header */}
      <div className="rounded-t-xl border border-ink-200 bg-ink-800 text-white p-4 flex items-start justify-between">
        <div>
          <div className="text-xs text-ink-300 uppercase tracking-wider">Department of the Treasury — Internal Revenue Service</div>
          <div className="text-lg font-bold mt-0.5">Employee's Withholding Certificate</div>
          <div className="text-xs text-ink-300 mt-0.5">Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay.</div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-2xl font-bold">W-4</div>
          <div className="text-xs text-ink-300">OMB No. 1545-0074</div>
          <div className="text-xs text-ink-300">{new Date().getFullYear()}</div>
        </div>
      </div>

      <div className="border-x border-ink-200 bg-white">
        {/* Step 1 */}
        <div className="border-b border-ink-200 p-5">
          <SectionHeader
            number="1"
            title="Enter Personal Information"
            subtitle="Your name, address, and Social Security Number"
          />
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <Field label="(a) First name" required>
                  <TextInput value={data.firstName} onChange={(v) => set('firstName', v)} placeholder="First name" />
                  {errors.firstName && <p className="text-xs text-hibiscus-500 mt-0.5">{errors.firstName}</p>}
                </Field>
              </div>
              <div className="col-span-1">
                <Field label="M.I.">
                  <TextInput value={data.middleInitial} onChange={(v) => set('middleInitial', v.slice(0, 1).toUpperCase())} placeholder="M" />
                </Field>
              </div>
              <div className="col-span-6">
                <Field label="Last name" required>
                  <TextInput value={data.lastName} onChange={(v) => set('lastName', v)} placeholder="Last name" />
                  {errors.lastName && <p className="text-xs text-hibiscus-500 mt-0.5">{errors.lastName}</p>}
                </Field>
              </div>
            </div>

            <Field label="Social security number" required note="For privacy, this is stored securely. You must enter it in full for tax withholding.">
              <TextInput
                value={data.ssn}
                onChange={(v) => set('ssn', formatSSN(v))}
                placeholder="XXX-XX-XXXX"
                className="font-mono tracking-widest"
              />
              {errors.ssn && <p className="text-xs text-hibiscus-500 mt-0.5">{errors.ssn}</p>}
            </Field>

            <Field label="Home address (number and street or rural route)" required>
              <TextInput value={data.address} onChange={(v) => set('address', v)} placeholder="Street address" />
              {errors.address && <p className="text-xs text-hibiscus-500 mt-0.5">{errors.address}</p>}
            </Field>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <Field label="City or town" required>
                  <TextInput value={data.city} onChange={(v) => set('city', v)} placeholder="City" />
                  {errors.city && <p className="text-xs text-hibiscus-500 mt-0.5">{errors.city}</p>}
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="State">
                  <TextInput value={data.state} onChange={(v) => set('state', v.toUpperCase().slice(0, 2))} placeholder="CA" />
                </Field>
              </div>
              <div className="col-span-4">
                <Field label="ZIP code" required>
                  <TextInput value={data.zip} onChange={(v) => set('zip', v.replace(/\D/g, '').slice(0, 5))} placeholder="90210" />
                  {errors.zip && <p className="text-xs text-hibiscus-500 mt-0.5">{errors.zip}</p>}
                </Field>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-2">
                (c) Filing status <span className="text-hibiscus-500">*</span>
              </label>
              <div className="space-y-2">
                {(Object.entries(FILING_STATUS_LABELS) as [W4Data['filingStatus'], string][]).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition flex-shrink-0 ${data.filingStatus === val ? 'border-cyan-500 bg-cyan-500' : 'border-ink-300 group-hover:border-cyan-400'}`}>
                      {data.filingStatus === val && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <input
                      type="radio"
                      className="sr-only"
                      checked={data.filingStatus === val}
                      onChange={() => set('filingStatus', val)}
                    />
                    <span className="text-sm text-ink-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="border-b border-ink-200 p-5">
          <SectionHeader
            number="2"
            title="Multiple Jobs or Spouse Works"
            subtitle="Complete this step if you hold more than one job at a time, or are married filing jointly and your spouse also works."
          />
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${data.multipleJobsChecked ? 'border-cyan-500 bg-cyan-500' : 'border-ink-300 group-hover:border-cyan-400'}`}>
              {data.multipleJobsChecked && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={data.multipleJobsChecked}
              onChange={(e) => set('multipleJobsChecked', e.target.checked)}
            />
            <div>
              <span className="text-sm font-semibold text-ink-700">Check this box if there are only two jobs total.</span>
              <p className="text-xs text-ink-500 mt-0.5">
                Do this for both jobs. Your withholding will be most accurate if you complete Step 3 on the W-4 for the highest paying job and leave Step 3 blank on the other(s).
              </p>
            </div>
          </label>
          <p className="mt-3 text-xs text-ink-400 bg-ink-50 rounded-lg p-3">
            If you have three or more jobs, or the Step 2 checkbox isn't used, use the Multiple Jobs Worksheet on page 3 of the official W-4 (available at IRS.gov/W4) to calculate an amount for Step 4(c).
          </p>
        </div>

        {/* Step 3 */}
        <div className="border-b border-ink-200 p-5">
          <SectionHeader
            number="3"
            title="Claim Dependents"
            subtitle="If your total income will be $200,000 or less ($400,000 or less if married filing jointly):"
          />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-ink-700">Qualifying children under age 17 — multiply number of children by <strong>$2,000</strong></p>
              </div>
              <div className="w-32">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input
                    type="text"
                    value={data.qualifyingChildrenAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      set('qualifyingChildrenAmount', val);
                    }}
                    placeholder="0"
                    className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-7 pr-3 text-sm text-right font-mono text-ink-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-ink-700">Other dependents — multiply number by <strong>$500</strong></p>
              </div>
              <div className="w-32">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input
                    type="text"
                    value={data.otherDependentsAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      set('otherDependentsAmount', val);
                    }}
                    placeholder="0"
                    className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-7 pr-3 text-sm text-right font-mono text-ink-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-ink-100 pt-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-700">Add the amounts above and enter the total here</p>
              </div>
              <div className="w-32">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input
                    type="text"
                    value={data.dependentsTotalAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      set('dependentsTotalAmount', val);
                    }}
                    placeholder="0"
                    className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-7 pr-3 text-sm text-right font-mono font-bold text-ink-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="border-b border-ink-200 p-5">
          <SectionHeader
            number="4"
            title="Other Adjustments (optional)"
            subtitle="Make these adjustments only if you expect to have a nonwage income or want additional withholding."
          />
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm text-ink-700 font-medium">(a) Other income (not from jobs)</p>
                <p className="text-xs text-ink-500">If you want tax withheld for other income you expect this year that won't have withholding, enter the amount. This may include interest, dividends, and retirement income.</p>
              </div>
              <div className="w-32 flex-shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input type="text" value={data.otherIncome} onChange={(e) => set('otherIncome', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-7 pr-3 text-sm text-right font-mono text-ink-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm text-ink-700 font-medium">(b) Deductions</p>
                <p className="text-xs text-ink-500">If you expect to claim deductions other than the standard deduction and want to reduce your withholding, use the Deductions Worksheet on page 3 of the official W-4 and enter the result here.</p>
              </div>
              <div className="w-32 flex-shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input type="text" value={data.deductions} onChange={(e) => set('deductions', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-7 pr-3 text-sm text-right font-mono text-ink-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm text-ink-700 font-medium">(c) Extra withholding</p>
                <p className="text-xs text-ink-500">Enter any additional tax you want withheld each pay period.</p>
              </div>
              <div className="w-32 flex-shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input type="text" value={data.extraWithholding} onChange={(e) => set('extraWithholding', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-7 pr-3 text-sm text-right font-mono text-ink-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 — Sign Here */}
        <div className="border-b border-ink-200 p-5">
          <SectionHeader
            number="5"
            title="Sign Here"
          />
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-800">
            <strong>Under penalties of perjury,</strong> I declare that this certificate, to the best of my knowledge and belief, is true, correct, and complete.
          </div>
          <div className="flex items-center justify-between text-xs text-ink-500 mb-3">
            <span>Employee's signature</span>
            <span>Date: {format(new Date(), 'MM/dd/yyyy')}</span>
          </div>
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-ink-50 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 transition mb-4 disabled:opacity-50"
          >
            <FileText size={15} />
            {previewLoading ? 'Generating…' : 'Preview filled PDF'}
          </button>
          <SignaturePad onSubmit={handleSign} signerName={employeeName} />
          {Object.keys(errors).length > 0 && (
            <div className="mt-3 rounded-xl border border-hibiscus-300 bg-hibiscus-50 px-4 py-3">
              <p className="text-sm font-semibold text-hibiscus-700 mb-1">Complete these fields before signing:</p>
              <ul className="space-y-0.5">
                {errors.firstName && <li className="text-xs text-hibiscus-600">• First name</li>}
                {errors.lastName && <li className="text-xs text-hibiscus-600">• Last name</li>}
                {errors.ssn && <li className="text-xs text-hibiscus-600">• Social Security Number (9 digits)</li>}
                {errors.address && <li className="text-xs text-hibiscus-600">• Home address</li>}
                {errors.city && <li className="text-xs text-hibiscus-600">• City</li>}
                {errors.zip && <li className="text-xs text-hibiscus-600">• ZIP code</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Employer Section */}
        <div className="rounded-b-xl p-5 bg-ink-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">Employer's Use Only</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Employer's name and address">
              <TextInput value={data.employerName} onChange={(v) => set('employerName', v)} placeholder="Employer name" />
            </Field>
            <Field label="Employer's address">
              <TextInput value={data.employerAddress} onChange={(v) => set('employerAddress', v)} placeholder="Address" />
            </Field>
            <Field label="Employer identification number (EIN)">
              <TextInput value={data.employerEIN} onChange={(v) => set('employerEIN', v)} placeholder="XX-XXXXXXX" />
            </Field>
            <Field label="First date of employment">
              <TextInput value={data.firstDateOfEmployment} onChange={(v) => set('firstDateOfEmployment', v)} placeholder="MM/DD/YYYY" />
            </Field>
          </div>
        </div>
      </div>

      <div className="pt-3">
        <button onClick={onCancel} className="text-sm text-ink-400 hover:text-ink-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
