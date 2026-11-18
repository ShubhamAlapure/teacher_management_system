import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MitAdtLogo } from './MitAdtLogo';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  CheckCircle2, 
  UserCheck,
  X,
  Edit3,
  Save,
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  Command,
  LayoutDashboard,
  Camera,
  Users,
  BookOpen,
  ArrowLeftRight,
  Receipt,
  Award,
  FolderLock,
  BarChart3,
  GraduationCap
} from 'lucide-react';

export const Navbar = () => {
  const { 
    role, 
    notifications, 
    setIsNotificationModalOpen,
    activeTeacher,
    currentUser,
    logout,
    updateApplicantProfile,
    activeTab,
    setActiveTab,
    teachers = []
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const commandInputRef = useRef(null);

  // Live Clock (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut (⌘K / Ctrl+K) for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandOpen(false);
        setIsRoleDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isCommandOpen && commandInputRef.current) {
      setTimeout(() => commandInputRef.current.focus(), 50);
    }
  }, [isCommandOpen]);

  const displayName = currentUser?.full_name || activeTeacher?.full_name || 'Shubham Sharadrao Alapure';
  const displayId = currentUser?.emp_id || activeTeacher?.emp_id || 'MIT-MASTER-ADMIN-01';
  const userInitials = (displayName || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SA';

  const [editForm, setEditForm] = useState({
    full_name: currentUser?.full_name || displayName,
    email: currentUser?.email || 'admin@mituniversity.edu.in',
    phone: currentUser?.phone || '+91 9876543210',
    gender: currentUser?.gender || 'Male',
    dob: currentUser?.dob || '1992-05-15',
    qualification: currentUser?.qualification || 'Ph.D. / M.Tech',
    specialization: currentUser?.specialization || 'Computer Science & AI'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateApplicantProfile(displayId, editForm);
    setIsEditProfileModalOpen(false);
    setIsRoleDropdownOpen(false);
  };

  // Nav Tab Display metadata
  const tabTitles = {
    dashboard: { label: 'Executive Dashboard', icon: LayoutDashboard },
    attendance: { label: 'Faculty Geo-Attendance', icon: Camera },
    recruitment: { label: 'Recruitment & Job Repository', icon: Users },
    faculties: { label: 'Faculty Directory & Profiles', icon: Users },
    service_book: { label: 'Digital Service Book', icon: BookOpen },
    transfers: { label: 'Posting & Transfers', icon: ArrowLeftRight },
    leaves: { label: 'Leaves & Academic Payroll', icon: Receipt },
    training: { label: 'Training & APAR Appraisals', icon: Award },
    documents: { label: 'Document Vault', icon: FolderLock },
    analytics: { label: 'Reports & Analytics', icon: BarChart3 }
  };

  const currentTabMeta = tabTitles[activeTab] || tabTitles.dashboard;
  const ActiveIcon = currentTabMeta.icon;

  // Filtered faculties & quick jump for Command Palette
  const filteredTeachers = (teachers || []).filter(t => 
    t.full_name?.toLowerCase().includes(commandQuery.toLowerCase()) ||
    t.emp_id?.toLowerCase().includes(commandQuery.toLowerCase()) ||
    t.department?.toLowerCase().includes(commandQuery.toLowerCase())
  ).slice(0, 5);

  const quickNavItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Mark / Monitor Attendance', icon: Camera },
    { id: 'faculties', label: 'Faculty Directory', icon: Users },
    { id: 'service_book', label: 'e-Service Book', icon: BookOpen },
    { id: 'leaves', label: 'Leaves & 7th Pay Payroll', icon: Receipt },
    { id: 'transfers', label: 'Posting & Transfer Orders', icon: ArrowLeftRight },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <>
      <header className="no-print h-16 bg-[#160E0C]/95 backdrop-blur-xl border-b border-[#E43D12]/25 px-4 lg:px-6 flex items-center justify-between shadow-xl sticky top-0 z-40 transition-all">
        {/* Subtle top ambient hairline glow */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E43D12]/70 to-transparent pointer-events-none" />

        {/* 1. LEFT BRAND & CONTEXT */}
        <div className="flex items-center gap-3.5">
          <div className="p-1 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#FFA2B6]/30 transition-all shadow-sm">
            <MitAdtLogo />
          </div>

          <div className="hidden sm:block h-7 w-[1px] bg-white/10" />

          {/* Academic Context Badge */}
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#EBE9E1]">
                MIT-ADT University
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-[#E43D12]/20 text-[#FFA2B6] border border-[#FFA2B6]/30">
                TLMS CLOUD
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#A69C95] font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Rajbaug Campus &bull; Term 2026-27</span>
            </div>
          </div>
        </div>

        {/* 2. CENTER COMMAND / SEARCH CAPSULE & BREADCRUMB */}
        <div className="flex-1 max-w-xl mx-4 hidden lg:flex items-center justify-center gap-3">
          {/* Quick Command Capsule Button */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full max-w-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-[#FFA2B6]/40 rounded-full px-3.5 py-1.5 flex items-center justify-between text-xs text-[#C5BCB6] transition-all cursor-pointer shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#FFA2B6] group-hover:text-[#E43D12] transition-colors" />
              <span className="text-[11px] font-medium text-[#C5BCB6] group-hover:text-white transition-colors">
                Search faculty, emp ID, service book, leaves...
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono font-bold text-[#EAE4DF] border border-white/15">
                ⌘K
              </kbd>
            </div>
          </button>

          {/* Current Active Section Capsule */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-bold text-[#EAE4DF] shrink-0">
            <ActiveIcon className="w-3.5 h-3.5 text-[#EFB11D]" />
            <span className="truncate max-w-[140px]">{currentTabMeta.label}</span>
          </div>
        </div>

        {/* 3. RIGHT CONTROLS & USER PROFILE */}
        <div className="flex items-center gap-2.5 sm:gap-3">

          {/* Live IST Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-[#D8D0C9]">
            <Clock className="w-3 h-3 text-[#EFB11D]" />
            <span>{currentTime || '10:52 PM'}</span>
          </div>

          {/* Persona Scope Badge */}
          <div className="hidden sm:flex items-center">
            {role === 'admin' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EFB11D]/15 text-[#EFB11D] border border-[#EFB11D]/30 shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#EFB11D]" />
                <span>Master Admin</span>
              </span>
            )}
            {role === 'principal' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFA2B6]/15 text-[#FFA2B6] border border-[#FFA2B6]/30 shadow-sm flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-[#FFA2B6]" />
                <span>School Dean</span>
              </span>
            )}
            {role === 'teacher' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E43D12]/20 text-[#FFA2B6] border border-[#FFA2B6]/30 shadow-sm flex items-center gap-1">
                <Users className="w-3 h-3 text-[#E43D12]" />
                <span>Faculty</span>
              </span>
            )}
            {role === 'applicant' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-[#EBE9E1] border border-white/20 shadow-sm">
                Scholar Applicant
              </span>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            title="System Notifications"
            className="relative p-2 rounded-full bg-white/[0.06] text-[#FFA2B6] hover:bg-white/[0.12] hover:text-white transition-all border border-white/10 hover:border-[#FFA2B6]/30"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E43D12] text-[10px] font-black text-white flex items-center justify-center shadow-md animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {/* User Profile Pill Button */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2.5 pl-3 pr-2 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#E43D12]/40 transition-all text-right shadow-sm"
            >
              <div className="hidden md:block">
                <div className="text-xs font-black uppercase text-white tracking-wide truncate max-w-[140px]">
                  {displayName}
                </div>
                <div className="text-[10px] text-[#FFA2B6] font-mono tracking-tight">
                  {displayId}
                </div>
              </div>

              {/* Avatar Squircle with Dual-tone vermillion-raspberry gradient */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E43D12] to-[#D6536D] text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-[#FFA2B6]/40">
                {userInitials}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#FFA2B6] transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Account Menu Dropdown */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2DDD2] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 text-[#1A1412]">
                
                {/* Profile Card Header */}
                <div className="flex items-center gap-3.5 pb-3.5 border-b border-[#E2DDD2]">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E43D12] to-[#D6536D] text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-[#FFA2B6]">
                    {userInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-[#1A1412] truncate">{displayName}</p>
                    <p className="text-[11px] text-[#7A7067] font-mono">{displayId}</p>
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Authenticated {role.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="py-3 text-xs space-y-2 text-[#5A524D]">
                  <div className="flex justify-between">
                    <span className="text-[#8C827A]">Institution:</span>
                    <span className="font-bold text-[#1A1412]">MIT-ADT University, Pune</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C827A]">Campus:</span>
                    <span className="font-bold text-[#1A1412]">Rajbaug Campus, Loni Kalbhor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C827A]">Database:</span>
                    <span className="font-bold text-emerald-700 font-mono">Live PostgreSQL Cloud</span>
                  </div>
                </div>

                {/* Action Buttons: Edit Profile & Sign Out */}
                <div className="pt-2 border-t border-[#E2DDD2] space-y-2">
                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#FDF2EE] hover:bg-[#FCEAE4] text-[#E43D12] border border-[#FFA2B6] text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#E43D12]" />
                    Edit Profile Details
                  </button>

                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      logout();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#FFF0F3] hover:bg-[#FDE4E9] text-[#D6536D] border border-[#FFA2B6] text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#D6536D]" />
                    Sign Out of Portal
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* 4. COMMAND PALETTE MODAL (⌘K) */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 bg-[#160E0C]/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#E2DDD2] overflow-hidden text-[#1A1412] animate-in zoom-in-95">
            
            {/* Search Input Bar */}
            <div className="p-4 border-b border-[#E2DDD2] flex items-center gap-3 bg-[#FAF8F5]">
              <Search className="w-5 h-5 text-[#E43D12]" />
              <input
                ref={commandInputRef}
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Type to search faculty members, sections, or employee ID..."
                className="w-full bg-transparent text-sm font-semibold text-[#1A1412] placeholder:text-[#8C827A] focus:outline-none"
              />
              <button 
                onClick={() => setIsCommandOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Modules Shortcuts */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#8C827A] mb-2 px-2">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickNavItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsCommandOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-[#E2DDD2] hover:border-[#FFA2B6] hover:bg-[#FDF2EE] text-left transition-all flex items-center gap-2.5 group"
                      >
                        <div className="p-1.5 rounded-lg bg-[#FAF8F5] group-hover:bg-[#E43D12] group-hover:text-white text-[#E43D12] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-[#1A1412] group-hover:text-[#E43D12] truncate">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Matching Faculty Results */}
              {commandQuery.trim() && (
                <div className="pt-2 border-t border-[#E2DDD2]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#8C827A] mb-2 px-2">
                    Faculty Search Results ({filteredTeachers.length})
                  </p>
                  {filteredTeachers.length > 0 ? (
                    <div className="space-y-1.5">
                      {filteredTeachers.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => {
                            setActiveTab('faculties');
                            setIsCommandOpen(false);
                          }}
                          className="p-2.5 rounded-xl hover:bg-[#FDF2EE] border border-transparent hover:border-[#FFA2B6] cursor-pointer flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E43D12] text-white flex items-center justify-center font-bold text-xs">
                              {t.full_name?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#1A1412]">{t.full_name}</p>
                              <p className="text-[10px] text-[#7A7067] font-mono">{t.emp_id} &bull; {t.department}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#E43D12] bg-[#FDF2EE] px-2 py-0.5 rounded-full border border-[#FFA2B6]">
                            View Profile &rarr;
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8C827A] px-2 py-4 text-center">No faculty matched "{commandQuery}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-[#FAF8F5] border-t border-[#E2DDD2] flex items-center justify-between text-[11px] text-[#8C827A]">
              <span>Navigate with arrow keys or click</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[9px] font-mono border border-[#DDD7CB]">ESC to close</kbd>
            </div>

          </div>
        </div>
      )}

      {/* 5. MODAL: Edit Profile Details */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 bg-[#18110E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E2DDD2] text-slate-800 font-sans animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-600" />
                <h3 className="text-base font-extrabold text-purple-950">Edit Profile Details</h3>
              </div>
              <button 
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input 
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select 
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                <input 
                  type="date"
                  value={editForm.dob}
                  onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Highest Qualification</label>
                <input 
                  type="text"
                  value={editForm.qualification}
                  onChange={(e) => setEditForm({...editForm, qualification: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Specialization / Department</label>
                <input 
                  type="text"
                  value={editForm.specialization}
                  onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  required
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white font-black shadow-md shadow-[#E43D12]/20 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save & Update DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
