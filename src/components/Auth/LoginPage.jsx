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
  Lock
} from 'lucide-react';

export const LoginPage = ({ onBackToLanding, defaultRole = 'teacher' }) => {
  const { login, registerUser, pushNotification } = useApp();

  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [authError, setAuthError] = useState('');
  
  // Sign In Form States
  const [emailInput, setEmailInput] = useState('');
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
      desc: 'Master Admin & VC Office. Full administrative authority over all 8 modules & Supabase DB.'
    },
    {
      id: 'teacher',
      title: 'Faculty Member (Prof / Assoc Prof)',
      icon: GraduationCap,
      desc: 'View e-Service Book, file department transfer applications, leaves & download 7th Pay payslips.'
    },
    {
      id: 'principal',
      title: 'Head of Department (HOD) / Dean',
      icon: Building2,
      desc: 'Approve faculty leaves, recommend lab/dept transfers & grade APAR/API research reviews.'
    },
    {
      id: 'applicant',
      title: 'Faculty / Scholar Applicant',
      icon: User,
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

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!emailInput.trim()) {
      setAuthError('Please enter your Registered University / Personal Email.');
      return;
    }

    const res = await login(selectedRole, emailInput, password);
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
    <div className="min-h-screen bg-gradient-to-br from-[#160E0C] via-[#241310] to-[#361611] text-white flex flex-col justify-between font-sans selection:bg-[#E43D12] selection:text-white">
      
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#E43D12]/20">
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

        <span className="text-xs font-black px-3 py-1 rounded-full bg-white/10 text-[#FFA2B6] border border-[#FFA2B6]/30">
          Official University Auth Portal
        </span>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-[#E2DDD2]">
          
          {/* Left Hero Panel */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#1C1210] to-[#2E1612] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#EFB11D] text-[#191210] uppercase tracking-widest shadow-sm">
                MIT-ADT AUTH PORTAL
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-tight">
                Faculty Lifecycle Management System
              </h2>
              <p className="text-xs text-[#EAE4DF] leading-relaxed">
                Centralized e-Service Book, department transfers, APAR research appraisals, 7th Pay Academic Payroll, and continuous professional development for MIT-ADT University Pune.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 space-y-2 text-xs text-[#EAE4DF]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EFB11D] shrink-0" />
                <span>Supabase Live DB Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EFB11D] shrink-0" />
                <span>Multi-Role Access Control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EFB11D] shrink-0" />
                <span>7th Pay Payroll & Service Book</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 bg-[#FAF9F5]">
            
            {/* Mode Switcher Tabs (Sign In / Create New Account) */}
            <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3">
              <div className="flex items-center gap-2 bg-[#EBE9E1] p-1 rounded-2xl border border-[#DDD7CB]">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    authMode === 'signin'
                      ? 'bg-[#E43D12] text-white shadow-md shadow-[#E43D12]/30'
                      : 'text-[#5A524D] hover:text-[#E43D12]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    authMode === 'signup'
                      ? 'bg-[#E43D12] text-white shadow-md shadow-[#E43D12]/30'
                      : 'text-[#5A524D] hover:text-[#E43D12]'
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
                <p className="text-xs font-black text-[#1A1412] mb-2">Select Persona Scope:</p>
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
                            ? 'bg-[#FDF2EE] border-[#E43D12] ring-2 ring-[#E43D12]/30 text-[#1A1412] font-black shadow-sm'
                            : 'bg-white border-[#E2DDD2] hover:bg-[#FDF2EE] hover:border-[#FFA2B6] text-[#5A524D]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-[#E43D12] text-white' : 'bg-[#FDF2EE] text-[#E43D12]'}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#E43D12]" />}
                        </div>

                        <div className="mt-1.5">
                          <p className="text-[11px] font-black leading-snug">{r.title}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* SIGN UP MODE: Locked to Faculty / Scholar Applicant ONLY */
              <div className="p-3.5 rounded-2xl bg-[#FDF2EE] border border-[#FFA2B6] text-[#1A1412] flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#E43D12] text-white shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-wide">Faculty / Scholar Applicant Registration</p>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFA2B6]/40 text-[#872209] text-[10px] font-mono font-bold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Fixed Role
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B625B] mt-0.5">
                    Self-registration creates a new Faculty & Research Scholar Applicant profile.
                  </p>
                </div>
              </div>
            )}

            {/* Form Mode 1: SIGN IN */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4 pt-2 border-t border-[#E2DDD2]">
                <div>
                  <label className="text-xs font-bold text-[#453D38]">
                    Institutional / Registered Email Address
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA2B6]" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your registered email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#FFA2B6] bg-white text-xs font-medium text-[#1A1412] placeholder:text-[#A69C95] focus:ring-2 focus:ring-[#E43D12] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#453D38]">Security Password</label>
                  <div className="relative mt-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA2B6]" />
                    <input
                      type="password"
                      required
                      placeholder="Enter Security Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#FFA2B6] bg-white text-xs text-[#1A1412] placeholder:text-[#A69C95] focus:ring-2 focus:ring-[#E43D12] focus:outline-none"
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
                  className="w-full py-3 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black shadow-lg shadow-[#E43D12]/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Sign In as {selectedRole === 'admin' ? 'MASTER ADMIN' : selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Form Mode 2: CREATE NEW ACCOUNT (SIGN UP) */
              <form onSubmit={handleSignUpSubmit} className="space-y-3 pt-2 border-t border-[#E2DDD2]">
                <div>
                  <label className="text-xs font-bold text-[#453D38]">Full Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA2B6]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Shubham Alapure"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#FFA2B6] bg-white text-xs text-[#1A1412] focus:ring-2 focus:ring-[#E43D12] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#453D38]">University Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA2B6]" />
                    <input
                      type="email"
                      required
                      placeholder="shubham@mituniversity.edu.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#FFA2B6] bg-white text-xs text-[#1A1412] focus:ring-2 focus:ring-[#E43D12] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#453D38]">Create Password</label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA2B6]" />
                      <input
                        type="password"
                        required
                        placeholder="Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#FFA2B6] bg-white text-xs text-[#1A1412] focus:ring-2 focus:ring-[#E43D12] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#453D38]">Confirm Password</label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA2B6]" />
                      <input
                        type="password"
                        required
                        placeholder="Confirm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#FFA2B6] bg-white text-xs text-[#1A1412] focus:ring-2 focus:ring-[#E43D12] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black shadow-lg shadow-[#E43D12]/30 transition-all uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
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
      <footer className="px-6 py-3 text-center text-xs text-[#A69C95] border-t border-[#2A1612]">
        &copy; 2026 MIT-ADT University Pune, India &bull; A Leap Towards World Class Education
      </footer>

    </div>
  );
};
