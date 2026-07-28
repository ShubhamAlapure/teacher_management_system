import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  Plus, 
  Award, 
  Building,
  Calendar,
  X,
  PlusCircle
} from 'lucide-react';

export const RecruitmentModule = () => {
  const { 
    vacancies, 
    applications, 
    addApplication, 
    updateApplicationStatus, 
    role,
    pushNotification,
    isSupabaseConfigured,
    supabase
  } = useApp();

  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAddDriveModalOpen, setIsAddDriveModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  // Form State for Applicant
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    ctet_score: '',
    bed_percentage: '',
    preferred_district: 'Rajbaug Campus'
  });

  // Form State for Posting New Drive
  const [driveForm, setDriveForm] = useState({
    drive_code: `MIT-SOE-${Date.now().toString().slice(-4)}`,
    cadre: 'Assistant Professor',
    subject: 'Computer Science & Engineering (AI/ML)',
    department: 'School of Engineering & Technology (SOE)',
    total_posts: 4,
    basic_pay: 57700,
    deadline: '2026-09-30'
  });

  const handleApplyClick = (vacancy) => {
    setSelectedVacancy(vacancy);
    setFormData({
      applicant_name: '',
      email: '',
      phone: '',
      ctet_score: '',
      bed_percentage: '',
      preferred_district: vacancy?.district || 'Rajbaug Campus'
    });
    setIsApplyModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.applicant_name) return;

    addApplication({
      vacancy_id: selectedVacancy?.id || `vac-${Date.now()}`,
      drive_code: selectedVacancy?.drive_code || 'MIT-DRIVE-2026',
      applicant_name: formData.applicant_name,
      email: formData.email,
      phone: formData.phone,
      ctet_score: Number(formData.ctet_score || 120),
      bed_percentage: Number(formData.bed_percentage || 85),
      preferred_district: formData.preferred_district
    });

    setIsApplyModalOpen(false);
  };

  const handleDriveSubmit = async (e) => {
    e.preventDefault();
    if (!driveForm.drive_code || !driveForm.subject) return;

    const newDrive = {
      id: `vac-${Date.now()}`,
      drive_code: driveForm.drive_code,
      cadre: driveForm.cadre,
      subject: driveForm.subject,
      district: driveForm.department,
      total_posts: Number(driveForm.total_posts),
      status: 'Open',
      deadline: driveForm.deadline,
      created_at: new Date().toISOString().split('T')[0]
    };

    vacancies.unshift(newDrive);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('recruitment_vacancies').insert([{
          drive_code: driveForm.drive_code,
          cadre: driveForm.cadre,
          subject: driveForm.subject,
          district: driveForm.department,
          total_posts: Number(driveForm.total_posts),
          status: 'Open'
        }]);
      } catch (err) {
        console.warn('Supabase vacancy insert fallback:', err);
      }
    }

    pushNotification('Recruitment Drive Posted', `Published Faculty Drive ${driveForm.drive_code} for ${driveForm.subject}.`, 'success');
    setIsAddDriveModalOpen(false);
  };

  const filteredApplications = filterStatus === 'All' 
    ? applications 
    : applications.filter(a => a.status === filterStatus);

  const sampleDrives = vacancies.length > 0 ? vacancies : [
    {
      id: 'vac-1',
      drive_code: 'MIT-SOE-2026-01',
      cadre: 'Assistant Professor',
      subject: 'Computer Science & Artificial Intelligence',
      district: 'School of Engineering & Technology (SOE)',
      total_posts: 5,
      status: 'Open',
      deadline: '2026-09-30'
    },
    {
      id: 'vac-2',
      drive_code: 'MIT-SOE-2026-02',
      cadre: 'Associate Professor',
      subject: 'Data Science & Machine Learning',
      district: 'School of Engineering & Technology (SOE)',
      total_posts: 3,
      status: 'Open',
      deadline: '2026-09-30'
    },
    {
      id: 'vac-3',
      drive_code: 'MIT-MANET-2026-03',
      cadre: 'Assistant Professor',
      subject: 'Marine Engineering & Nautical Science',
      district: 'MANET Rajbaug Campus',
      total_posts: 2,
      status: 'Open',
      deadline: '2026-10-15'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
              RECRUITMENT REPOSITORY
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-purple-950 mt-1">MIT-ADT Faculty Recruitment & Application Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent merit-based faculty recruitment, research API verification, and selection committee ranking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(role === 'admin' || role === 'principal') && (
            <button
              onClick={() => setIsAddDriveModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Vacancy Drive
            </button>
          )}

          <div className="px-4 py-2 rounded-xl bg-purple-50 text-xs text-purple-900 font-bold border border-purple-100">
            Active Drives: {sampleDrives.length}
          </div>
        </div>
      </div>

      {/* Active Faculty Drives Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-purple-600" />
          Active MIT-ADT University Faculty Recruitment Drives 2026
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleDrives.map(drive => (
            <div key={drive.id} className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-3 hover:border-purple-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                    {drive.drive_code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {drive.total_posts} Vacancies
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-purple-950 mt-2">{drive.cadre}</h4>
                <p className="text-xs text-slate-600 font-medium">{drive.subject}</p>
                <p className="text-[11px] text-slate-500 mt-1">{drive.district}</p>
              </div>

              <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Deadline: {drive.deadline || '2026-09-30'}</span>
                <button
                  onClick={() => handleApplyClick(drive)}
                  className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-600" />
              Candidate Applications & Selection Index
            </h3>
            <p className="text-[11px] text-slate-500">
              Selection Index = (API Research Score &times; 0.6) + (Interview Grade &times; 0.4)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-purple-200 text-xs text-slate-900 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Appointed">Appointed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50 text-purple-950 border-b border-purple-100 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Drive Code</th>
                <th className="p-3">Applied Post / Department</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 text-slate-700">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 italic">
                    No recruitment applications registered yet. Click "Apply Now" or "Post New Vacancy Drive".
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-purple-50/50">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900">{app.applicant_name}</p>
                      <p className="text-[11px] text-slate-500">{app.email}</p>
                    </td>
                    <td className="p-3 text-purple-900 font-bold font-mono">{app.drive_code || 'MIT-SOE-2026'}</td>
                    <td className="p-3 text-slate-600">{app.applied_post || 'Assistant Professor (SOE)'}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        app.status === 'Appointed' ? 'bg-emerald-100 text-emerald-900' :
                        app.status === 'Shortlisted' ? 'bg-purple-100 text-purple-900' :
                        app.status === 'Rejected' ? 'bg-rose-100 text-rose-900' :
                        'bg-amber-100 text-amber-900'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {(role === 'principal' || role === 'admin') && app.status === 'Submitted' && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                            className="px-2 py-1 rounded bg-purple-600 text-white text-[10px] font-extrabold"
                          >
                            Shortlist (HOD)
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                            className="px-2 py-1 rounded bg-rose-100 text-rose-900 text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Post New Vacancy Drive */}
      {isAddDriveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-purple-100 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Post New Faculty Recruitment Drive</h3>
              <button onClick={() => setIsAddDriveModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDriveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Drive Code</label>
                <input 
                  type="text" 
                  value={driveForm.drive_code}
                  onChange={(e) => setDriveForm({...driveForm, drive_code: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Faculty Designation / Cadre</label>
                <select 
                  value={driveForm.cadre}
                  onChange={(e) => setDriveForm({...driveForm, cadre: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Research Fellow">Research Fellow</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Specialization</label>
                <input 
                  type="text" 
                  value={driveForm.subject}
                  onChange={(e) => setDriveForm({...driveForm, subject: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department / School</label>
                <input 
                  type="text" 
                  value={driveForm.department}
                  onChange={(e) => setDriveForm({...driveForm, department: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Vacancies</label>
                  <input 
                    type="number" 
                    value={driveForm.total_posts}
                    onChange={(e) => setDriveForm({...driveForm, total_posts: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Deadline</label>
                  <input 
                    type="date" 
                    value={driveForm.deadline}
                    onChange={(e) => setDriveForm({...driveForm, deadline: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddDriveModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md shadow-purple-600/20"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Candidate Application */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-purple-100">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">Faculty Application Form</h3>
                <p className="text-[11px] text-slate-500">Drive: {selectedVacancy?.drive_code}</p>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({...formData, applicant_name: e.target.value})}
                  placeholder="e.g. Dr. SS Reddy"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-purple-200"
                  required
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsApplyModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold shadow-md shadow-purple-600/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
