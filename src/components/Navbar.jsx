import React, { useState } from 'react';
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
  Save
} from 'lucide-react';

export const Navbar = () => {
  const { 
    role, 
    notifications, 
    setIsNotificationModalOpen,
    activeTeacher,
    currentUser,
    logout,
    updateApplicantProfile
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const displayName = currentUser?.full_name || activeTeacher?.full_name || 'MIT-ADT Staff';
  const displayId = currentUser?.emp_id || activeTeacher?.emp_id || 'MIT-USER-01';
  const userInitials = (displayName || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const [editForm, setEditForm] = useState({
    full_name: currentUser?.full_name || displayName,
    email: currentUser?.email || 'shubhamreddy5003@gmail.com',
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

  return (
    <header className="h-16 bg-gradient-to-r from-[#1e0b3b] via-[#311363] to-[#451884] text-white border-b border-purple-800/40 px-4 lg:px-6 flex items-center justify-between shadow-lg sticky top-0 z-40">
      
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        <MitAdtLogo />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">

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
                {displayId} &bull; <span>{role === 'principal' ? 'School Dean' : role === 'admin' ? 'Master Admin' : role === 'teacher' ? 'Faculty' : 'Applicant'}</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-purple-300 shadow-md font-bold text-xs">
              {userInitials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-purple-200" />
          </button>

          {/* User Account Menu */}
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
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Authenticated {role === 'principal' ? 'SCHOOL DEAN' : role === 'admin' ? 'MASTER ADMIN' : role.toUpperCase()}
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

              {/* Action Buttons: Edit Profile & Sign Out */}
              <div className="pt-2 border-t border-purple-100 space-y-2">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    setIsEditProfileModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                  Edit Profile Details
                </button>

                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  Sign Out of Portal
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* MODAL: Edit Profile Details */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-purple-200 text-slate-800 font-sans animate-in zoom-in-95">
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
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save & Update DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
};
