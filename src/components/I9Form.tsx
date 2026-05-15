'use client';

import { useState } from 'react';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import { format } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

export type I9CitizenshipStatus =
  | 'us_citizen'
  | 'noncitizen_national'
  | 'lawful_permanent_resident'
  | 'authorized_alien';

export type I9DocumentEntry = {
  documentTitle: string;
  issuingAuthority: string;
  documentNumber: string;
  expirationDate: string;
};

export type I9Data = {
  // Section 1 — Employee
  lastName: string;
  firstName: string;
  middleInitial: string;
  otherLastNames: string;
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  zip: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  phone: string;
  citizenshipStatus: I9CitizenshipStatus;
  alienRegNumber: string; // for LPR
  uscisNumber: string;    // for authorized alien
  i94Number: string;
  foreignPassportNumber: string;
  foreignPassportCountry: string;
  workAuthorizationExpiration: string;
  // Section 2 — Employer
  documentListType: 'A' | 'BC';
  listADocument: I9DocumentEntry;
  listBDocument: I9DocumentEntry;
  listCDocument: I9DocumentEntry;
  employeeFirstName: string;
  employeeLastName: string;
  employeeFirstDay: string;
  employerTitle: string;
  employerOrganization: string;
  employerAddress: string;
  employerCity: string;
  employerState: string;
  employerZip: string;
};

export type I9Signatures = {
  employee: SignaturePadResult;
  employer: SignaturePadResult;
};

interface I9FormProps {
  employeeName: string;
  defaultFirstDay?: string;
  currentUserName: string;
  onSubmit: (data: I9Data, signatures: I9Signatures) => Promise<void>;
  onCancel: () => void;
}

// ─── Common sub-components ────────────────────────────────────────────────────

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

