import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MitAdtLogo } from '../MitAdtLogo';
import { 
  User, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  ArrowLeft
} from 'lucide-react';

export const LoginPage = ({ onBackToLanding, defaultRole = 'teacher' }) => {
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [empId, setEmpId] = useState(defaultRole === 'admin' ? 'MIT-MASTER-ADMIN-01' : 'MIT-FAC-2021-4091');
  const [password, setPassword] = useState('admin@123');

  const roles = [
    {
      id: 'admin',
      title: 'Master Admin (Shubham S. Alapure)',
      icon: ShieldCheck,
      defaultId: 'MIT-MASTER-ADMIN-01',
      desc: 'Master Admin & VC Office. Full administrative authority over all 8 modules & Supabase DB.'
    },
    {
      id: 'teacher',
      title: 'Faculty Member (Prof / Assoc Prof)',
      icon: GraduationCap,
      defaultId: 'MIT-FAC-2021-4091',
      desc: 'View e-Service Book, file department transfer applications, leaves & download 7th Pay payslips.'
    },
    {
      id: 'principal',
      title: 'Head of Department (HOD) / Dean',
      icon: Building2,
      defaultId: 'MIT-DEAN-2012-0056',
      desc: 'Approve faculty leaves, recommend lab/dept transfers & grade APAR/API research reviews.'
    },
    {
      id: 'applicant',
      title: 'Faculty / Scholar Applicant',
      icon: User,
      defaultId: 'MIT-APP-2026-9901',
      desc: 'Apply for MIT-ADT University Assistant Professor, Associate Professor, & Research Fellowships.'
    }
  ];

  const handleRoleSelect = (roleId, defaultId) => {
    setSelectedRole(roleId);
    setEmpId(defaultId);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    login(selectedRole, empId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1d0b3a] via-[#321464] to-[#451884] text-white flex flex-col justify-between font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-purple-800/40">
        <div className="flex items-center gap-4">
          {onBackToLanding && (
            <button 
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
          )}
          <MitAdtLogo />
        </div>

        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
          Official University Auth Portal
        </span>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-purple-100">
          
          {/* Left Hero Section */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#27104e] to-[#43187a] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-yellow-400 text-purple-950 uppercase tracking-widest">
                MIT-ADT MASTER AUTH
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-tight">
                Teacher Lifecycle Management System
              </h2>
              <p className="text-xs text-purple-200 leading-relaxed">
                Centralized e-Service Book, department transfers, APAR research appraisals, 7th Pay Academic Payroll, and continuous professional development for MIT-ADT University Pune.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-purple-400/20 space-y-2 text-xs text-purple-200">
              <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-200 space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-300">MASTER ADMIN CREDENTIALS</p>
                <p className="text-xs font-bold text-white">SHUBHAM SHARADRAO ALAPURE</p>
                <p className="text-[11px] font-mono text-purple-200">ID: MIT-MASTER-ADMIN-01</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supabase Live DB Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full System Control Access</span>
              </div>
            </div>
          </div>

          {/* Right Form & Role Selection */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-purple-950">Select Persona & Sign In</h3>
              <p className="text-xs text-slate-500 mt-0.5">Choose your university role to access authorized features.</p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => {
                const IconComp = r.icon;
                const isSelected = selectedRole === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id, r.defaultId)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-100/90 border-purple-600 ring-2 ring-purple-600/30 text-purple-950 font-bold shadow-sm'
                        : 'bg-purple-50/40 border-purple-100 hover:bg-purple-50 hover:border-purple-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                    </div>

                    <div className="mt-2">
                      <p className="text-xs font-extrabold leading-snug">{r.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2 border-t border-purple-100">
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Faculty / Application / Admin ID</span>
                  <span className="text-[10px] text-purple-700 font-mono">Master ID Auto-filled</span>
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Security Password</label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Sign In as {selectedRole === 'admin' ? 'MASTER ADMIN' : selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-3 text-center text-xs text-purple-200/80 border-t border-purple-800/40">
        &copy; 2026 MIT-ADT University Pune, India &bull; A Leap Towards World Class Education
      </footer>

    </div>
  );
};
