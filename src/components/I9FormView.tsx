'use client';

import type { I9Data, I9DocumentEntry } from '@/components/I9Form';

const CITIZENSHIP_LABELS: Record<string, string> = {
  us_citizen: 'A citizen of the United States',
  noncitizen_national: 'A noncitizen national of the United States (See instructions)',
  lawful_permanent_resident: 'A lawful permanent resident',
  authorized_alien: 'An alien authorized to work until (expiration date, if applicable)',
};

function FieldBox({ label, value, mono, span2 }: { label: string; value?: string | null; mono?: boolean; span2?: boolean }) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <div className="border border-ink-400 rounded-sm min-h-[2rem] px-2 py-1 bg-white">
        <span className={`text-sm ${mono ? 'font-mono' : 'font-medium'} text-ink-900`}>{value || ''}</span>
      </div>
      <p className="text-[10px] text-ink-500 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function RadioBox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <label className="flex items-start gap-2 cursor-default">
      <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'border-ink-800' : 'border-ink-400'}`}>
        {checked && <div className="h-2 w-2 rounded-full bg-ink-900" />}
      </div>
      <span className="text-[11px] text-ink-700 leading-snug">{label}</span>
    </label>
  );
}

function SectionBanner({ section, title, note }: { section: string; title: string; note?: string }) {
  return (
    <div className="bg-ink-900 text-white px-3 py-2 flex items-center gap-3">
      <div className="shrink-0 bg-white/20 rounded px-2 py-0.5 text-xs font-black">Section {section}</div>
      <div>
        <span className="text-xs font-bold">{title}</span>
        {note && <span className="text-[10px] text-white/60 ml-2">{note}</span>}
      </div>
    </div>
  );
}

function DocBlock({ label, doc }: { label: string; doc: I9DocumentEntry }) {
  if (!doc.documentTitle) return null;
  return (
    <div className="border border-ink-300 rounded p-2 space-y-1.5 bg-white">
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-600 border-b border-ink-200 pb-1">{label}</p>
      <FieldBox label="Document title" value={doc.documentTitle} />
      <FieldBox label="Issuing authority" value={doc.issuingAuthority} />
      <div className="grid grid-cols-2 gap-1.5">
        <FieldBox label="Document number" value={doc.documentNumber} mono />
        <FieldBox label="Expiration date" value={doc.expirationDate || 'N/A'} />
      </div>
    </div>
  );
}

export default function I9FormView({
  data,
  employeeSignatureUrl,
  employerSignatureUrl,
  employeeSignedAt,
  employerSignedAt,
  employeeName,
  employerName,
}: {
  data: I9Data;
  employeeSignatureUrl?: string;
  employerSignatureUrl?: string;
  employeeSignedAt?: string;
  employerSignedAt?: string;
  employeeName?: string;
  employerName?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-ink-300 bg-white font-sans text-xs">

      {/* ── USCIS Header ───────────────────────────────────────────────── */}
      <div className="bg-ink-900 text-white px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">U.S. Citizenship and Immigration Services</div>
          <div className="text-base font-black tracking-tight">Employment Eligibility Verification</div>
          <div className="text-[10px] text-white/60 mt-0.5">Department of Homeland Security</div>
        </div>
        <div className="text-right shrink-0 border-l border-white/20 pl-4">
          <div className="text-4xl font-black tracking-tighter">I-9</div>
          <div className="text-[10px] text-white/60">OMB No. 1615-0047</div>
        </div>
      </div>

      {/* ── Section 1: Employee ─────────────────────────────────────────── */}
      <SectionBanner
        section="1"
        title="Employee Information and Attestation"
        note="Complete no later than first day of employment."
      />

      <div className="p-3 space-y-2 border-b border-ink-200 bg-white">
        <div className="grid grid-cols-3 gap-2">
          <FieldBox label="Last Name (Family Name)" value={data.lastName} />
          <FieldBox label="First Name (Given Name)" value={data.firstName} />
          <FieldBox label="Middle Initial" value={data.middleInitial || 'N/A'} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox label="Other Last Names Used (if any)" value={data.otherLastNames || 'N/A'} />
          <FieldBox label="Date of Birth (MM/DD/YYYY)" value={data.dateOfBirth} />
        </div>
        <FieldBox label="Address (Street Number and Name)" value={data.address} />
        <div className="grid grid-cols-4 gap-2">
          <FieldBox label="Apt. Number" value={data.aptNumber || 'N/A'} />
          <FieldBox label="City or Town" value={data.city} />
          <FieldBox label="State" value={data.state} />
          <FieldBox label="ZIP Code" value={data.zip} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <FieldBox label="U.S. Social Security Number" value={data.ssn} mono />
          <FieldBox label="Employee's Email Address" value={data.email || 'N/A'} />
          <FieldBox label="Employee's Telephone Number" value={data.phone || 'N/A'} />
        </div>

        {/* Citizenship attestation */}
        <div className="border border-ink-200 rounded p-2 bg-ink-50/30">
          <p className="text-[10px] font-bold text-ink-600 uppercase tracking-wide mb-1.5">
            I attest, under penalty of perjury, that I am (check one of the following boxes):
          </p>
          <div className="space-y-1.5">
            <RadioBox checked={data.citizenshipStatus === 'us_citizen'} label="A citizen of the United States" />
            <RadioBox checked={data.citizenshipStatus === 'noncitizen_national'} label="A noncitizen national of the United States (See instructions)" />
            <RadioBox checked={data.citizenshipStatus === 'lawful_permanent_resident'} label={`A lawful permanent resident${data.alienRegNumber ? ` — Alien Registration Number: ${data.alienRegNumber}` : ''}`} />
            <RadioBox checked={data.citizenshipStatus === 'authorized_alien'} label={`An alien authorized to work${data.workAuthorizationExpiration ? ` until ${data.workAuthorizationExpiration}` : ''}${data.uscisNumber ? ` — USCIS A-Number: ${data.uscisNumber}` : ''}${data.i94Number ? ` — Form I-94: ${data.i94Number}` : ''}${data.foreignPassportNumber ? ` — Passport: ${data.foreignPassportNumber} (${data.foreignPassportCountry})` : ''}`} />
          </div>
        </div>

        {/* Employee signature */}
        <div>
          <p className="text-[10px] text-ink-500 mb-1">
            Signature of Employee — I attest, under penalty of perjury, that the information I provided is true and correct.
          </p>
          <div className="flex items-end gap-6">
            <div className="flex-1">
              <div className="border-b-2 border-ink-700 min-h-[3.5rem] flex items-end pb-1">
                {employeeSignatureUrl ? (
                  <img src={employeeSignatureUrl} alt="Employee signature" className="h-12 w-auto max-w-[220px]" />
                ) : (
                  <span className="text-ink-300 text-xs italic">No signature</span>
                )}
              </div>
              <p className="text-[10px] text-ink-500 mt-0.5">Employee's Signature{employeeName ? ` — ${employeeName}` : ''}</p>
            </div>
            <div className="w-44 shrink-0">
              <div className="border-b-2 border-ink-700 min-h-[3.5rem] flex items-end pb-1">
                <span className="text-xs text-ink-700">{employeeSignedAt ?? ''}</span>
              </div>
              <p className="text-[10px] text-ink-500 mt-0.5">Today's Date (MM/DD/YYYY)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Employer ─────────────────────────────────────────── */}
      <SectionBanner
        section="2"
        title="Employer or Authorized Representative Review and Verification"
        note="Complete within 3 business days of employee's first day."
      />

      <div className="p-3 space-y-3 border-b border-ink-200 bg-white">
        <div>
          <p className="text-[10px] font-bold text-ink-600 uppercase tracking-wide mb-2">
            {data.documentListType === 'A'
              ? 'Employee presented: List A document (Identity and Employment Authorization)'
              : 'Employee presented: List B (Identity) AND List C (Employment Authorization)'}
          </p>
          {data.documentListType === 'A' ? (
            <DocBlock label="List A — Identity and Employment Authorization" doc={data.listADocument} />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <DocBlock label="List B — Identity" doc={data.listBDocument} />
              <DocBlock label="List C — Employment Authorization" doc={data.listCDocument} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FieldBox label="Employee's First Day of Employment (MM/DD/YYYY)" value={data.employeeFirstDay} />
          <FieldBox label="Title of Employer or Authorized Representative" value={data.employerTitle} />
          <FieldBox label="Organization Name" value={data.employerOrganization} span2 />
          <FieldBox label="Employer Address" value={data.employerAddress} />
          <FieldBox label="City or Town" value={data.employerCity} />
          <FieldBox label="State" value={data.employerState} />
          <FieldBox label="ZIP Code" value={data.employerZip} />
        </div>

        {/* Employer signature */}
        <div>
          <p className="text-[10px] text-ink-500 mb-1">
            Signature of Employer or Authorized Representative — I attest that I have examined the document(s) presented, the document(s) reasonably appear to be genuine and relate to the employee named, and to the best of my knowledge the employee is authorized to work in the United States.
          </p>
          <div className="flex items-end gap-6">
            <div className="flex-1">
              <div className="border-b-2 border-ink-700 min-h-[3.5rem] flex items-end pb-1">
                {employerSignatureUrl ? (
                  <img src={employerSignatureUrl} alt="Employer signature" className="h-12 w-auto max-w-[220px]" />
                ) : (
                  <span className="text-ink-400 text-xs italic">To be completed in person on Day 1</span>
                )}
              </div>
              <p className="text-[10px] text-ink-500 mt-0.5">Employer/Authorized Representative Signature{employerName ? ` — ${employerName}` : ''}</p>
            </div>
            <div className="w-44 shrink-0">
              <div className="border-b-2 border-ink-700 min-h-[3.5rem] flex items-end pb-1">
                <span className="text-xs text-ink-700">{employerSignedAt ?? ''}</span>
              </div>
              <p className="text-[10px] text-ink-500 mt-0.5">Today's Date (MM/DD/YYYY)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-ink-50 px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] text-ink-400">Form I-9 — Employment Eligibility Verification</span>
        <span className="text-[10px] text-ink-400">U.S. Citizenship and Immigration Services</span>
      </div>
    </div>
  );
}