function TextInput({ value, onChange, placeholder, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
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

function DocumentFields({ label, value, onChange }: {
  label: string;
  value: I9DocumentEntry;
  onChange: (v: I9DocumentEntry) => void;
}) {
  return (
    <div className="rounded-lg border border-ink-200 p-4 bg-white space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-500">{label}</p>
      <Field label="Document title">
        <TextInput value={value.documentTitle} onChange={(v) => onChange({ ...value, documentTitle: v })} placeholder="e.g., U.S. Passport" />
      </Field>
      <Field label="Issuing authority">
        <TextInput value={value.issuingAuthority} onChange={(v) => onChange({ ...value, issuingAuthority: v })} placeholder="e.g., U.S. Department of State" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Document number">
          <TextInput value={value.documentNumber} onChange={(v) => onChange({ ...value, documentNumber: v })} placeholder="Document #" />
        </Field>
        <Field label="Expiration date">
          <TextInput value={value.expirationDate} onChange={(v) => onChange({ ...value, expirationDate: v })} placeholder="MM/DD/YYYY" />
        </Field>
      </div>
    </div>
  );
}

const emptyDoc: I9DocumentEntry = { documentTitle: '', issuingAuthority: '', documentNumber: '', expirationDate: '' };

// ─── Main component ───────────────────────────────────────────────────────────

export default function I9Form({ employeeName, defaultFirstDay, currentUserName, onSubmit, onCancel }: I9FormProps) {
  const [data, setData] = useState<I9Data>({
    lastName: '', firstName: '', middleInitial: '', otherLastNames: '',
    address: '', aptNumber: '', city: '', state: 'CA', zip: '',
    dateOfBirth: '', ssn: '', email: '', phone: '',
    citizenshipStatus: 'us_citizen',
    alienRegNumber: '', uscisNumber: '', i94Number: '',
    foreignPassportNumber: '', foreignPassportCountry: '',
    workAuthorizationExpiration: '',
    documentListType: 'A',
    listADocument: { ...emptyDoc },
    listBDocument: { ...emptyDoc },
    listCDocument: { ...emptyDoc },
    employeeFirstName: employeeName.split(' ')[0] ?? '',
    employeeLastName: employeeName.split(' ').slice(1).join(' ') ?? '',
    employeeFirstDay: defaultFirstDay ?? '',
    employerTitle: '',
    employerOrganization: 'Makenna Koffee Company',
    employerAddress: '',
    employerCity: '',
    employerState: 'CA',
    employerZip: '',
  });

  const [employeeSignature, setEmployeeSignature] = useState<SignaturePadResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [section1Done, setSection1Done] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const set = (field: keyof I9Data, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const validateSection1 = () => {
    const e: string[] = [];
    if (!data.firstName.trim()) e.push('First name is required');
    if (!data.lastName.trim()) e.push('Last name is required');
    if (!data.address.trim()) e.push('Address is required');
    if (!data.city.trim()) e.push('City is required');
    if (!data.zip.trim()) e.push('ZIP code is required');
    if (!data.dateOfBirth.trim()) e.push('Date of birth is required');
    if (data.citizenshipStatus === 'lawful_permanent_resident' && !data.alienRegNumber.trim())
      e.push('Alien Registration Number is required for Lawful Permanent Residents');
    setErrors(e);
    return e.length === 0;
  };

  const handleEmployeeSign = (result: SignaturePadResult) => {
    if (!validateSection1()) return;
    setEmployeeSignature(result);
    setSection1Done(true);
    setErrors([]);
  };

  const handleEmployerSign = async (result: SignaturePadResult) => {
    if (!employeeSignature) return;
    setSubmitting(true);
    try {
      await onSubmit(data, { employee: employeeSignature, employer: result });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="rounded-t-xl border border-ink-200 bg-ink-800 text-white p-4 flex items-start justify-between">
        <div>
          <div className="text-xs text-ink-300 uppercase tracking-wider">U.S. Citizenship and Immigration Services</div>
          <div className="text-lg font-bold mt-0.5">Employment Eligibility Verification</div>
          <div className="text-xs text-ink-300 mt-0.5">Anti-Discrimination Notice: It is illegal to discriminate against work-authorized individuals.</div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-2xl font-bold">I-9</div>
          <div className="text-xs text-ink-300">OMB 1615-0047</div>
          <div className="text-xs text-ink-300">Expires 07/31/2026</div>
        </div>
      </div>

      {/* Section 1 */}
      <div className={`border-x border-ink-200 bg-white ${section1Done ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="border-b border-ink-200 bg-cyan-50 px-5 py-3 flex items-center justify-between">
          <h3 className="font-bold text-ink-800 text-sm">Section 1 — Employee Information and Attestation</h3>
          {section1Done && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Signed ✓</span>
          )}
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs text-ink-500">Employees must complete and sign Section 1 no later than their first day of employment.</p>

          {/* Name row */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5">
              <Field label="Last name (Family name)" required>
                <TextInput value={data.lastName} onChange={(v) => set('lastName', v)} placeholder="Last name" />
              </Field>
            </div>
            <div className="col-span-5">
              <Field label="First name (Given name)" required>
                <TextInput value={data.firstName} onChange={(v) => set('firstName', v)} placeholder="First name" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="M.I.">
                <TextInput value={data.middleInitial} onChange={(v) => set('middleInitial', v.slice(0, 1).toUpperCase())} placeholder="M" />
              </Field>
            </div>
          </div>

          <Field label="Other last names used (if any)">
            <TextInput value={data.otherLastNames} onChange={(v) => set('otherLastNames', v)} placeholder="Leave blank if none" />
          </Field>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8">
              <Field label="Address (Street Number and Name)" required>
                <TextInput value={data.address} onChange={(v) => set('address', v)} placeholder="Street address" />
              </Field>
            </div>
            <div className="col-span-4">
              <Field label="Apt. Number">
                <TextInput value={data.aptNumber} onChange={(v) => set('aptNumber', v)} placeholder="Optional" />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5">
              <Field label="City or Town" required>
                <TextInput value={data.city} onChange={(v) => set('city', v)} placeholder="City" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="State">
                <TextInput value={data.state} onChange={(v) => set('state', v.toUpperCase().slice(0, 2))} placeholder="CA" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="ZIP Code" required>
                <TextInput value={data.zip} onChange={(v) => set('zip', v.replace(/\D/g, '').slice(0, 5))} placeholder="90210" />
              </Field>
            </div>
            <div className="col-span-3">
              <Field label="Date of Birth (MM/DD/YYYY)" required>
                <TextInput value={data.dateOfBirth} onChange={(v) => set('dateOfBirth', v)} placeholder="01/01/2000" />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="U.S. Social Security Number" note="Optional but recommended">
              <TextInput value={data.ssn} onChange={(v) => set('ssn', v)} placeholder="XXX-XX-XXXX" className="font-mono tracking-widest" />
            </Field>
            <Field label="Employee's Email Address" note="Optional">
              <TextInput value={data.email} onChange={(v) => set('email', v)} placeholder="you@email.com" />
            </Field>
            <Field label="Employee's Telephone Number" note="Optional">
              <TextInput value={data.phone} onChange={(v) => set('phone', v)} placeholder="(555) 555-5555" />
            </Field>
          </div>

          {/* Attestation */}
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-2">
              I attest, under penalty of perjury, that I am (check one of the following boxes): <span className="text-hibiscus-500">*</span>
            </label>
            <div className="space-y-3">
              {([
                ['us_citizen', 'A citizen of the United States', null],
                ['noncitizen_national', 'A noncitizen national of the United States (See instructions)', null],
                ['lawful_permanent_resident', 'A lawful permanent resident', 'alienRegNumber'],
                ['authorized_alien', 'An alien authorized to work', 'workAuthorizationExpiration'],
              ] as [I9CitizenshipStatus, string, keyof I9Data | null][]).map(([val, label, extraField]) => (
                <div key={val}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition flex-shrink-0 ${data.citizenshipStatus === val ? 'border-cyan-500 bg-cyan-500' : 'border-ink-300 group-hover:border-cyan-400'}`}>
                      {data.citizenshipStatus === val && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <input type="radio" className="sr-only" checked={data.citizenshipStatus === val} onChange={() => set('citizenshipStatus', val)} />
                    <span className="text-sm text-ink-700">{label}</span>
                  </label>
                  {data.citizenshipStatus === val && extraField === 'alienRegNumber' && (
                    <div className="ml-8 mt-2">
                      <Field label="Alien Registration Number / USCIS Number" required>
                        <TextInput value={data.alienRegNumber} onChange={(v) => set('alienRegNumber', v)} placeholder="A-Number" />
                      </Field>
                    </div>
                  )}
                  {data.citizenshipStatus === val && extraField === 'workAuthorizationExpiration' && (
                    <div className="ml-8 mt-2 grid grid-cols-2 gap-3">
                      <Field label="Work authorization expiration date" required>
                        <TextInput value={data.workAuthorizationExpiration} onChange={(v) => set('workAuthorizationExpiration', v)} placeholder="MM/DD/YYYY or N/A" />
                      </Field>
                      <Field label="USCIS A-Number (if applicable)">
                        <TextInput value={data.uscisNumber} onChange={(v) => set('uscisNumber', v)} placeholder="A-Number" />
                      </Field>
                      <Field label="Form I-94 Admission Number (if applicable)">
                        <TextInput value={data.i94Number} onChange={(v) => set('i94Number', v)} placeholder="I-94 Number" />
                      </Field>
                      <Field label="Foreign Passport Number (if applicable)">
                        <TextInput value={data.foreignPassportNumber} onChange={(v) => set('foreignPassportNumber', v)} placeholder="Passport #" />
                      </Field>
                      {data.foreignPassportNumber && (
                        <Field label="Country of Issuance">
                          <TextInput value={data.foreignPassportCountry} onChange={(v) => set('foreignPassportCountry', v)} placeholder="Country" />
                        </Field>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="rounded-lg bg-hibiscus-50 border border-hibiscus-200 p-3">
              <p className="text-xs font-semibold text-hibiscus-700 mb-1">Please fix the following before signing:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((e, i) => <li key={i} className="text-xs text-hibiscus-600">{e}</li>)}
              </ul>
            </div>
          )}

          {/* Employee signature */}
          <div className="border-t border-ink-200 pt-4">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-800">
              <strong>Signature of Employee:</strong> I attest, under penalty of perjury, that I am aware that federal law provides for imprisonment and/or fines for false statements or use of false documents in connection with the completion of this form.
            </div>
            <div className="flex items-center justify-between text-xs text-ink-500 mb-3">
              <span>Employee's signature</span>
              <span>Today's date: {format(new Date(), 'MM/dd/yyyy')}</span>
            </div>
            <SignaturePad onSubmit={handleEmployeeSign} signerName={employeeName} />
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className={`border-x border-b border-ink-200 bg-white ${!section1Done ? 'opacity-40 pointer-events-none' : ''}`}>
        <div className="border-b border-ink-200 bg-ink-50 px-5 py-3">
          <h3 className="font-bold text-ink-800 text-sm">Section 2 — Employer or Authorized Representative Review and Verification</h3>
          <p className="text-xs text-ink-500 mt-0.5">Employers or their authorized representative must complete and sign Section 2 within 3 business days of the employee's first day of employment.</p>
        </div>
        <div className="p-5 space-y-4">
          {!section1Done && (
            <p className="text-sm text-ink-400 italic">Complete and sign Section 1 first.</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Employee Last Name">
              <TextInput value={data.employeeLastName} onChange={(v) => set('employeeLastName', v)} placeholder="Last name" />
            </Field>
            <Field label="Employee First Name">
              <TextInput value={data.employeeFirstName} onChange={(v) => set('employeeFirstName', v)} placeholder="First name" />
            </Field>
          </div>

          {/* Document list selector */}
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-2">
              The employee presented: <span className="text-hibiscus-500">*</span>
            </label>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition ${data.documentListType === 'A' ? 'border-cyan-400 bg-cyan-50' : 'border-ink-200 hover:border-ink-300'}`}>
                <input type="radio" className="sr-only" checked={data.documentListType === 'A'} onChange={() => set('documentListType', 'A')} />
                <div className="text-center">
                  <div className="font-bold text-sm text-ink-800">List A Document</div>
                  <div className="text-xs text-ink-500 mt-0.5">Establishes both identity and employment authorization<br/>(e.g., U.S. Passport, Permanent Resident Card)</div>
                </div>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition ${data.documentListType === 'BC' ? 'border-cyan-400 bg-cyan-50' : 'border-ink-200 hover:border-ink-300'}`}>
                <input type="radio" className="sr-only" checked={data.documentListType === 'BC'} onChange={() => set('documentListType', 'BC')} />
                <div className="text-center">
                  <div className="font-bold text-sm text-ink-800">List B + List C Documents</div>
                  <div className="text-xs text-ink-500 mt-0.5">Identity (e.g., Driver's License) + Employment Authorization<br/>(e.g., Social Security Card)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Document details */}
          {data.documentListType === 'A' ? (
            <DocumentFields
              label="List A Document"
              value={data.listADocument}
              onChange={(v) => setData((prev) => ({ ...prev, listADocument: v }))}
            />
          ) : (
            <div className="space-y-3">
              <DocumentFields
                label="List B — Identity Document (e.g., Driver's License, State ID)"
                value={data.listBDocument}
                onChange={(v) => setData((prev) => ({ ...prev, listBDocument: v }))}
              />
              <DocumentFields
                label="List C — Employment Authorization (e.g., Social Security Card, Birth Certificate)"
                value={data.listCDocument}
                onChange={(v) => setData((prev) => ({ ...prev, listCDocument: v }))}
              />
            </div>
          )}

          <Field label="Employee's first day of employment">
            <TextInput value={data.employeeFirstDay} onChange={(v) => set('employeeFirstDay', v)} placeholder="MM/DD/YYYY" />
          </Field>

          {/* Employer info */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title of Employer / Authorized Representative">
              <TextInput value={data.employerTitle} onChange={(v) => set('employerTitle', v)} placeholder="e.g., Store Manager" />
            </Field>
            <Field label="Organization Name">
              <TextInput value={data.employerOrganization} onChange={(v) => set('employerOrganization', v)} placeholder="Makenna Koffee Company" />
            </Field>
            <Field label="Employer Address">
              <TextInput value={data.employerAddress} onChange={(v) => set('employerAddress', v)} placeholder="Street address" />
            </Field>
            <Field label="City">
              <TextInput value={data.employerCity} onChange={(v) => set('employerCity', v)} placeholder="City" />
            </Field>
            <Field label="State">
              <TextInput value={data.employerState} onChange={(v) => set('employerState', v.toUpperCase().slice(0, 2))} placeholder="CA" />
            </Field>
            <Field label="ZIP Code">
              <TextInput value={data.employerZip} onChange={(v) => set('employerZip', v.replace(/\D/g, '').slice(0, 5))} placeholder="90210" />
            </Field>
          </div>

          {/* Employer signature */}
          <div className="border-t border-ink-200 pt-4">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-800">
              <strong>Certification:</strong> I attest, under penalty of perjury, that (1) I have examined the document(s) presented by the above-named employee, (2) the above-listed document(s) appear to be genuine and to relate to the employee named, and (3) to the best of my knowledge the employee is authorized to work in the United States.
            </div>
            <div className="flex items-center justify-between text-xs text-ink-500 mb-3">
              <span>Signature of Employer or Authorized Representative</span>
              <span>Today's date: {format(new Date(), 'MM/dd/yyyy')}</span>
            </div>
            <SignaturePad onSubmit={handleEmployerSign} signerName={currentUserName} />
          </div>
        </div>
      </div>

      <div className="rounded-b-xl border-x border-b border-ink-200 bg-ink-50 px-5 py-3">
        <p className="text-xs text-ink-400">
          USCIS Form I-9 · OMB No. 1615-0047 · Expires 07/31/2026 · For information, see the I-9 Central website at <span className="text-cyan-600">I-9Central.uscis.gov</span>
        </p>
      </div>

      <div className="pt-3">
        <button onClick={onCancel} className="text-sm text-ink-400 hover:text-ink-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
