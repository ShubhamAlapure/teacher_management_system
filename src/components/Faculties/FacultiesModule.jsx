import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  GraduationCap,
  BookOpen,
  Star,
  BadgeCheck,
  Filter,
  Mail,
  Phone,
  Calendar,
  Award
} from 'lucide-react';

export const FacultiesModule = () => {
  const { teachers, applications } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterCadre, setFilterCadre] = useState('All');

  // Exclude system admin from faculty list
  const regularFaculties = teachers.filter(t =>
    !['System Administrator', 'Master Administrator'].includes(t.cadre) &&
    t.emp_id !== 'MIT-MASTER-ADMIN-01'
  );

  // Newly appointed via recruitment (deduplicated)
  const existingEmails = new Set(regularFaculties.map(t => t.email).filter(Boolean));
  const newlyAppointed = applications
    .filter(a => a.status === 'Appointed' && !existingEmails.has(a.email))
    .map(a => ({
      id: a.id,
      emp_id: a.applicant_id || `MIT-REC-${a.id?.slice(-6)}`,
      full_name: a.applicant_name,
      email: a.email || '',
      phone: a.phone || '—',
      cadre: a.applied_post || 'Assistant Professor',
      subject: a.department || 'School of Engineering & Technology (SOE)',
      department: a.department || 'School of Engineering & Technology (SOE)',
      current_school: 'School of Engineering & Technology (SOE)',
      joining_date: a.applied_at || new Date().toISOString().split('T')[0],
      service_status: 'Active',
      experience_years: '—',
      basic_pay: 57700,
      publications: 0,
      source: 'Appointed via Recruitment Drive'
    }));

  const allFaculties = [...regularFaculties, ...newlyAppointed];

  // Department options
  const departments = ['All', ...new Set(allFaculties.map(f => f.department || f.subject).filter(Boolean))];
  const cadres = ['All', ...new Set(allFaculties.map(f => f.cadre).filter(Boolean))];

  // Apply filters
  const filtered = allFaculties.filter(f => {
    const dept = f.department || f.subject || '';
    const matchesDept = filterDept === 'All' || dept === filterDept;
    const matchesCadre = filterCadre === 'All' || f.cadre === filterCadre;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      f.full_name?.toLowerCase().includes(q) ||
      f.emp_id?.toLowerCase().includes(q) ||
      f.cadre?.toLowerCase().includes(q) ||
      dept.toLowerCase().includes(q);
    return matchesDept && matchesCadre && matchesSearch;
  });

  // Stats
  const totalFaculty = allFaculties.length;
  const professors = allFaculties.filter(f => f.cadre?.includes('Professor & HOD') || f.cadre === 'Professor').length;
  const associates = allFaculties.filter(f => f.cadre === 'Associate Professor').length;
  const assistants = allFaculties.filter(f => f.cadre === 'Assistant Professor').length;
  const newAppts = newlyAppointed.length;

  const cadreColor = (cadre = '') => {
    if (cadre.includes('HOD') || cadre === 'Professor') return 'bg-purple-100 text-purple-900 border border-purple-200';
    if (cadre === 'Associate Professor') return 'bg-indigo-100 text-indigo-900 border border-indigo-200';
    if (cadre === 'Assistant Professor') return 'bg-sky-100 text-sky-900 border border-sky-200';
    if (cadre.includes('Dean') || cadre.includes('School Dean')) return 'bg-amber-100 text-amber-900 border border-amber-200';
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  const avatarGradient = (cadre = '') => {
    if (cadre.includes('HOD') || cadre === 'Professor') return 'from-purple-600 to-indigo-700';
    if (cadre === 'Associate Professor') return 'from-indigo-500 to-blue-600';
    if (cadre === 'Assistant Professor') return 'from-sky-500 to-cyan-600';
    if (cadre.includes('Dean')) return 'from-amber-500 to-orange-600';
    return 'from-slate-500 to-slate-700';
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200 uppercase tracking-wide">
              Faculty Registry
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-purple-950">MIT-ADT University Faculty Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All existing faculty members and newly appointed candidates across departments
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/30 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Total: {totalFaculty}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Professor & HOD', value: professors, color: 'bg-purple-50 border-purple-200 text-purple-900', dot: 'bg-purple-600' },
          { label: 'Associate Professor', value: associates, color: 'bg-indigo-50 border-indigo-200 text-indigo-900', dot: 'bg-indigo-600' },
          { label: 'Assistant Professor', value: assistants, color: 'bg-sky-50 border-sky-200 text-sky-900', dot: 'bg-sky-500' },
          { label: 'Newly Appointed', value: newAppts, color: 'bg-emerald-50 border-emerald-200 text-emerald-900', dot: 'bg-emerald-500' },
        ].map(stat => (
          <div key={stat.label} className={`p-4 rounded-2xl border ${stat.color} flex flex-col gap-1`}>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">{stat.label}</span>
            </div>
            <span className="text-2xl font-extrabold">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, dept, designation…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={filterCadre}
            onChange={e => setFilterCadre(e.target.value)}
            className="px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {cadres.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="self-center text-[11px] text-slate-500 font-medium whitespace-nowrap">
          {filtered.length} of {totalFaculty} shown
        </span>
      </div>

      {/* Faculty Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-purple-100 text-slate-400 space-y-3">
          <Users className="w-12 h-12 opacity-25" />
          <p className="text-sm font-semibold">No faculty found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((fac, idx) => (
            <div
              key={fac.id || fac.emp_id || idx}
              className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col gap-4"
            >
              {/* Top: Avatar + Name */}
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradient(fac.cadre)} flex items-center justify-center shrink-0 shadow-lg`}>
                  <span className="text-base font-extrabold text-white">
                    {(fac.full_name || 'F').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-900 truncate">{fac.full_name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{fac.emp_id}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${cadreColor(fac.cadre)}`}>
                    {fac.cadre || 'Faculty'}
                  </span>
                </div>
                {(fac.source === 'Appointed via Recruitment Drive' || fac.source === 'Recruitment Drive') && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                    New
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">{fac.specialization || fac.subject || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span className="truncate">{fac.department || fac.current_school || '—'}</span>
                </div>
                {fac.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="truncate text-slate-500">{fac.email}</span>
                  </div>
                )}
                {fac.phone && fac.phone !== '—' && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{fac.phone}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>Joined: {fac.joining_date || '—'}</span>
                </div>
                <div className="flex items-center gap-3">
                  {fac.experience_years && fac.experience_years !== '—' && (
                    <div className="flex items-center gap-1 text-[10px] text-purple-700 font-bold">
                      <Award className="w-3 h-3" />
                      <span>{fac.experience_years}y exp</span>
                    </div>
                  )}
                  {fac.publications > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-indigo-700 font-bold">
                      <Star className="w-3 h-3" />
                      <span>{fac.publications} pub.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
