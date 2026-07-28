import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MitAdtLogo } from '../MitAdtLogo';
import { 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  Printer,
  CheckCircle2,
  Award
} from 'lucide-react';

export const ServiceBookModule = () => {
  const { activeTeacher, teachers, role } = useApp();
  const [selectedTeacherId, setSelectedTeacherId] = useState(activeTeacher.id);

  const teacher = teachers.find(t => t.id === selectedTeacherId) || activeTeacher;

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
          {(role === 'admin' || role === 'principal') && (
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 bg-white"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.emp_id}) - {t.cadre}
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
        
        {/* Top Header Seals with MIT-ADT Logo */}
        <div className="border-b border-purple-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <MitAdtLogo variant="light" />

            <div className="hidden sm:block h-12 w-[1px] bg-purple-200" />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">{teacher.full_name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                  {teacher.cadre} Cadre
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-mono">
                Faculty ID: <span className="text-purple-700 font-extrabold">{teacher.emp_id}</span> &bull; {teacher.gpf_nps_no}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {teacher.qualification}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right bg-purple-50 p-4 rounded-2xl border border-purple-100 shrink-0">
            <div className="flex items-center gap-2 md:justify-end text-xs text-purple-900 font-extrabold">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              MIT-ADT Verified Service Book
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Faculty Rank: <strong className="text-purple-900">#{teacher.seniority_rank}</strong></p>
            <p className="text-[11px] text-slate-600">TET / Score: <strong className="text-emerald-700">{teacher.tet_score} / 150</strong> (Qualified)</p>
          </div>
        </div>

        {/* Primary Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Subject Specialization</p>
            <p className="text-sm font-extrabold text-purple-950 mt-1">{teacher.subject}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Department / School</p>
            <p className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-2">{teacher.current_school}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Campus & District</p>
            <p className="text-sm font-extrabold text-slate-900 mt-1">{teacher.district} ({teacher.block})</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
            <p className="text-[11px] text-slate-500 font-bold uppercase">Joining Date</p>
            <p className="text-sm font-extrabold text-purple-700 mt-1">{teacher.joining_date}</p>
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
                  <span className="text-xs font-extrabold text-purple-900">2021 - Present</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-600 text-white font-bold">Current Designation</span>
                </div>
                <h5 className="text-sm font-extrabold text-slate-900">{teacher.current_school}</h5>
                <p className="text-xs text-slate-600">Department: {teacher.district} &bull; Cadre: {teacher.cadre} ({teacher.subject})</p>
                <p className="text-xs text-purple-900 font-bold mt-1">Pay Matrix: Level 7 (Basic Pay ₹{teacher.basic_pay.toLocaleString()})</p>
              </div>
            </div>

            <div className="relative pl-6">
              <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-md" />
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900">2018 - 2021</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-900 font-bold">Previous Appointment</span>
                </div>
                <h5 className="text-sm font-extrabold text-slate-900">MIT School of Engineering & Technology</h5>
                <p className="text-xs text-slate-600">Department: Mathematics & Foundation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footer Seal */}
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple-700 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-purple-950">MIT-ADT University Registrar Digital Seal</p>
              <p className="text-[11px] text-slate-600">Cryptographically verified by MIT-ADT University Pune, India.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-purple-900 font-bold hidden sm:block">MIT-ADT-VERIFIED-2026</span>
        </div>

      </div>

    </div>
  );
};
