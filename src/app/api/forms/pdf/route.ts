import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { W4Data } from '@/components/W4Form';
import type { I9Data } from '@/components/I9Form';

function setText(form: ReturnType<PDFDocument['getForm']>, name: string, value: string) {
  try { form.getTextField(name).setText(value || ''); } catch { /* field not found */ }
}

function setCheck(form: ReturnType<PDFDocument['getForm']>, name: string, checked: boolean) {
  try {
    const cb = form.getCheckBox(name);
    checked ? cb.check() : cb.uncheck();
  } catch { /* field not found */ }
}

function setDropdown(form: ReturnType<PDFDocument['getForm']>, name: string, value: string) {
  try { form.getDropdown(name).select(value); } catch { /* field not found or value invalid */ }
}

async function fillW4(data: W4Data): Promise<Uint8Array> {
  const pdfBytes = readFileSync(join(process.cwd(), 'public', 'forms', 'w4.pdf'));
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  // Step 1 — Personal info
  setText(form, 'topmostSubform[0].Page1[0].Step1a[0].f1_01[0]',
    `${data.firstName}${data.middleInitial ? ' ' + data.middleInitial : ''}`);
  setText(form, 'topmostSubform[0].Page1[0].Step1a[0].f1_02[0]', data.lastName);
  setText(form, 'topmostSubform[0].Page1[0].Step1a[0].f1_03[0]', data.address);
  setText(form, 'topmostSubform[0].Page1[0].Step1a[0].f1_04[0]',
    `${data.city}, ${data.state} ${data.zip}`);
  setText(form, 'topmostSubform[0].Page1[0].f1_05[0]', data.ssn || '');

  // Step 1c — Filing status
  setCheck(form, 'topmostSubform[0].Page1[0].c1_1[0]', data.filingStatus === 'single_or_mfs');
  setCheck(form, 'topmostSubform[0].Page1[0].c1_1[1]', data.filingStatus === 'married_jointly');
  setCheck(form, 'topmostSubform[0].Page1[0].c1_1[2]', data.filingStatus === 'head_of_household');

  // Step 2 — Multiple jobs
  setCheck(form, 'topmostSubform[0].Page1[0].c1_2[0]', !!data.multipleJobsChecked);

  // Step 3 — Dependents
  setText(form, 'topmostSubform[0].Page1[0].Step3_ReadOrder[0].f1_06[0]',
    data.qualifyingChildrenAmount || '0');
  setText(form, 'topmostSubform[0].Page1[0].Step3_ReadOrder[0].f1_07[0]',
    data.otherDependentsAmount || '0');
  setText(form, 'topmostSubform[0].Page1[0].f1_08[0]', data.dependentsTotalAmount || '0');

  // Step 4 — Other adjustments
  setText(form, 'topmostSubform[0].Page1[0].f1_09[0]', data.otherIncome || '');
  setText(form, 'topmostSubform[0].Page1[0].f1_10[0]', data.deductions || '');
  setText(form, 'topmostSubform[0].Page1[0].f1_11[0]', data.extraWithholding || '');

  // Employer section
  const employerLine = [data.employerName, data.employerAddress].filter(Boolean).join(' — ');
  setText(form, 'topmostSubform[0].Page1[0].f1_12[0]', employerLine);
  setText(form, 'topmostSubform[0].Page1[0].f1_13[0]', data.firstDateOfEmployment || '');
  setText(form, 'topmostSubform[0].Page1[0].f1_14[0]', data.employerEIN || '');

  form.flatten();
  return pdfDoc.save();
}

