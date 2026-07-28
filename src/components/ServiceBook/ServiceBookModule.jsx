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
  Building
} from 'lucide-react';

export const ServiceBookModule = () => {
  const { activeTeacher, teachers, role } = useApp();

  // Exclude Admin from faculty digital service books (Admin is system governance, not teaching faculty)
  const facultyTeachers = teachers.filter(t => 
    t.emp_id !== 'MIT-MASTER-ADMIN-01' && 
    t.id !== 'admin-master' && 
    t.cadre !== 'System Administrator' && 
    t.cadre !== 'Master Administrator' &&
    !t.full_name?.toLowerCase().includes('system administrator')
  );

  const defaultTeacher = facultyTeachers.find(t => t.id === activeTeacher.id) 
    || facultyTeachers[0] 
    || (activeTeacher.emp_id !== 'MIT-MASTER-ADMIN-01' ? activeTeacher : {
        id: 'dean-01',
        emp_id: 'MIT-DEAN-2012-0056',
        full_name: 'Dr. Rajesh Kumar (School Dean)',
        email: 'dean.soe@mituniversity.edu.in',
        cadre: 'School Dean',
        subject: 'School of Engineering & Technology',
        current_school: 'School of Engineering (SOE)',
        district: 'Rajbaug Campus',
        block: 'Loni Kalbhor',
        gpf_nps_no: 'PF-MIT-DEAN-056',
        service_status: 'Active',
        joining_date: '2018-06-01',
        basic_pay: 144200,
        seniority_rank: 1,
        qualification: 'Ph.D. / M.Tech'
      });

  const [selectedTeacherId, setSelectedTeacherId] = useState(defaultTeacher.id);

  const teacher = facultyTeachers.find(t => t.id === selectedTeacherId) || defaultTeacher;
  const isApplicant = teacher.emp_id?.startsWith('MIT-APP-') || teacher.cadre === 'Applicant';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
              MIT-ADT UNIVERSITY OFFICIAL e-SERVICE BOOK
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-purple-950 mt-1">Digital Faculty & Teacher Service Record</h2>
          <p className="text-xs text-slate-500">Centralized permanent service history, posting log, and cadre profile.</p>
        </div>

        <div className="flex items-center gap-3">
          {(role === 'admin' || role === 'principal') && facultyTeachers.length > 0 && (
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 bg-white shadow-sm font-medium"
            >
              {facultyTeachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.emp_id}) - {t.emp_id.startsWith('MIT-APP-') ? 'Applicant' : t.cadre}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Service Book
          </button>
        </div>
      </div>

      {/* Main Service Book Card */}
      <div className="bg-white rounded-2xl border border-purple-100 p-6 md:p-8 space-y-6 shadow-sm">
        
        {/* Header Seals */}
        <div className="border-b border-purple-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <MitAdtLogo variant="light" />

            <div className="hidden sm:block h-12 w-[1px] bg-purple-200" />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">{teacher.full_name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                  {isApplicant ? 'Faculty Applicant' : `${teacher.cadre || 'Assistant Professor'}`}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-mono">
                ID: <span className="text-purple-700 font-extrabold">{teacher.emp_id}</span> &bull; {teacher.gpf_nps_no || 'PF-MIT-PENDING'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Qualification: {teacher.qualification || 'Ph.D. / M.Tech'}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right bg-purple-50 p-4 rounded-2xl border border-purple-100 shrink-0">
            <div className="flex items-center gap-2 md:justify-end text-xs text-purple-900 font-extrabold">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              {isApplicant ? 'Recruitment Profile Active' : 'MIT-ADT Verified Service Book'}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Category: <strong className="text-purple-900">{isApplicant ? 'Job Applicant' : 'Regular Permanent Faculty'}</strong>
            </p>
            <p className="text-[11px] text-slate-600">
              Service Status: <strong className="text-emerald-700">{teacher.service_status || 'Active'}</strong>
            </p>
          </div>
        </div>

        {/* Primary Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Subject Specialization</p>
            <p className="text-sm font-extrabold text-purple-950 mt-1">{teacher.subject || 'Computer Engineering'}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Department / School</p>
            <p className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-2">{teacher.current_school || 'School of Engineering & Technology (SOE)'}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Campus Location</p>
            <p className="text-sm font-extrabold text-slate-900 mt-1">{teacher.district || 'Rajbaug Campus'} ({teacher.block || 'Loni Kalbhor'})</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Registration / Joining Date</p>
            <p className="text-sm font-extrabold text-purple-700 mt-1">{teacher.joining_date || new Date().toISOString().split('T')[0]}</p>
          </div>
        </div>

        {/* Service Timeline */}
        <div className="space-y-4 pt-4 border-t border-purple-100">
          <h4 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Service Career Timeline & Department Postings
          </h4>

          <div className="relative border-l-2 border-purple-200 ml-4 space-y-6 py-2">
            <div className="relative pl-6">
              <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-600 border-4 border-white shadow-md" />
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-900">
                    {teacher.joining_date || '2026'} - Present
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-600 text-white font-bold">
                    {isApplicant ? 'Submitted Application' : 'Current Appointment'}
                  </span>
                </div>
                <h5 className="text-sm font-extrabold text-slate-900">{teacher.current_school || 'School of Engineering & Technology (SOE)'}</h5>
                <p className="text-xs text-slate-600">
                  Campus: {teacher.district || 'Rajbaug Campus'} &bull; Cadre: {isApplicant ? 'Faculty Applicant' : (teacher.cadre || 'Assistant Professor')}
                </p>
                <p className="text-xs text-purple-900 font-bold mt-1">
                  {isApplicant ? 'Status: Under Selection Committee Review' : `Pay Matrix: Level 10 (Basic Pay ₹${(teacher.basic_pay || 57700).toLocaleString()})`}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
