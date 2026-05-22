'use client';

import type { I9Data, I9DocumentEntry } from '@/components/I9Form';

const CITIZENSHIP_LABELS: Record<string, string> = {
  us_citizen: 'A citizen of the United States',
  noncitizen_national: 'A noncitizen national of the United States',
  lawful_permanent_resident: 'A lawful permanent resident',
  authorized_alien: 'An alien authorized to work',
};

function Row({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-ink-50 last:border-0">
      <span className="text-xs text-ink-500 leading-relaxed shrink-0 max-w-[55%]">{label}</span>
      <span className={`text-sm font-semibold text-ink-800 text-right break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function DocBlock({ label, doc }: { label: string; doc: I9DocumentEntry }) {
  if (!doc.documentTitle) return null;
  return (
    <div className="rounded-lg border border-ink-200 p-3 space-y-1.5 bg-white">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-500">{label}</p>
      <Row label="Document title" value={doc.documentTitle} />
      <Row label="Issuing authority" value={doc.issuingAuthority} />
      <Row label="Document number" value={doc.documentNumber} mono />
      <Row label="Expiration date" value={doc.expirationDate} />
    </div>
  );
}

function SectionBanner({ section, title, subtitle }: { section: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 bg-ink-700 text-white px-4 py-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">{section}</div>
      <div>
        <div className="text-sm font-bold">{title}</div>
        {subtitle && <div className="text-xs text-white/70 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
}

export default function I9FormView({ data, employeeSignatureUrl, employerSignatureUrl, employeeSignedAt, employerSignedAt, employeeName, employerName }: {
  data: I9Data;
  employeeSignatureUrl?: string;
  employerSignatureUrl?: string;
  employeeSignedAt?: string;
  employerSignedAt?: string;
  employeeName?: string;
  employerName?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-ink-200 text-sm">
      {/* USCIS Header */}
      <div className="bg-ink-800 text-white px-5 py-4 flex items-start justify-between">
        <div>
          <div className="text-xs text-white/60 uppercase tracking-wider">U.S. Citizenship and Immigration Services</div>
          <div className="text-lg font-bold mt-0.5">Employment Eligibility Verification</div>
          <div className="text-xs text-white/60 mt-0.5">Department of Homeland Security</div>
        </div>
        <div className="text-right shrink-0 ml-4">
          <div className="text-2xl font-black">I-9</div>
          <div className="text-xs text-white/60">OMB No. 1615-0047</div>
        </div>
      </div>

      {/* Section 1 — Employee */}
      <SectionBanner section="1" title="Employee Information and Attestation" subtitle="Employees must complete and sign Section 1 no later than the first day of employment." />
      <div className="px-4 pt-2 pb-3 bg-white divide-y divide-ink-50">
        <Row label="Last name (Family name)" value={data.lastName} />
        <Row label="First name (Given name)" value={data.firstName} />
        <Row label="Middle initial" value={data.middleInitial || '—'} />
        <Row label="Other last names used (if any)" value={data.otherLastNames || '—'} />
        <Row label="Address (Street number and name)" value={data.address} />
        <Row label="Apt. number" value={data.aptNumber || '—'} />
        <Row label="City or town" value={data.city} />
        <Row label="State" value={data.state} />
        <Row label="ZIP code" value={data.zip} />
        <Row label="Date of birth (MM/DD/YYYY)" value={data.dateOfBirth} />
        <Row label="U.S. Social Security Number" value={data.ssn} mono />
        <Row label="Employee's email address" value={data.email} />
        <Row label="Employee's telephone number" value={data.phone} />
      </div>

      {/* Citizenship attestation */}
      <div className="px-4 py-3 bg-cyan-50/40 border-t border-ink-100">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-1">Attestation of citizenship / immigration status</p>
        <p className="text-sm text-ink-800 font-semibold">
          {CITIZENSHIP_LABELS[data.citizenshipStatus] ?? data.citizenshipStatus}
        </p>
        {data.citizenshipStatus === 'lawful_permanent_resident' && data.alienRegNumber && (
          <p className="text-xs text-ink-600 mt-1">Alien Registration No.: <span className="font-mono font-semibold">{data.alienRegNumber}</span></p>
        )}
        {data.citizenshipStatus === 'authorized_alien' && (
          <div className="mt-1 space-y-0.5 text-xs text-ink-600">
            {data.uscisNumber && <p>USCIS A-Number: <span className="font-mono font-semibold">{data.uscisNumber}</span></p>}
            {data.i94Number && <p>Form I-94 Admission No.: <span className="font-mono font-semibold">{data.i94Number}</span></p>}
            {data.foreignPassportNumber && <p>Foreign passport: <span className="font-semibold">{data.foreignPassportNumber}</span> ({data.foreignPassportCountry})</p>}
            {data.workAuthorizationExpiration && <p>Work authorization expires: <span className="font-semibold">{data.workAuthorizationExpiration}</span></p>}
          </div>
        )}
      </div>

      {/* Employee signature */}
      <div className="px-4 py-3 bg-white border-t border-ink-100">
        <p className="text-xs text-ink-400 mb-1">Employee's Signature — Section 1</p>
        {employeeSignatureUrl ? (
          <>
            <img src={employeeSignatureUrl} alt="Employee signature" className="h-12 w-auto max-w-xs" />
            {employeeName && <p className="text-xs font-semibold text-ink-600 mt-1">{employeeName}</p>}
            {employeeSignedAt && <p className="text-xs text-ink-400">{employeeSignedAt}</p>}
          </>
        ) : (
          <p className="text-xs text-ink-400 italic">Signature not available on this record</p>
        )}
      </div>

      {/* Section 2 — Employer */}
      <SectionBanner section="2" title="Employer or Authorized Representative Review and Verification" subtitle="Employers must complete and sign Section 2 within 3 business days of the employee's first day of employment." />
      <div className="px-4 pt-3 pb-3 bg-white space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Documents examined</p>
          {data.documentListType === 'A' ? (
            <DocBlock label="List A — Identity and employment authorization" doc={data.listADocument} />
          ) : (
            <div className="space-y-2">
              <DocBlock label="List B — Identity" doc={data.listBDocument} />
              <DocBlock label="List C — Employment authorization" doc={data.listCDocument} />
            </div>
          )}
        </div>
        <div className="divide-y divide-ink-50">
          <Row label="Employee's first day of employment" value={data.employeeFirstDay} />
          <Row label="Employer/authorized representative title" value={data.employerTitle} />
          <Row label="Organization name" value={data.employerOrganization} />
          <Row label="Employer address" value={data.employerAddress} />
          <Row label="City or town" value={data.employerCity} />
          <Row label="State" value={data.employerState} />
          <Row label="ZIP code" value={data.employerZip} />
        </div>
      </div>

      {/* Employer signature */}
      <div className="px-4 py-3 bg-ink-50 border-t border-ink-200">
        <p className="text-xs text-ink-400 mb-1">Employer/Authorized Representative Signature — Section 2</p>
        {employerSignatureUrl ? (
          <>
            <img src={employerSignatureUrl} alt="Employer signature" className="h-12 w-auto max-w-xs" />
            {employerName && <p className="text-xs font-semibold text-ink-600 mt-1">{employerName}</p>}
            {employerSignedAt && <p className="text-xs text-ink-400">{employerSignedAt}</p>}
          </>
        ) : (
          <p className="text-xs text-ink-400 italic">Employer signature not available — to be completed in person</p>
        )}
      </div>
    </div>
  );
}