async function fillI9(data: I9Data): Promise<Uint8Array> {
  const pdfBytes = readFileSync(join(process.cwd(), 'public', 'forms', 'i9.pdf'));
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  // Section 1 — Employee info
  setText(form, 'Last Name (Family Name)', data.lastName);
  setText(form, 'First Name Given Name', data.firstName);
  setText(form, 'Employee Middle Initial (if any)', data.middleInitial || '');
  setText(form, 'Employee Other Last Names Used (if any)', data.otherLastNames || 'N/A');
  setText(form, 'Address Street Number and Name', data.address);
  setText(form, 'Apt Number (if any)', data.aptNumber || '');
  setText(form, 'City or Town', data.city);
  setDropdown(form, 'State', data.state);
  setText(form, 'ZIP Code', data.zip);
  setText(form, 'Date of Birth mmddyyyy', data.dateOfBirth || '');
  setText(form, 'US Social Security Number', data.ssn || '');
  setText(form, 'Employees E-mail Address', data.email || '');
  setText(form, 'Telephone Number', data.phone || '');

  // Section 1 — Citizenship status checkboxes
  setCheck(form, 'CB_1', data.citizenshipStatus === 'us_citizen');
  setCheck(form, 'CB_2', data.citizenshipStatus === 'noncitizen_national');
  setCheck(form, 'CB_3', data.citizenshipStatus === 'lawful_permanent_resident');
  setCheck(form, 'CB_4', data.citizenshipStatus === 'authorized_alien');

  if (data.citizenshipStatus === 'lawful_permanent_resident' && data.alienRegNumber) {
    setText(form, '3 A lawful permanent resident Enter USCIS or ANumber', data.alienRegNumber);
  }
  if (data.citizenshipStatus === 'authorized_alien') {
    setText(form, 'Exp Date mmddyyyy', data.workAuthorizationExpiration || '');
    setText(form, 'USCIS ANumber', data.uscisNumber || '');
    setText(form, 'Form I94 Admission Number', data.i94Number || '');
    if (data.foreignPassportNumber || data.foreignPassportCountry) {
      setText(form, 'Foreign Passport Number and Country of IssuanceRow1',
        `${data.foreignPassportNumber || ''} / ${data.foreignPassportCountry || ''}`);
    }
  }

  // Section 2 — Employee name references (employer copies from Section 1)
  setText(form, 'Last Name Family Name from Section 1', data.lastName);
  setText(form, 'First Name Given Name from Section 1', data.firstName);
  setText(form, 'Middle initial if any from Section 1', data.middleInitial || '');
  setText(form, 'Last Name Family Name from Section 1-2', data.lastName);
  setText(form, 'First Name Given Name from Section 1-2', data.firstName);
  setText(form, 'Middle initial if any from Section 1-2', data.middleInitial || '');
  setText(form, 'FirstDayEmployed mmddyyyy', data.employeeFirstDay || '');

  // Section 2 — Documents
  if (data.documentListType === 'A') {
    setText(form, 'Document Title 0', data.listADocument?.documentTitle || '');
    setText(form, 'Issuing Authority 1', data.listADocument?.issuingAuthority || '');
    setText(form, 'Document Number 0 (if any)', data.listADocument?.documentNumber || '');
    setText(form, 'Expiration Date 0', data.listADocument?.expirationDate || '');
  } else {
    setText(form, 'List B Document 1 Title', data.listBDocument?.documentTitle || '');
    setText(form, 'List B Issuing Authority 1', data.listBDocument?.issuingAuthority || '');
    setText(form, 'List B Document Number 1', data.listBDocument?.documentNumber || '');
    setText(form, 'List B Expiration Date 1', data.listBDocument?.expirationDate || '');
    setText(form, 'List C Document Title 1', data.listCDocument?.documentTitle || '');
    setText(form, 'List C Issuing Authority 1', data.listCDocument?.issuingAuthority || '');
    setText(form, 'List C Document Number 1', data.listCDocument?.documentNumber || '');
    setText(form, 'List C Expiration Date 1', data.listCDocument?.expirationDate || '');
  }

  // Section 2 — Employer / authorized representative
  const employerNameAndTitle = [data.employerTitle, data.employerOrganization]
    .filter(Boolean).join(', ');
  setText(form, 'Last Name First Name and Title of Employer or Authorized Representative',
    employerNameAndTitle);
  setText(form, 'Employers Business or Org Name', data.employerOrganization || '');
  const employerFullAddress = [
    data.employerAddress, data.employerCity,
    data.employerState, data.employerZip,
  ].filter(Boolean).join(', ');
  setText(form, 'Employers Business or Org Address', employerFullAddress);

  form.flatten();
  return pdfDoc.save();
}

import { createClient } from '@supabase/supabase-js';

function serverSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/forms/pdf?employeeId=...&docId=w4|i9
// Used as iframe src — returns the filled PDF inline.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');
  const docId = searchParams.get('docId');

  if (!employeeId || (docId !== 'w4' && docId !== 'i9')) {
    return NextResponse.json({ error: 'Missing or invalid params' }, { status: 400 });
  }

  try {
    const supabase = serverSupabase();
    const { data: packet } = await supabase
      .from('onboarding_packets')
      .select('tasks')
      .eq('employee_id', employeeId)
      .single();

    const task = (packet?.tasks as any[])?.find((t: any) => t.id === docId);
    if (!task?.formData) {
      return NextResponse.json({ error: 'Form data not found' }, { status: 404 });
    }

    const formData = task.formData;
    const filledBytes = docId === 'w4'
      ? await fillW4(formData as W4Data)
      : await fillI9(formData as I9Data);

    const lastName = (formData as any).lastName ?? '';

    return new NextResponse(filledBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${docId.toUpperCase()}_${lastName}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[pdf-fill GET]', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}

// POST /api/forms/pdf
// Body: { employeeId, docId, formData }
// Generates the filled PDF, uploads to Supabase Storage, returns { publicUrl }.
export async function POST(request: NextRequest) {
  try {
    const { employeeId, docId, formData } = await request.json();

    if (docId !== 'w4' && docId !== 'i9') {
      return NextResponse.json({ error: 'Invalid docId' }, { status: 400 });
    }

    const filledBytes = docId === 'w4'
      ? await fillW4(formData as W4Data)
      : await fillI9(formData as I9Data);

    const supabase = serverSupabase();
    const storagePath = `${employeeId}/${docId}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('onboarding-forms')
      .upload(storagePath, filledBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('onboarding-forms')
      .getPublicUrl(storagePath);

    // Save URL back to the packet task
    const { data: packet } = await supabase
      .from('onboarding_packets')
      .select('tasks')
      .eq('employee_id', employeeId)
      .single();

    if (packet?.tasks) {
      const updatedTasks = (packet.tasks as any[]).map((t: any) =>
        t.id === docId ? { ...t, pdfStorageUrl: urlData.publicUrl } : t
      );
      await supabase
        .from('onboarding_packets')
        .update({ tasks: updatedTasks })
        .eq('employee_id', employeeId);
    }

    return NextResponse.json({ publicUrl: urlData.publicUrl });
  } catch (err) {
    console.error('[pdf-fill POST]', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
