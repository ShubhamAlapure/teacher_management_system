import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Receipt, 
  Clock, 
  CalendarDays, 
  Plus, 
  FileText, 
  Printer,
  X
} from 'lucide-react';

export const LeavePayrollModule = () => {
  const { 
    leaves, 
    leaveBalances, 
    payroll, 
    addLeaveRequest, 
    updateLeaveStatus, 
    activeTeacher, 
    role 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('leaves');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const teacherBalance = leaveBalances[activeTeacher.id] || { casual: 8, medical: 10, earned: 14, maternity_paternity: 180 };

  const [leaveForm, setLeaveForm] = useState({
    leave_type: 'Casual Leave',
    start_date: '2026-08-05',
    end_date: '2026-08-06',
    total_days: 2,
    reason: ''
  });

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.reason) return;

    addLeaveRequest({
      leave_type: leaveForm.leave_type,
      start_date: leaveForm.start_date,
      end_date: leaveForm.end_date,
      total_days: Number(leaveForm.total_days),
      reason: leaveForm.reason
    });

    setIsLeaveModalOpen(false);
    setLeaveForm({ leave_type: 'Casual Leave', start_date: '', end_date: '', total_days: 1, reason: '' });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                BENEFITS & COMPLIANCE
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-purple-950 mt-1">Leave, Attendance & Payroll Integration</h2>
            <p className="text-xs text-slate-500">
              Track casual/duty leaves, log monthly attendance, and generate official 7th Pay Commission payslips.
            </p>
          </div>

          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </button>
        </div>

        {/* Subtabs Navigation */}
        <div className="flex items-center gap-2 border-t border-purple-100 pt-4">
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'leaves'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            Leave Quota & Requests
          </button>

          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'payroll'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Payroll & Payslips
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'attendance'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Attendance Register
          </button>
        </div>
      </div>

      {/* SUBTAB 1: LEAVES */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-sm">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Casual Leave (CL)</p>
              <p className="text-xl font-extrabold text-purple-950 mt-1">{teacherBalance.casual} Days</p>
              <p className="text-[10px] text-slate-400 mt-1">Remaining for 2026</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-sm">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Medical Leave (ML)</p>
              <p className="text-xl font-extrabold text-purple-950 mt-1">{teacherBalance.medical} Days</p>
              <p className="text-[10px] text-slate-400 mt-1">With medical certificate</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-sm">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Earned Leave (EL)</p>
              <p className="text-xl font-extrabold text-emerald-700 mt-1">{teacherBalance.earned} Days</p>
              <p className="text-[10px] text-slate-400 mt-1">Accumulated credit</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-sm">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Maternity / Paternity</p>
              <p className="text-xl font-extrabold text-blue-700 mt-1">{teacherBalance.maternity_paternity} Days</p>
              <p className="text-[10px] text-slate-400 mt-1">Special leave quota</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-purple-950">Submitted Leave Applications</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50 text-purple-950 border-b border-purple-100 font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Teacher Name</th>
                    <th className="p-3">Leave Type</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Total Days</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 text-slate-700">
                  {leaves.map((l) => (
                    <tr key={l.id} className="hover:bg-purple-50/50">
                      <td className="p-3 font-extrabold text-slate-900">{l.teacher_name}</td>
                      <td className="p-3 text-purple-900 font-bold">{l.leave_type}</td>
                      <td className="p-3 text-slate-600">{l.start_date} to {l.end_date}</td>
                      <td className="p-3 font-extrabold text-slate-900">{l.total_days} Days</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{l.reason}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          l.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' :
                          l.status === 'Rejected' ? 'bg-rose-100 text-rose-900' :
                          'bg-amber-100 text-amber-900'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {(role === 'principal' || role === 'admin') && l.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => updateLeaveStatus(l.id, 'Approved', 'Approved by Principal')}
                              className="px-2.5 py-1 rounded bg-purple-600 text-white text-[10px] font-extrabold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(l.id, 'Rejected', 'Insufficient quota')}
                              className="px-2 py-1 rounded bg-rose-100 text-rose-900 text-[10px] font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PAYROLL */}
      {activeSubTab === 'payroll' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payroll.map((pay) => (
            <div 
              key={pay.id}
              className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4 hover:border-purple-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{pay.teacher_name}</h4>
                  <p className="text-xs text-slate-500">Month: <strong className="text-purple-900">{pay.month_year}</strong></p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                  {pay.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-slate-700">
                <div>
                  <span>Basic Pay:</span>
                  <p className="font-extrabold text-slate-900">₹{pay.basic_pay.toLocaleString()}</p>
                </div>
                <div>
                  <span>DA (50%):</span>
                  <p className="font-extrabold text-emerald-700">+₹{pay.da_amount.toLocaleString()}</p>
                </div>
                <div>
                  <span>HRA (27%):</span>
                  <p className="font-extrabold text-emerald-700">+₹{pay.hra_amount.toLocaleString()}</p>
                </div>
                <div>
                  <span>GPF / NPS:</span>
                  <p className="font-extrabold text-rose-700">-₹{pay.gpf_nps_deduction.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-100">
                <div>
                  <p className="text-[10px] text-slate-500">Net Salary Credited</p>
                  <p className="text-lg font-extrabold text-purple-900">₹{pay.net_salary.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => setSelectedPayslip(pay)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-700 flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download Payslip
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Submit Leave Application</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Leave Category</label>
                <select
                  value={leaveForm.leave_type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Medical Leave">Medical Leave (ML)</option>
                  <option value="Duty Leave (Training)">Duty Leave (Training/Workshop)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.start_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.end_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State reason..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold"
                >
                  File Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Official 7th Pay Payslip</h3>
              <button onClick={() => setSelectedPayslip(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-900 space-y-3 font-sans text-xs">
              <div className="text-center border-b border-purple-200 pb-2">
                <p className="font-extrabold text-sm uppercase text-purple-950">State Education Treasury & Payroll</p>
                <p className="text-[10px] text-purple-800">Salary Statement for {selectedPayslip.month_year}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-purple-200">
                <p><strong>Employee:</strong> {selectedPayslip.teacher_name}</p>
                <p><strong>Emp ID:</strong> {selectedPayslip.emp_id}</p>
                <p><strong>Pay Matrix:</strong> Level 7 (TGT/PGT)</p>
                <p><strong>Status:</strong> Disbursed via Bank Direct Transfer</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1 font-bold text-slate-900">
                <p className="flex justify-between"><span>Basic Pay:</span> <span>₹{selectedPayslip.basic_pay.toLocaleString()}</span></p>
                <p className="flex justify-between text-emerald-700"><span>DA (50%):</span> <span>+₹{selectedPayslip.da_amount.toLocaleString()}</span></p>
                <p className="flex justify-between text-emerald-700"><span>HRA (27%):</span> <span>+₹{selectedPayslip.hra_amount.toLocaleString()}</span></p>
                <p className="flex justify-between text-rose-700"><span>GPF/NPS:</span> <span>-₹{selectedPayslip.gpf_nps_deduction.toLocaleString()}</span></p>
                <div className="pt-2 border-t border-purple-100 flex justify-between text-purple-950 text-sm font-extrabold">
                  <span>NET CREDITED:</span>
                  <span>₹{selectedPayslip.net_salary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
