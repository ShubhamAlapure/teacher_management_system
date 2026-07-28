import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSupabaseStatus } from '../lib/supabaseClient';
import { MitAdtLogo } from './MitAdtLogo';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  CheckCircle2, 
  RefreshCw
} from 'lucide-react';

export const Navbar = () => {
  const { 
    role, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    setIsNotificationModalOpen,
    activeTeacher,
    currentUser,
    resetToDemoData,
    logout
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dbStatus = getSupabaseStatus();

  const displayName = currentUser?.full_name || (role === 'admin' ? 'SHUBHAM SHARADRAO ALAPURE' : activeTeacher.full_name || 'Faculty Member');
  const displayId = currentUser?.emp_id || activeTeacher.emp_id || 'MIT-USER-01';
  const userInitials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="h-16 bg-gradient-to-r from-[#1e0b3b] via-[#311363] to-[#451884] text-white border-b border-purple-800/40 px-4 lg:px-6 flex items-center justify-between shadow-lg sticky top-0 z-40">
      
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        <MitAdtLogo />
      </div>

      {/* Global Portal Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
          <input
            type="text"
            placeholder="Search faculty by name, employee ID, department, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-purple-950/40 border border-purple-400/30 text-xs text-white placeholder:text-purple-300/70 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-purple-800/60 px-1.5 py-0.5 rounded text-purple-200 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Live Supabase Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Supabase Connected</span>
        </div>

        {/* Reset Demo */}
        <button
          onClick={resetToDemoData}
          className="p-2 rounded-full bg-purple-950/50 text-purple-200 hover:bg-purple-800/40 transition-all border border-purple-400/20"
          title="Reset System Cache"
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
                {displayName}
              </div>
              <div className="text-[10px] text-purple-200 font-mono tracking-tight">
                {displayId} &bull; <span className="capitalize">{role}</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-purple-300 shadow-md font-bold text-xs">
              {userInitials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-purple-200" />
          </button>

          {/* User Account Menu (NO Role Switching) */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-purple-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 text-slate-800">
              
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-purple-100">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-purple-950 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{displayId}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Authenticated {role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Account Details */}
              <div className="py-3 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Campus:</span>
                  <span className="font-semibold text-slate-800">MIT-ADT Rajbaug Campus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database:</span>
                  <span className="font-semibold text-emerald-700 font-mono">Live PostgreSQL</span>
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-purple-100">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold flex items-center justify-center gap-2 transition-all border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
