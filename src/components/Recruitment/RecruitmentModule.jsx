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
  X
} from 'lucide-react';

export const RecruitmentModule = () => {
  const { 
    vacancies, 
    applications, 
    addApplication, 
    updateApplicationStatus, 
    role 
  } = useApp();

  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    ctet_score: '',
    bed_percentage: '',
    preferred_district: 'Patna'
  });

  const handleApplyClick = (vacancy) => {
    setSelectedVacancy(vacancy);
    setFormData({
      applicant_name: '',
      email: '',
      phone: '',
      ctet_score: '',
      bed_percentage: '',
      preferred_district: vacancy.district
    });
    setIsApplyModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.applicant_name || !formData.ctet_score || !formData.bed_percentage) return;

    addApplication({
      vacancy_id: selectedVacancy.id,
      drive_code: selectedVacancy.drive_code,
      applicant_name: formData.applicant_name,
      email: formData.email,
      phone: formData.phone,
      ctet_score: Number(formData.ctet_score),
      bed_percentage: Number(formData.bed_percentage),
      preferred_district: formData.preferred_district
    });

    setIsApplyModalOpen(false);
  };

  const filteredApplications = filterStatus === 'All' 
    ? applications 
    : applications.filter(a => a.status === filterStatus);

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
          <div className="px-4 py-2 rounded-xl bg-purple-50 text-xs text-purple-900 font-bold border border-purple-100">
            Active Drives: {vacancies.length}
          </div>
          <div className="px-4 py-2 rounded-xl bg-purple-100 text-xs text-purple-900 font-extrabold border border-purple-200">
            Applications: {applications.length}
          </div>
        </div>
      </div>

      {/* Vacancy Openings Cards */}
      <div>
        <h3 className="text-sm font-extrabold text-purple-950 mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-purple-600" />
          Active MIT-ADT University Faculty Drives 2026
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vacancies.map((vac) => (
            <div 
              key={vac.id}
              className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-900 font-bold">
                    {vac.drive_code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                    {vac.cadre}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{vac.title}</h4>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-purple-500" />
                    <span>School: <strong className="text-slate-900">{vac.district}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-purple-500" />
                    <span>Requirement: {vac.min_qualification}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>Deadline: {vac.application_deadline}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Total Posts</p>
                  <p className="text-xs font-bold text-slate-900">{vac.filled_posts} / {vac.total_posts} Filled</p>
                </div>

                <button
                  onClick={() => handleApplyClick(vac)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/20 transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Management Table */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-600" />
              Candidate Applications & Merit Index
            </h3>
            <p className="text-xs text-slate-500">Merit Index = (CTET Score/150 &times; 50) + (B.Ed % &times; 0.5)</p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-bold text-slate-600">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-purple-200 text-xs text-slate-800 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Document Verification">Document Verification</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Merit List">Merit List</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50 text-purple-950 border-b border-purple-100 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Drive Code</th>
                <th className="p-3">CTET Score</th>
                <th className="p-3">B.Ed Marks</th>
                <th className="p-3">Merit Index</th>
                <th className="p-3">District</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 text-slate-700">
              {filteredApplications.map((app) => {
                const meritIndex = ((app.ctet_score / 150) * 50 + app.bed_percentage * 0.5).toFixed(1);

                return (
                  <tr key={app.id} className="hover:bg-purple-50/50 transition-all">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900">{app.applicant_name}</p>
                      <p className="text-[10px] text-slate-500">{app.email}</p>
                    </td>
                    <td className="p-3 font-mono text-purple-900 font-bold">{app.drive_code}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-extrabold">
                        {app.ctet_score} / 150
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{app.bed_percentage}%</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                        {meritIndex} pts
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{app.preferred_district}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        app.status === 'Merit List' ? 'bg-purple-600 text-white' :
                        app.status === 'Shortlisted' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                        app.status === 'Document Verification' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'Document Verification', 'Verified CTET & Marks')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-800 font-bold transition-all"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'Merit List', 'Ranked in District Merit List')}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-extrabold transition-all"
                        >
                          Shortlist
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Form Modal */}
      {isApplyModalOpen && selectedVacancy && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">Teacher Application Form</h3>
                <p className="text-xs text-slate-500">{selectedVacancy.title}</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Full Name of Applicant</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amitabh Sen"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">CTET Score (Out of 150)</label>
                  <input
                    type="number"
                    min="90"
                    max="150"
                    required
                    placeholder="128"
                    value={formData.ctet_score}
                    onChange={(e) => setFormData({ ...formData, ctet_score: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">B.Ed / D.El.Ed %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="50"
                    max="100"
                    required
                    placeholder="84.5"
                    value={formData.bed_percentage}
                    onChange={(e) => setFormData({ ...formData, bed_percentage: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Preferred District</label>
                <select
                  value={formData.preferred_district}
                  onChange={(e) => setFormData({ ...formData, preferred_district: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="Patna">Patna</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Muzaffarpur">Muzaffarpur</option>
                  <option value="Nalanda">Nalanda</option>
                </select>
              </div>

              <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/20"
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
