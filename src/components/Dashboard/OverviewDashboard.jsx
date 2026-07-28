import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ArrowLeftRight, 
  Clock, 
  Briefcase, 
  Award, 
  Building, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Plus,
  ShieldCheck,
  ChevronRight,
  Bell,
  Lock,
  Sparkles,
  Lightbulb,
  UserCheck,
  Check,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';

export const OverviewDashboard = () => {
  const { 
    teachers, 
    vacancies, 
    transfers, 
    leaves, 
    apars, 
    districtStats, 
    setActiveTab, 
    role, 
    activeTeacher 
  } = useApp();

  const activeTransfersCount = transfers.length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
  const openVacanciesCount = vacancies.filter(v => v.status === 'Open').reduce((acc, v) => acc + v.total_posts, 0);

  // Data for Cadre Breakdown
  const cadreData = [
    { name: 'PRT (Primary)', count: 18400, color: '#7c3aed' },
    { name: 'TGT (Secondary)', count: 14200, color: '#3b82f6' },
    { name: 'PGT (Sr Secondary)', count: 8600, color: '#8b5cf6' },
    { name: 'Headmasters/Principals', count: 2100, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Progress Stepper Bar (Exact match to screenshot top progress bar) */}
      <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-3 text-xs">
          <span className="font-extrabold uppercase text-purple-900 tracking-wider text-[11px] shrink-0">
            YOUR LIFECYCLE PROGRESS &rarr;
          </span>

          <div className="flex flex-wrap items-center gap-2 text-slate-700">
            
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-200">
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span>1. Recruitment & Verification</span>
            </div>

            <span className="text-slate-400 font-bold">&rarr;</span>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-100">
              <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Posting & Service Book</span>
            </div>

            <span className="text-slate-400 font-bold">&rarr;</span>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-200">
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span>3. Transfers & APAR Appraisal</span>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Four Quick Pastel Cards Grid (Exact match to screenshot 4 pastel cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Pastel Blue Announcements */}
        <div 
          onClick={() => setActiveTab('recruitment')}
          className="p-5 rounded-2xl pastel-blue-card cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-blue-950">Announcements</h4>
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-blue-800 mt-1">Important recruitment updates & notices</p>
          </div>
          <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-blue-700">
            View All &rarr;
          </div>
        </div>

        {/* Card 2: Pastel Gray Upload Document */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="p-5 rounded-2xl pastel-gray-card cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-800">Upload Document</h4>
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-600 mt-1">Ph.D degrees, publications & certificates</p>
          </div>
          <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-slate-600">
            Digital Vault &rarr;
          </div>
        </div>

        {/* Card 3: Pastel Yellow Posts & Transfers */}
        <div 
          onClick={() => setActiveTab('transfers')}
          className="p-5 rounded-2xl pastel-yellow-card cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-amber-950">Posting & Transfers</h4>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs text-amber-900 mt-1">{activeTransfersCount} active transfer requests</p>
          </div>
          <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-amber-800">
            View Orders &rarr;
          </div>
        </div>

        {/* Card 4: Pastel Purple Digital Service Book */}
        <div 
          onClick={() => setActiveTab('service_book')}
          className="p-5 rounded-2xl pastel-purple-card cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-purple-950">e-Service Book</h4>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-purple-900 mt-1">Verified career service history</p>
          </div>
          <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-purple-800">
            View Profile &rarr;
          </div>
        </div>

      </div>

      {/* 3. Main Split Section: Faculty Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Faculty Workspace */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">Faculty Workspace</h3>
                <p className="text-xs text-slate-500">Cadre: <strong className="text-purple-700">{activeTeacher.cadre} &bull; {activeTeacher.subject}</strong></p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                School: SOE Loni Kalbhor
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold">School Dean / HOD:</span>
                  <p className="font-extrabold text-purple-900 text-sm">Dr. Ramesh Chandra Pandey (Dean SOE)</p>
                </div>
                <button 
                  onClick={() => setActiveTab('service_book')}
                  className="px-3 py-1 rounded-full text-xs font-bold border border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Edit Profile
                </button>
              </div>

              {/* Members / Service Card */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <p className="text-[11px] font-extrabold uppercase text-purple-900 tracking-wider">
                  Faculty Profile Details
                </p>

                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-extrabold text-slate-900">{activeTeacher.full_name}</p>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-600 text-white">Active</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800">You</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">Emp ID: {activeTeacher.emp_id} &bull; {activeTeacher.gpf_nps_no}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-extrabold text-slate-900">Rajesh Kumar Verma</p>
                    <p className="text-[11px] text-slate-500 font-mono">Emp ID: TCH-2018-1024 &bull; PGT Physics</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* District Vacancies Chart */}
          <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-purple-950">District Teacher Strength & Vacancy Audit</h3>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="total_teachers" name="Filled Posts" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vacancies" name="Vacancies" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Problem Statement & Requests Box (Matching screenshot right panel) */}
        <div className="space-y-6">
          
          {/* Card 1: Problem Statement / Transfer Portal Box */}
          <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2 text-purple-950 font-extrabold text-sm">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <span>Service Book Status</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                Verified
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                <Lightbulb className="w-7 h-7" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                e-Service book is up to date for Academic Year 2025-2026.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => setActiveTab('service_book')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all"
              >
                Browse Service Book
              </button>
              
              <button
                onClick={() => setActiveTab('transfers')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-sm transition-all"
              >
                + File Transfer Request
              </button>
            </div>
          </div>

          {/* Card 2: Requests Summary Box */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="text-xs font-extrabold text-purple-950">Pending Workflow Requests</span>
              <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Casual Leave (2 Days)</p>
                  <p className="text-[10px] text-slate-500">Submitted to Headmaster</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Pending</span>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">APAR Evaluation 2025-26</p>
                  <p className="text-[10px] text-slate-500">Under DEO Final Review</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">In Review</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
