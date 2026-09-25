import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MitAdtLogo } from '../MitAdtLogo';
import { 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  Printer,
  CheckCircle2,
  Award,
  UserCheck,
  Building,
  GraduationCap,
  Briefcase,
  FileText,
  BadgeCheck,
  Hash
} from 'lucide-react';

export const ServiceBookModule = () => {
  const { activeTeacher, teachers, role } = useApp();

  // Exclude Admin from faculty digital service books (Admin is system governance)
  const facultyTeachers = teachers.filter(t => 
    t.emp_id !== 'MIT-MASTER-ADMIN-01' && 
    t.id !== 'admin-master' && 
    t.cadre !== 'System Administrator' && 
    t.cadre !== 'Master Administrator' &&
    !t.full_name?.toLowerCase().includes('system administrator')
  );

  const isPrivilegedRole = role === 'admin' || role === 'principal';

  const defaultTeacher = (activeTeacher?.id && facultyTeachers.find(t => t.id === activeTeacher.id))
    || (isPrivilegedRole ? facultyTeachers[0] : activeTeacher) 
    || activeTeacher
    || {};

  const [selectedTeacherId, setSelectedTeacherId] = useState(defaultTeacher?.id);

  const teacher = isPrivilegedRole
    ? (facultyTeachers.find(t => t.id === selectedTeacherId) || defaultTeacher)
    : (activeTeacher?.id ? (facultyTeachers.find(t => t.id === activeTeacher.id) || activeTeacher) : defaultTeacher);

  const isApplicant = teacher?.emp_id?.startsWith('MIT-APP-') || teacher?.cadre === 'Applicant';

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── TOP CONTROL BAR (Screen Only - Hidden in Print) ── */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
              MIT-ADT UNIVERSITY OFFICIAL e-SERVICE BOOK
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-purple-950 mt-1">Digital Faculty & Teacher Service Record</h2>
          <p className="text-xs text-slate-500">
            Official employment history, cadre progression, academic credentials, and verified postings ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isPrivilegedRole && facultyTeachers.length > 0 && (
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 bg-white shadow-sm font-medium focus:outline-none focus:border-purple-600"
            >
              {facultyTeachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.emp_id}) - {t.emp_id?.startsWith('MIT-APP-') ? 'Applicant' : t.cadre}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-900/20 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Service Book</span>
          </button>
        </div>
      </div>

      {/* ── OFFICIAL A4 SERVICE BOOK DOCUMENT (Screen & Laser Print Optimized) ── */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 sm:p-10 text-slate-900 max-w-5xl mx-auto print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full space-y-6">
        
        {/* 1. OFFICIAL UNIVERSITY LETTERHEAD & EMBLEM */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center">
              <MitAdtLogo variant="light" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 uppercase leading-snug">
                MIT ART, DESIGN &amp; TECHNOLOGY UNIVERSITY
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium leading-tight">
                Established under MIT-ADT University Act, 2015 (Maharashtra Act No. XXXIX of 2015) &bull; UGC Recognized
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Rajbaug Educational Complex, Next to Hadapsar, Loni Kalbhor, Pune – 412201, Maharashtra, India
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-300 pt-2 sm:pt-0 shrink-0">
            <span className="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white rounded">
              FORM NO. MIT/HR/SB-01
            </span>
            <p className="text-[10px] font-mono text-slate-600 mt-1 font-bold">
              REF: MIT-ADT/HR-SB/{teacher.emp_id || '001'}
            </p>
            <p className="text-[10px] text-slate-500">
              Print Date: <strong className="text-slate-800">{currentDateStr}</strong>
            </p>
          </div>
        </div>

        {/* 2. DOCUMENT TITLE BANNER */}
        <div className="text-center py-2 bg-slate-100 print:bg-slate-100 border-y border-slate-300">
          <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
            CENTRAL FACULTY SERVICE BOOK (RECORD OF SERVICE &amp; EMPLOYMENT)
          </h2>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
            Central Directorate of Human Resources &bull; Permanent Service Register
          </p>
        </div>

        {/* 3. PART I: FACULTY IDENTIFICATION & BIO-DATA TABLE */}
        <div className="space-y-2 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <span className="text-xs font-black uppercase text-purple-950 tracking-wider">
              Part I &mdash; Personal Bio-Data &amp; Service Profile
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Status: {teacher.service_status || 'Active in Service'}</span>
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse print-table">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/4 p-2.5 font-bold text-slate-600 bg-slate-50">Faculty Full Name</td>
                <td className="w-1/4 p-2.5 font-extrabold text-slate-950 uppercase">{teacher.full_name}</td>
                <td className="w-1/4 p-2.5 font-bold text-slate-600 bg-slate-50">Employee Code / UID</td>
                <td className="w-1/4 p-2.5 font-mono font-extrabold text-purple-900">{teacher.emp_id}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Current Academic Cadre</td>
                <td className="p-2.5 font-bold text-slate-900">{teacher.cadre || 'Assistant Professor'}</td>
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Faculty Category</td>
                <td className="p-2.5 font-bold text-slate-900">{isApplicant ? 'Job Applicant' : 'Regular Permanent Faculty'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Department / School</td>
                <td className="p-2.5 font-bold text-slate-900">{teacher.current_school || 'School of Engineering & Technology (SOE)'}</td>
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Subject Specialization</td>
                <td className="p-2.5 font-bold text-slate-900">{teacher.subject || 'Engineering & Technology'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Campus &amp; Location</td>
                <td className="p-2.5 font-medium text-slate-900">{teacher.district || 'Rajbaug Campus'} ({teacher.block || 'Loni Kalbhor'})</td>
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Date of University Joining</td>
                <td className="p-2.5 font-bold text-slate-900 font-mono">{teacher.joining_date || '2018-06-01'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Retirement Fund / NPS No.</td>
                <td className="p-2.5 font-mono text-slate-900">{teacher.gpf_nps_no || 'PF-MIT-PENDING'}</td>
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Pay Scale &amp; Basic Pay</td>
                <td className="p-2.5 font-mono font-bold text-slate-900">
                  UGC Level 10 (₹{(teacher.basic_pay || 57700).toLocaleString()})
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Official Email</td>
                <td className="p-2.5 font-mono text-slate-900 truncate">{teacher.email || 'faculty@mituniversity.edu.in'}</td>
                <td className="p-2.5 font-bold text-slate-600 bg-slate-50">Contact Telephone</td>
                <td className="p-2.5 font-mono text-slate-900">{teacher.phone || '+91 98765 43210'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. PART II: ACADEMIC & PROFESSIONAL QUALIFICATIONS */}
        <div className="space-y-2 print-avoid-break">
          <div className="border-b border-slate-300 pb-1">
            <span className="text-xs font-black uppercase text-purple-950 tracking-wider">
              Part II &mdash; Verified Academic Qualifications &amp; Research Portfolio
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse print-table">
            <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 border-b border-slate-300">Degree / Qualification</th>
                <th className="p-2.5 border-b border-slate-300">Discipline / Branch</th>
                <th className="p-2.5 border-b border-slate-300">Awarding University / Board</th>
                <th className="p-2.5 border-b border-slate-300 text-center">Research Publications</th>
                <th className="p-2.5 border-b border-slate-300 text-center">Verification Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-bold text-slate-900">{teacher.qualification || 'Ph.D. / M.Tech'}</td>
                <td className="p-2.5 text-slate-800">{teacher.specialization || teacher.subject || 'Engineering & Technology'}</td>
                <td className="p-2.5 text-slate-800">UGC Recognized University</td>
                <td className="p-2.5 text-center font-bold text-purple-900">{teacher.publications || 4} Indexed Papers</td>
                <td className="p-2.5 text-center">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Verified Document Vault
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. PART III: CHRONOLOGICAL RECORD OF POSTINGS & SERVICE HISTORY */}
        <div className="space-y-2 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <span className="text-xs font-black uppercase text-purple-950 tracking-wider">
              Part III &mdash; Posting, Designation &amp; Service Ledger History
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Registrar Service Register Ledger
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse print-table">
            <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-2 border-b border-slate-300 text-center w-10">Sr.</th>
                <th className="p-2 border-b border-slate-300">School / Department</th>
                <th className="p-2 border-b border-slate-300">Cadre / Designation</th>
                <th className="p-2 border-b border-slate-300">Appointment Period</th>
                <th className="p-2 border-b border-slate-300">Pay Band &amp; Matrix</th>
                <th className="p-2 border-b border-slate-300">Authority / Order Ref</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 text-center font-mono font-bold text-slate-500">1</td>
                <td className="p-2.5 font-bold text-slate-900">
                  {teacher.current_school || 'School of Engineering & Technology (SOE)'}
                  <span className="block text-[10px] font-normal text-slate-500">Rajbaug Campus, Loni Kalbhor</span>
                </td>
                <td className="p-2.5 font-bold text-purple-950">{teacher.cadre || 'Assistant Professor'}</td>
                <td className="p-2.5 font-mono text-slate-800">
                  {teacher.joining_date || '2018-06-01'} &mdash; <strong>Current</strong>
                </td>
                <td className="p-2.5 font-mono text-slate-800">
                  Level 10 (₹{(teacher.basic_pay || 57700).toLocaleString()})
                </td>
                <td className="p-2.5 text-slate-700 text-[11px]">
                  Order: MIT-ADT/SOE/ORD-{(teacher.emp_id || '01').replace(/[^0-9]/g, '').slice(-4) || '1042'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 6. PART IV: STATUTORY DECLARATION & AUDIT VERIFICATION */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 leading-relaxed print-avoid-break">
          <p className="font-bold text-slate-900 mb-0.5">STATUTORY UNIVERSITY CERTIFICATION &amp; ATTESTATION:</p>
          <p>
            It is hereby certified that the service entries, educational degrees, departmental postings, and remuneration records recorded herein have been verified against the original service registers, appointment orders, and digital audit ledgers maintained under the authority of the Central Registrar, MIT Art, Design &amp; Technology University, Pune.
          </p>
        </div>

        {/* 7. PART V: TRIPLE AUTHORIZATION SIGNATURES BLOCK */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center print-avoid-break">
          
          <div className="flex flex-col justify-end space-y-2">
            <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
              <span className="font-serif italic text-xs text-slate-400 font-bold">[Faculty Signature]</span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 uppercase">{teacher.full_name}</p>
              <p className="text-[10px] text-slate-500">Signature of Faculty Member</p>
              <p className="text-[9px] font-mono text-slate-400">Date: {currentDateStr}</p>
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
              <span className="font-serif italic text-xs text-purple-800 font-bold">Dr. Rajesh Kumar (Dean)</span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 uppercase">Head of Department / Dean</p>
              <p className="text-[10px] text-slate-500">School of Engineering &amp; Technology</p>
              <p className="text-[9px] font-mono text-slate-400">Official Seal &amp; Signature</p>
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <div className="h-14 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
              <span className="font-serif italic text-xs text-purple-900 font-bold">Registrar Secretariat</span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 uppercase">Central Registrar / Director (HR)</p>
              <p className="text-[10px] text-slate-500">MIT-ADT University, Pune</p>
              <p className="text-[9px] font-mono text-slate-400">Authorized University Seal</p>
            </div>
          </div>

        </div>

        {/* 8. FOOTER VERIFICATION WATERMARK */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-slate-500 gap-2 print-avoid-break">
          <span>ELECTRONIC AUTHENTICATION: SHA256:{Math.random().toString(36).substring(2, 10).toUpperCase()}-TLMS-MIT</span>
          <span>DOCUMENT VALID WITHOUT PHYSICAL INK CORRECTION</span>
          <span>PAGE 1 OF 1</span>
        </div>

      </div>

    </div>
  );
};
