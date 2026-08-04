import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeftRight, 
  Award, 
  FileText, 
  Plus, 
  X, 
  Printer
} from 'lucide-react';

export const TransferPromotionModule = () => {
  const { 
    transfers, 
    teachers, 
    addTransferRequest, 
    updateTransferStatus, 
    role, 
    activeTeacher,
    currentUser
  } = useApp();

  const isPrivilegedRole = role === 'admin' || role === 'principal';

  const visibleTransfers = isPrivilegedRole
    ? (transfers || [])
    : (transfers || []).filter(trf =>
        trf?.teacher_id === activeTeacher?.id ||
        trf?.teacher_id === currentUser?.emp_id ||
        trf?.teacher_name === activeTeacher?.full_name ||
        trf?.teacher_name === currentUser?.full_name
      );

  const [activeSubTab, setActiveSubTab] = useState('transfers');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTransferForOrder, setSelectedTransferForOrder] = useState(null);

  const [formData, setFormData] = useState({
    request_type: 'Department Re-allocation',
    target_district: 'Rajbaug Campus (SOE - Loni Kalbhor)',
    target_school: 'Department of Computer Science & Engineering (CSE)',
    reason: ''
  });

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason) return;

    addTransferRequest({
      request_type: formData.request_type,
      target_district: formData.target_district,
      target_school: formData.target_school,
      reason: formData.reason
    });

    setIsTransferModalOpen(false);
    setFormData({ 
      request_type: 'Department Re-allocation', 
      target_district: 'Rajbaug Campus (SOE - Loni Kalbhor)', 
      target_school: '', 
      reason: '' 
    });
  };

  // Resolve missing teacher name, cadre, subject for transfer records
  const resolveTransferDetails = (trf) => {
    const matched = (teachers || []).find(t => t.id === trf.teacher_id || t.emp_id === trf.teacher_id);
    const teacherName = (trf.teacher_name && trf.teacher_name !== 'Faculty Member') 
      ? trf.teacher_name 
      : (matched?.full_name || trf.teacher_name || 'Faculty Member');
    const cadre = trf.cadre || matched?.cadre || 'Assistant Professor';
    const subject = trf.subject || matched?.subject || 'Engineering & Technology';
    return { teacherName, cadre, subject };
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                LIFECYCLE MOBILITY
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-purple-950 mt-1">Faculty Posting, Transfer & Promotion Board</h2>
            <p className="text-xs text-slate-500">
              Transparent inter-department transfer applications, Dean recommendations, Registrar approvals, and academic promotion seniority matrix.
            </p>
          </div>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            File Transfer Application
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 border-t border-purple-100 pt-4">
          <button
            onClick={() => setActiveSubTab('transfers')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'transfers'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Transfer Requests ({visibleTransfers.length})
          </button>

          <button
            onClick={() => setActiveSubTab('promotions')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'promotions'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Award className="w-4 h-4" />
            Promotion Seniority Board
          </button>
        </div>
      </div>

      {/* SUBTAB 1: TRANSFERS */}
      {activeSubTab === 'transfers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleTransfers.length === 0 ? (
            <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-purple-100 text-xs text-slate-400">
              No active transfer applications found.
            </div>
          ) : (
            visibleTransfers.map((trf) => {
              const { teacherName, cadre, subject } = resolveTransferDetails(trf);
              return (
                <div 
                  key={trf.id}
                  className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-3 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                      {trf.request_type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      trf?.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' :
                      trf?.status === 'Rejected' ? 'bg-rose-100 text-rose-900' :
                      'bg-amber-100 text-amber-900'
                    }`}>
                      {trf?.status || 'Pending'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{teacherName}</h4>
                    <p className="text-xs text-slate-500">{cadre} &bull; {subject}</p>
                  </div>

                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Current Posting:</span>
                    <strong className="text-slate-900">{trf.current_district || 'Rajbaug Campus'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Requested Campus / Dept:</span>
                    <strong className="text-purple-700 font-extrabold">{trf.target_district}</strong>
                  </div>
                  {trf.target_school && (
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Target Preference:</span>
                      <strong className="text-slate-700">{trf.target_school}</strong>
                    </div>
                  )}
                  <p className="pt-2 border-t border-purple-100 text-[11px] text-slate-600 italic">
                    &ldquo;{trf.reason}&rdquo;
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Filed: {trf.created_at}</span>

                  <div className="flex items-center gap-2">
                    {role === 'principal' && (trf?.status || '').includes('Pending') && (
                      <button
                        onClick={() => updateTransferStatus(trf.id, 'Recommended by HOD', 'Recommended by School Dean / HOD', true)}
                        className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-extrabold shadow-sm"
                      >
                        Recommend Transfer
                      </button>
                    )}

                    {role === 'admin' && trf?.status !== 'Approved' && (
                      <button
                        onClick={() => updateTransferStatus(trf.id, 'Approved', 'Transfer order generated by Registrar', true)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold shadow-sm"
                      >
                        Issue Approval Order
                      </button>
                    )}

                    {trf?.status === 'Approved' && (
                      <button
                        onClick={() => setSelectedTransferForOrder(trf)}
                        className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 text-xs font-extrabold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      )}

      {/* SUBTAB 2: PROMOTIONS */}
      {activeSubTab === 'promotions' && (
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Seniority & Academic Promotion Matrix 2026
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50 text-purple-950 border-b border-purple-100 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Teacher Name</th>
                  <th className="p-3">Designation / Cadre</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Publications</th>
                  <th className="p-3">API Score</th>
                  <th className="p-3">Promotion Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 text-slate-700">
                {teachers.map((tch, idx) => {
                  const publications = tch.publications || Math.floor(tch.experience_years * 1.5);
                  const apiScore = (tch.experience_years * 4) + (publications * 3) + 25;
                  const isEligible = apiScore >= 60;

                  return (
                    <tr key={tch.id} className="hover:bg-purple-50/50">
                      <td className="p-3 font-extrabold text-purple-900">#{idx + 1}</td>
                      <td className="p-3 font-extrabold text-slate-900">{tch.full_name}</td>
                      <td className="p-3 font-semibold">{tch.cadre} ({tch.subject})</td>
                      <td className="p-3">{tch.experience_years || 5} Years</td>
                      <td className="p-3 font-extrabold text-purple-700">{publications} Papers</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                          {apiScore.toFixed(0)} pts
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isEligible ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isEligible ? 'Eligible for Promotion' : 'In Review'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {isEligible && (
                          <button 
                            onClick={() => alert(`Academic Promotion Order issued for ${tch.full_name}!`)}
                            className="px-3 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-extrabold"
                          >
                            Issue Order
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Apply for Teacher Transfer</h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Transfer Ground / Type</label>
                <select
                  value={formData.request_type}
                  onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="Department Re-allocation">Department Re-allocation</option>
                  <option value="Inter-Institute Transfer">Inter-Institute Transfer</option>
                  <option value="Spouse Ground">Spouse Ground</option>
                  <option value="Hardship / Medical Ground">Hardship / Medical Ground</option>
                  <option value="Research / Lab Re-assignment">Research / Lab Re-assignment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Target MIT-ADT Campus / School</label>
                <select
                  value={formData.target_district}
                  onChange={(e) => setFormData({ ...formData, target_district: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="Rajbaug Campus (SOE - Loni Kalbhor)">Rajbaug Campus (SOE - Loni Kalbhor)</option>
                  <option value="MANET Marine Campus (Loni Kalbhor)">MANET Marine Campus (Loni Kalbhor)</option>
                  <option value="MIT Institute of Design (POD)">MIT Institute of Design (POD)</option>
                  <option value="School of Bioengineering (SOB)">School of Bioengineering (SOB)</option>
                  <option value="School of Architecture (SOA)">School of Architecture (SOA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Target Department / Lab Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Department of AI & Data Science (AIDS), Advanced Computing Lab"
                  value={formData.target_school}
                  onChange={(e) => setFormData({ ...formData, target_school: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Reason / Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State specific academic or personal reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
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

      {/* Official Order Modal */}
      {selectedTransferForOrder && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Official MIT-ADT University Transfer Order</h3>
              <button onClick={() => setSelectedTransferForOrder(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-900 space-y-3 font-sans text-xs">
              <div className="text-center border-b border-purple-200 pb-2">
                <p className="font-extrabold text-sm uppercase text-purple-950">MIT-ADT University Registrar Directorate</p>
                <p className="text-[10px] text-purple-800 font-mono">Official Order No: MIT-TRF-2026-9041</p>
              </div>

              <p className="leading-relaxed">
                Approval is hereby conveyed for the posting transfer of:
              </p>

              <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-1 font-medium">
                <p><strong>Teacher Name:</strong> {selectedTransferForOrder.teacher_name}</p>
                <p><strong>Subject & Cadre:</strong> {selectedTransferForOrder.subject} ({selectedTransferForOrder.cadre})</p>
                <p><strong>Relieved From:</strong> {selectedTransferForOrder.current_school} ({selectedTransferForOrder.current_district})</p>
                <p><strong>Posted To:</strong> {selectedTransferForOrder.target_school || 'Main Department Pool'} ({selectedTransferForOrder.target_district})</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Printer className="w-4 h-4" />
                Print Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

