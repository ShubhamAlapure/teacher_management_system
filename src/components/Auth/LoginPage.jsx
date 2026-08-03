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
  ArrowLeft,
  Mail,
  UserPlus,
  LogIn,
  Sparkles,
  Lock
} from 'lucide-react';

export const LoginPage = ({ onBackToLanding, defaultRole = 'teacher' }) => {
  const { login, registerUser, pushNotification } = useApp();

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [authError, setAuthError] = useState('');
  
  // Sign In Form States
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const roles = [
    {
      id: 'admin',
      title: 'Master Admin',
      icon: ShieldCheck,
      demoId: 'MIT-MASTER-ADMIN-01',
      desc: 'Master Admin & VC Office. Full administrative authority over all 8 modules & Supabase DB.'
    },
    {
      id: 'teacher',
      title: 'Faculty Member (Prof / Assoc Prof)',
      icon: GraduationCap,
      demoId: 'MIT-FAC-2021-4091',
      desc: 'View e-Service Book, file department transfer applications, leaves & download 7th Pay payslips.'
    },
    {
      id: 'principal',
      title: 'Head of Department (HOD) / Dean',
      icon: Building2,
      demoId: 'MIT-DEAN-2012-0056',
      desc: 'Approve faculty leaves, recommend lab/dept transfers & grade APAR/API research reviews.'
    },
    {
      id: 'applicant',
      title: 'Faculty / Scholar Applicant',
      icon: User,
      demoId: 'MIT-APP-2026-9901',
      desc: 'Apply for MIT-ADT University Assistant Professor, Associate Professor, & Research Fellowships.'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setAuthError('');
  };

  const handleModeSwitch = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    if (mode === 'signup') {
      setSelectedRole('applicant'); // Strictly lock new registrations to Faculty / Scholar Applicant
    }
  };

  const handleFillDemoCredentials = () => {
    const selectedObj = roles.find(r => r.id === selectedRole) || roles[1];
    setEmpId(selectedObj.demoId || 'MIT-FAC-2021-4091');
    setPassword('admin@123');
    pushNotification('Demo Credentials Filled', `Loaded ID ${selectedObj.demoId || 'MIT-FAC-2021-4091'}`, 'info');
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!empId.trim()) {
      setAuthError('Please enter your Faculty / Application / Admin ID.');
      return;
    }

    const res = await login(selectedRole, empId, password);
    if (!res || !res.success) {
      setAuthError(res?.message || 'Access Denied: Invalid credentials.');
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      alert('Passwords do not match. Please re-enter.');
      return;
    }

    const generatedId = `MIT-APP-${Date.now().toString().slice(-4)}`;

    registerUser({
      emp_id: generatedId,
      full_name: fullName,
      email: email,
      password: signupPassword,
      role: 'applicant' // Explicitly set to applicant
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1d0b3a] via-[#321464] to-[#451884] text-white flex flex-col justify-between font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Top Header */}
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

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-purple-100">
          
          {/* Left Hero Panel */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#27104e] to-[#43187a] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-yellow-400 text-purple-950 uppercase tracking-widest">
                MIT-ADT AUTH PORTAL
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-tight">
                Faculty Lifecycle Management System
              </h2>
              <p className="text-xs text-purple-200 leading-relaxed">
                Centralized e-Service Book, department transfers, APAR research appraisals, 7th Pay Academic Payroll, and continuous professional development for MIT-ADT University Pune.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-purple-400/20 space-y-2 text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supabase Live DB Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Role Access Control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7th Pay Payroll & Service Book</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            
            {/* Mode Switcher Tabs (Sign In / Create New Account) */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2 bg-purple-50 p-1 rounded-2xl border border-purple-100">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    authMode === 'signin'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-600 hover:text-purple-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    authMode === 'signup'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-600 hover:text-purple-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create New Account</span>
                </button>
              </div>


            </div>

            {/* SIGN IN MODE: Persona Selector */}
            {authMode === 'signin' ? (
              <div>
                <p className="text-xs font-extrabold text-purple-950 mb-2">Select Persona Scope:</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {roles.map((r) => {
                    const IconComp = r.icon;
                    const isSelected = selectedRole === r.id;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleSelect(r.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-100/90 border-purple-600 ring-2 ring-purple-600/30 text-purple-950 font-bold shadow-sm'
                            : 'bg-purple-50/40 border-purple-100 hover:bg-purple-50 hover:border-purple-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                        </div>

                        <div className="mt-1.5">
                          <p className="text-[11px] font-extrabold leading-snug">{r.title}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* SIGN UP MODE: Locked to Faculty / Scholar Applicant ONLY */
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-wide">Faculty / Scholar Applicant Registration</p>
                    <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Fixed Role
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Self-registration creates a new Faculty & Research Scholar Applicant profile.
                  </p>
                </div>
              </div>
            )}

            {/* Form Mode 1: SIGN IN */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4 pt-2 border-t border-purple-100">
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Faculty / Application / Admin ID
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter User ID (e.g. MIT-MASTER-ADMIN-01)"
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 focus:outline-none"
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
                      placeholder="Enter Security Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-purple-200 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Sign In as {selectedRole === 'admin' ? 'MASTER ADMIN' : selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Form Mode 2: CREATE NEW ACCOUNT (SIGN UP) */
              <form onSubmit={handleSignUpSubmit} className="space-y-3 pt-2 border-t border-purple-100">
                <div>
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Shubham Alapure"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">University Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="email"
                      required
                      placeholder="shubham@mituniversity.edu.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Create Password</label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input
                        type="password"
                        required
                        placeholder="Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                      <input
                        type="password"
                        required
                        placeholder="Confirm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Applicant Account & Sign In</span>
                </button>
              </form>
            )}

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
