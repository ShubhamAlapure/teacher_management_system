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
  ShieldCheck,
  ChevronRight,
  Bell,
  Sparkles,
  Lightbulb,
  UserCheck,
  Check,
  RefreshCw,
  User,
  GraduationCap,
  Building2,
  FileCheck,
  ArrowRight,
  BookOpen
} from 'lucide-react';


import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export const OverviewDashboard = () => {
  const { 
    teachers, 
    vacancies, 
    transfers, 
    leaves, 
    apars, 
    applications,
    districtStats, 
    setActiveTab, 
    role, 
    activeTeacher,
    currentUser,
    leaveBalances
  } = useApp();

  const displayName = currentUser?.full_name || activeTeacher.full_name || 'MIT-ADT Staff';
  const displayId = currentUser?.emp_id || activeTeacher.emp_id || 'MIT-USER-01';

  const activeTransfersCount = transfers.length;
  // For faculty: show only their own pending leaves
  const pendingLeavesCount = role === 'teacher'
    ? leaves.filter(l => l.status === 'Pending' && (
        l.teacher_id === activeTeacher.id ||
        l.teacher_name === activeTeacher.full_name ||
        l.teacher_id === currentUser?.emp_id
      )).length
    : leaves.filter(l => l.status === 'Pending').length;
  const pendingAppraisalCount = apars.filter(a => a.status !== 'Approved' && a.status !== 'Finalized').length;
  const openVacanciesCount = vacancies.filter(v => v.status === 'Open').reduce((acc, v) => acc + v.total_posts, 0);

  // Personal leave balances for faculty
  const myLeaveBalance = leaveBalances?.[activeTeacher.id] || { casual: 8, medical: 10, earned: 14 };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Dean / HOD Custom Dashboard */}
      {role === 'principal' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl border border-purple-800/40 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase tracking-wider">
                  HOD & Dean Approval Desk
                </span>
                <h2 className="text-2xl font-black tracking-tight">{displayName}</h2>
                <p className="text-xs text-purple-200">
                  School Dean &bull; School of Engineering & Technology (SOE) &bull; Rajbaug Campus
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center">
                  <p className="text-[10px] font-bold text-purple-200 uppercase">Department Faculty</p>
                  <p className="text-lg font-black text-white">{teachers.length || 42}</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center">
                  <p className="text-[10px] font-bold text-amber-200 uppercase">Pending Approvals</p>
                  <p className="text-lg font-black text-amber-300">{pendingLeavesCount + activeTransfersCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* HOD Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setActiveTab('leaves')}
              className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {pendingLeavesCount} Pending
                </span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-purple-950">Faculty Leave Approvals</h4>
                <p className="text-xs text-slate-500 mt-0.5">Review and approve casual, medical, or duty leave applications.</p>
              </div>
              <div className="flex items-center text-xs font-bold text-purple-700 gap-1 pt-1">
                <span>Open Approval Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('training')}
              className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                  <Award className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {pendingAppraisalCount} In Review
                </span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-purple-950">APAR & API Appraisals</h4>
                <p className="text-xs text-slate-500 mt-0.5">Evaluate research publications, API scores & grade faculty APARs.</p>
              </div>
              <div className="flex items-center text-xs font-bold text-blue-700 gap-1 pt-1">
                <span>Grade Appraisals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('transfers')}
              className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {activeTransfersCount} Active
                </span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-purple-950">Department Transfer Recommendations</h4>
                <p className="text-xs text-slate-500 mt-0.5">Recommend lab/department transfer requests for Registrar review.</p>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-700 gap-1 pt-1">
                <span>Review Transfers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Applicant Custom Dashboard */}
      {role === 'applicant' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-purple-800/40 space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-yellow-400 text-purple-950 uppercase tracking-widest">
              Faculty & Scholar Recruitment Portal
            </span>
            <h2 className="text-2xl font-black tracking-tight">{displayName}</h2>
            <p className="text-xs text-purple-200">
              Application ID: <strong className="font-mono text-yellow-300">{displayId}</strong> &bull; Status: <span className="text-emerald-400 font-bold">Application Submitted for Document Verification</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm space-y-3">
              <h4 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Open University Vacancies</span>
              </h4>
              <p className="text-xs text-slate-500">Apply for Assistant Professor, Associate Professor & Research Fellowships.</p>
              <button 
                onClick={() => setActiveTab('recruitment')}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Browse Job Repository &rarr;
              </button>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm space-y-3">
              <h4 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Document Vault Upload</span>
              </h4>
              <p className="text-xs text-slate-500">Upload your Ph.D. degree, NET/SET certificates, and publication proofs.</p>
              <button 
                onClick={() => setActiveTab('documents')}
                className="w-full py-2 rounded-xl bg-purple-100 text-purple-900 hover:bg-purple-200 text-xs font-bold transition-all"
              >
                Go to Document Vault &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Faculty (Teacher) Personal Dashboard */}
      {role === 'teacher' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl border border-purple-700/40 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #a78bfa 0%, transparent 60%)' }} />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/20 text-purple-100 border border-white/20 uppercase tracking-wider">
                  Faculty Portal — MIT-ADT University
                </span>
                <h2 className="text-2xl font-black tracking-tight">Welcome, {displayName}</h2>
                <p className="text-xs text-purple-200">
                  Employee ID: <strong className="font-mono text-yellow-300">{displayId}</strong> &bull; {activeTeacher.current_school || 'School of Engineering & Technology'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center">
                  <p className="text-[10px] font-bold text-purple-200 uppercase">Leave Balance</p>
                  <p className="text-lg font-black text-white">{(myLeaveBalance.casual || 0) + (myLeaveBalance.earned || 0)} Days</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-center">
                  <p className="text-[10px] font-bold text-amber-200 uppercase">Pending</p>
                  <p className="text-lg font-black text-amber-300">{pendingLeavesCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab('service_book')}
              className="p-5 rounded-2xl bg-purple-50 border border-purple-100 cursor-pointer hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-purple-950">My Service Book</h4>
                  <BookOpen className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-purple-800 mt-1">View your verified career service history</p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-purple-700">
                Open &rarr;
              </div>
            </div>

            <div
              onClick={() => setActiveTab('leaves')}
              className="p-5 rounded-2xl bg-blue-50 border border-blue-100 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-blue-950">Leaves & Payroll</h4>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-blue-800 mt-1">Apply for leave &bull; {pendingLeavesCount} pending</p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-blue-700">
                Apply &rarr;
              </div>
            </div>

            <div
              onClick={() => setActiveTab('training')}
              className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-emerald-950">Training & APAR</h4>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-emerald-800 mt-1">Appraisals &bull; {pendingAppraisalCount} under review</p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-emerald-700">
                View &rarr;
              </div>
            </div>

            <div
              onClick={() => setActiveTab('documents')}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-800">Document Vault</h4>
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-xs text-slate-600 mt-1">Upload degrees, certificates & publications</p>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs font-extrabold text-slate-600">
                Upload &rarr;
              </div>
            </div>
          </div>

          {/* Profile + Leave Balance Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Faculty Profile Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h3 className="text-base font-extrabold text-purple-950">My Profile</h3>
                <button
                  onClick={() => setActiveTab('service_book')}
                  className="px-3 py-1 rounded-full text-xs font-bold border border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Department / School</p>
                  <p className="font-extrabold text-slate-900 mt-1">{activeTeacher.current_school || 'School of Engineering & Technology'}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Designation</p>
                  <p className="font-extrabold text-slate-900 mt-1">{activeTeacher.cadre || 'Assistant Professor'}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Campus</p>
                  <p className="font-extrabold text-slate-900 mt-1">{activeTeacher.district || 'Rajbaug Campus'}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Joining Date</p>
                  <p className="font-extrabold text-slate-900 mt-1">{activeTeacher.joining_date || '—'}</p>
                </div>
              </div>
            </div>

            {/* Leave Balance Card */}
            <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h3 className="text-sm font-extrabold text-purple-950">Leave Balance 2026</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">Active</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="font-bold text-blue-900">Casual Leave (CL)</span>
                  <span className="font-extrabold text-blue-700">{myLeaveBalance.casual || 8} Days</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="font-bold text-emerald-900">Earned Leave (EL)</span>
                  <span className="font-extrabold text-emerald-700">{myLeaveBalance.earned || 14} Days</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <span className="font-bold text-purple-900">Medical Leave (ML)</span>
                  <span className="font-extrabold text-purple-700">{myLeaveBalance.medical || 10} Days</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('leaves')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-sm transition-all"
              >
                Apply for Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Master Admin Dashboard */}
      {role === 'admin' && (
        <>
          {/* Progress Stepper Bar */}
          <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-3 text-xs">
              <span className="font-extrabold uppercase text-purple-900 tracking-wider text-[11px] shrink-0">
                LIFECYCLE PROGRESS &rarr;
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

          {/* Quick Pastel Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div 
              onClick={() => setActiveTab('recruitment')}
              className="p-5 rounded-2xl bg-blue-50 border border-blue-100 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
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

            <div 
              onClick={() => setActiveTab('documents')}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
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

            <div 
              onClick={() => setActiveTab('transfers')}
              className="p-5 rounded-2xl bg-amber-50 border border-amber-100 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
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

            <div 
              onClick={() => setActiveTab('service_book')}
              className="p-5 rounded-2xl bg-purple-50 border border-purple-100 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
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

          {/* Main Workspace Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-purple-950">Faculty Workspace</h3>
                    <p className="text-xs text-slate-500">Logged in User: <strong className="text-purple-700">{displayName} ({displayId})</strong></p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                    School: SOE Loni Kalbhor
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold">School Dean / HOD:</span>
                      <p className="font-extrabold text-purple-900 text-sm">Dr. Rajesh Kumar (School Dean SOE)</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('service_book')}
                      className="px-3 py-1 rounded-full text-xs font-bold border border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Edit Profile
                    </button>
                  </div>

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
                          <p className="text-xs font-extrabold text-slate-900">{displayName}</p>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-600 text-white">Active</span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800">You</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">Emp ID: {displayId}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* District Chart */}
              <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-extrabold text-purple-950">University Faculty Strength & Vacancy Audit</h3>
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

            {/* Right Column */}
            <div className="space-y-6">
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

              <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <span className="text-xs font-extrabold text-purple-950">Pending Workflow Requests</span>
                  <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Casual Leave Application</p>
                      <p className="text-[10px] text-slate-500">Submitted for HOD Approval</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Pending</span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">APAR Research Evaluation 2025-26</p>
                      <p className="text-[10px] text-slate-500">Under Dean Review</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">In Review</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
};
