import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MitAdtLogo } from './MitAdtLogo';
import { 
  GraduationCap, 
  Bell, 
  Search, 
  Database, 
  Building2, 
  User, 
  ShieldCheck, 
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { getSupabaseStatus } from '../lib/supabaseClient';

export const Navbar = () => {
  const { 
    role, 
    setRole, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    setIsSupabaseModalOpen,
    setIsNotificationModalOpen,
    activeTeacher,
    resetToDemoData,
    logout
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dbStatus = getSupabaseStatus();

  const rolesList = [
    { key: 'applicant', label: 'Faculty Applicant', icon: User, desc: 'Apply for recruitment drives & track application status' },
    { key: 'teacher', label: 'Faculty Member', icon: GraduationCap, desc: 'View e-Service Book, file transfers, leaves & payslips' },
    { key: 'principal', label: 'HOD / School Dean', icon: Building2, desc: 'Approve faculty leaves, recommend transfers & grade APAR' },
    { key: 'admin', label: 'University Registrar', icon: ShieldCheck, desc: 'Issue appointment orders, approve transfers & analytics' }
  ];

  const currentRoleObj = rolesList.find(r => r.key === role) || rolesList[1];

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#27104e] via-[#3a1873] to-[#4b1d91] text-white shadow-md px-4 lg:px-8 py-3 border-b border-purple-800/40">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Official MIT-ADT University Logo Component */}
        <div className="flex items-center gap-3">
          <MitAdtLogo />
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
            <input
              type="text"
              placeholder="Search by Emp ID, Teacher Name, Department, Order No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-purple-950/50 border border-purple-400/30 text-white text-xs placeholder:text-purple-300/70 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </div>

        {/* Right Side User Profile & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Supabase Status Trigger */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              dbStatus.configured 
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200' 
                : 'bg-purple-950/60 border-purple-400/30 text-purple-200 hover:bg-purple-800/40'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{dbStatus.configured ? 'Supabase' : 'Mock Data'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Reset Demo */}
          <button
            onClick={resetToDemoData}
            className="p-2 rounded-full bg-purple-950/50 text-purple-200 hover:bg-purple-800/40 transition-all border border-purple-400/20"
            title="Reset Demo Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="relative p-2 rounded-full bg-purple-950/50 text-purple-200 hover:bg-purple-800/40 transition-all border border-purple-400/20"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-[10px] font-extrabold text-purple-950 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* User Profile Card Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-3 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-400/30 hover:bg-purple-800/50 transition-all text-right"
            >
              <div className="hidden lg:block">
                <div className="text-xs font-extrabold uppercase text-white tracking-wide">
                  SHUBHAM SHARADRAO ALAPURE
                </div>
                <div className="text-[10px] text-purple-200 font-mono tracking-tight">
                  {role === 'applicant' ? 'ADT24SOCB1153' : activeTeacher.emp_id} &bull; <span className="capitalize">{role}</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-purple-300 shadow-md font-bold text-xs">
                SA
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-purple-200" />
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-purple-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 text-slate-800">
                <div className="px-3 py-2 border-b border-purple-100">
                  <p className="text-[10px] uppercase font-bold text-purple-900 tracking-wider">
                    Switch Portal Persona
                  </p>
                </div>
                <div className="py-1 space-y-1">
                  {rolesList.map((r) => {
                    const IconComp = r.icon;
                    const isSelected = r.key === role;
                    return (
                      <button
                        key={r.key}
                        onClick={() => {
                          setRole(r.key);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left ${
                          isSelected 
                            ? 'bg-purple-100 text-purple-950 font-bold border border-purple-300' 
                            : 'hover:bg-purple-50 text-slate-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg mt-0.5 ${isSelected ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{r.label}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-purple-100">
                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      logout();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold flex items-center justify-center gap-2 transition-all"
                  >
                    Sign Out to Login Page
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
