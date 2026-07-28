import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  User, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  FileText,
  X,
  Building,
  Heart
} from 'lucide-react';

export const ShortlistProfileModal = () => {
  const { 
    currentUser, 
    role, 
    applications, 
    updateApplicantProfile, 
    setActiveTab 
  } = useApp();

  const userEmail = currentUser?.email || '';
  const userEmpId = currentUser?.emp_id || '';
  const userName = currentUser?.full_name || 'Faculty Applicant';

  // Check if candidate is shortlisted or appointed
  const myApp = applications.find(a => 
    (a.applicant_id === userEmpId || (userEmail && a.email && a.email.toLowerCase() === userEmail.toLowerCase()) || a.applicant_name === userName)
  );

  const isShortlisted = myApp ? (myApp.status === 'Shortlisted' || myApp.status === 'Appointed') : (role === 'applicant');
  const isCompleted = currentUser?.profileCompleted || false;

  const [isOpen, setIsOpen] = useState(true);

  const [form, setForm] = useState({
    phone: currentUser?.phone || '+91 9876543210',
    gender: currentUser?.gender || 'Male',
    dob: currentUser?.dob || '1992-05-15',
    qualification: currentUser?.qualification || 'Ph.D. in Computer Science & Engineering',
    specialization: currentUser?.specialization || 'Artificial Intelligence & Machine Learning',
    experience_years: currentUser?.experience_years || 3,
    aadhaar_no: currentUser?.aadhaar_no || '4589-1234-5678',
    emergency_contact: currentUser?.emergency_contact || '+91 9123456789 (Family Contact)'
  });

  if (!isShortlisted || isCompleted || !isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone || !form.qualification) return;

    updateApplicantProfile(userEmpId, form);
    setIsOpen(false);
    setActiveTab('documents');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-purple-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Header Celebration Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-6 rounded-2xl relative overflow-hidden space-y-2 shadow-lg">
          <div className="flex items-center justify-between relative z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-purple-950 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-950" />
              HOD Selection Notification
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-purple-200 hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-black text-white relative z-10">
            🎉 Congratulations, {userName}!
          </h3>
          <p className="text-xs text-purple-200 relative z-10 leading-relaxed">
            You have been <strong className="text-amber-300 font-extrabold">SHORTLISTED</strong> by the School Dean & Selection Committee for the Faculty Appointment Drive (<span className="font-mono text-purple-300">{myApp?.drive_code || 'MIT-SOE-2026'}</span>).
          </p>
          <p className="text-[11px] text-purple-300 font-bold relative z-10 pt-1">
            Please complete your mandatory e-Service Book details below to finalize your registration and proceed to Document Verification.
          </p>
        </div>

        {/* Mandatory Profile Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <h4 className="font-extrabold text-purple-950 text-sm">Mandatory e-Service Book Details</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Contact Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Gender *</label>
              <select 
                value={form.gender}
                onChange={(e) => setForm({...form, gender: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Date of Birth *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({...form, dob: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Highest Academic Qualification *</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  value={form.qualification}
                  onChange={(e) => setForm({...form, qualification: e.target.value})}
                  placeholder="e.g. Ph.D. in Computer Science"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="font-extrabold text-slate-700 block mb-1">Research Specialization & Discipline *</label>
              <input 
                type="text"
                value={form.specialization}
                onChange={(e) => setForm({...form, specialization: e.target.value})}
                placeholder="e.g. Artificial Intelligence, Data Science, Quantum Computing"
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Years of Experience</label>
              <input 
                type="number"
                value={form.experience_years}
                onChange={(e) => setForm({...form, experience_years: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Aadhaar / National ID No</label>
              <input 
                type="text"
                value={form.aadhaar_no}
                onChange={(e) => setForm({...form, aadhaar_no: e.target.value})}
                placeholder="1234-5678-9012"
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-extrabold text-slate-700 block mb-1">Emergency Contact & Relationship</label>
              <input 
                type="text"
                value={form.emergency_contact}
                onChange={(e) => setForm({...form, emergency_contact: e.target.value})}
                placeholder="+91 9123456789 (Family / Spouse)"
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-900 font-medium focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-purple-100 flex gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Remind Later
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Profile & Upload Documents &rarr;
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
