import React, { useState, useEffect, useMemo } from 'react';
import { useApp, getLocalDateStr } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Filter, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  UserCheck, 
  ChevronRight, 
  Eye, 
  Download, 
  Info,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { detectAttendanceAnomaliesWithGroq } from '../../services/groqService';
import { AttendanceDetailModal } from '../Attendance/AttendanceDetailModal';

export const AiAttendanceAnomalyModule = () => {
  const { role, activeTeacher, teachers, attendance, pushNotification } = useApp();

  const [selectedDepartment, setSelectedDepartment] = useState(() => {
    if (role === 'principal' && activeTeacher?.department && !activeTeacher.department.includes('University Administration')) {
      return activeTeacher.department;
    }
    return 'All Departments';
  });

  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [dateRange, setDateRange] = useState('Current Academic Month');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedProofRecord, setSelectedProofRecord] = useState(null);

  // Dynamic Departments List from Teachers
  const departmentsList = useMemo(() => {
    const raw = (teachers || [])
      .map(t => t.department)
      .filter(d => d && !d.includes('University Administration') && !d.includes('Secretariat'));
    const unique = Array.from(new Set(raw)).sort();
    return ['All Departments', ...unique];
  }, [teachers]);

  // Execute Anomaly Detection
  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const result = await detectAttendanceAnomaliesWithGroq({
        attendanceRecords: attendance || [],
        departmentFilter: selectedDepartment,
        dateRange
      });

      setScanResult(result);
      pushNotification(
        'AI Anomaly Scan Complete', 
        `Groq scanned ${(attendance || []).length} attendance punches across ${selectedDepartment}.`, 
        'success'
      );
    } catch (err) {
      console.error('Attendance anomaly scan error:', err);
      pushNotification('Groq Error', err.message || 'Failed to complete anomaly scan.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Initial scan on mount or department change
  useEffect(() => {
    handleRunScan();
  }, [selectedDepartment]);

  // Filtered anomalies by severity
  const filteredAnomalies = useMemo(() => {
    if (!scanResult?.anomalies) return [];
    if (selectedSeverity === 'All') return scanResult.anomalies;
    return scanResult.anomalies.filter(a => a.severity?.toLowerCase() === selectedSeverity.toLowerCase());
  }, [scanResult, selectedSeverity]);

  // Helper to find punch record for preview
  const handleInspectFaculty = (empId) => {
    const found = (attendance || []).find(a => a.emp_id === empId);
    if (found) {
      setSelectedProofRecord(found);
    } else {
      pushNotification('Notice', `No photo record currently cached for ${empId}.`, 'info');
    }
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#18110E] via-[#24130F] to-[#3B1912] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E43D12]/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15">
          <ShieldAlert className="w-72 h-72 text-[#FFA2B6]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#EFB11D] text-[#191210] uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#191210]" />
                <span>GROQ AI INTELLIGENCE</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase">
                Perimeter & Punctuality Audit
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Deterministic + LLM Engine</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Attendance Anomaly Detection
            </h2>
            <p className="text-xs text-[#EAE4DF] leading-relaxed">
              Automated behavioral integrity analysis across university attendance logs. Identifies persistent late arrivals past 09:00 AM, unclosed departure shifts, and GPS perimeter discrepancies for constructive administrative review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-5 py-3 rounded-2xl bg-[#E43D12] hover:bg-[#C7310B] disabled:opacity-60 text-white text-xs font-black shadow-lg shadow-[#E43D12]/30 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning with Groq...' : 'Run Deep Anomaly Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#5A524D] tracking-wider block">
            Punches Analyzed
          </span>
          <p className="text-2xl font-black text-[#1A1412]">
            {scanResult?.summary?.totalRecords ?? (attendance || []).length}
          </p>
          <span className="text-[10px] text-[#5A524D] block truncate">
            {selectedDepartment}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#5A524D] tracking-wider block">
            Flagged Anomalies
          </span>
          <p className="text-2xl font-black text-[#E43D12]">
            {scanResult?.summary?.anomaliesDetected ?? 0}
          </p>
          <span className="text-[10px] text-[#E43D12] font-semibold block">
            Requires Administrative Review
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#5A524D] tracking-wider block">
            Late Arrival Logs
          </span>
          <p className="text-2xl font-black text-amber-700">
            {scanResult?.summary?.lateArrivals ?? 0}
          </p>
          <span className="text-[10px] text-[#5A524D] block">
            Arrival &gt; 09:00 AM Cutoff
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#5A524D] tracking-wider block">
            Missing Punch-Outs
          </span>
          <p className="text-2xl font-black text-rose-700">
            {scanResult?.summary?.missingPunchOuts ?? 0}
          </p>
          <span className="text-[10px] text-[#5A524D] block">
            Unclosed Shift Records
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#5A524D] tracking-wider block">
            Geofence Breaches
          </span>
          <p className="text-2xl font-black text-purple-700">
            {scanResult?.summary?.outsideCampusPunches ?? 0}
          </p>
          <span className="text-[10px] text-purple-700 font-semibold block">
            &gt; 850m Rajbaug Boundary
          </span>
        </div>
      </div>

      {/* Groq Executive Assessment Card */}
      {scanResult?.executiveAssessment && (
        <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-[#E2DDD2] shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E43D12]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1412]">
                Groq AI Institutional Compliance Assessment
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#E43D12]/10 text-[#E43D12] border border-[#FFA2B6]">
              openai/gpt-oss-120b
            </span>
          </div>
          <p className="text-xs text-[#5A524D] leading-relaxed">
            {scanResult.executiveAssessment}
          </p>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2DDD2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#5A524D]" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-[#FFA2B6] text-xs font-bold text-[#1A1412] bg-[#FAF9F5] outline-none"
            >
              {departmentsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#5A524D]" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-[#FFA2B6] text-xs font-bold text-[#1A1412] bg-[#FAF9F5] outline-none"
            >
              <option value="All">All Severities</option>
              <option value="High">High Severity Only</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[#5A524D] font-mono">
          Showing <strong>{filteredAnomalies.length}</strong> flagged pattern(s)
        </div>
      </div>

      {/* Anomalies List / Cards */}
      {filteredAnomalies.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2DDD2] space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#1A1412]">
              No Critical Attendance Anomalies Detected
            </h4>
            <p className="text-xs text-[#5A524D] max-w-md mx-auto">
              Faculty punches in {selectedDepartment} adhere closely to university shift norms, grace arrival thresholds, and the 850m Rajbaug perimeter.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAnomalies.map((anom, idx) => {
            const isHigh = anom.severity === 'High';
            const isMed = anom.severity === 'Medium';

            return (
              <div 
                key={idx}
                className={`p-5 rounded-3xl border shadow-sm space-y-3 transition-all bg-white ${
                  isHigh 
                    ? 'border-rose-300 hover:border-rose-400' 
                    : isMed 
                    ? 'border-amber-300 hover:border-amber-400' 
                    : 'border-[#E2DDD2] hover:border-[#FFA2B6]'
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isHigh
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : isMed
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {anom.severity} Severity &bull; {anom.anomalyCategory}
                  </span>
                  <span className="text-[10px] font-mono text-[#5A524D] font-bold">
                    {anom.empId}
                  </span>
                </div>

                {/* Faculty Details */}
                <div>
                  <h4 className="text-sm font-black text-[#1A1412]">
                    {anom.facultyName}
                  </h4>
                  <p className="text-[11px] text-[#5A524D]">
                    {anom.department}
                  </p>
                </div>

                {/* Metric Summary Pill */}
                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E2DDD2] text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#1A1412]">
                    <Clock className="w-3.5 h-3.5 text-[#E43D12]" />
                    <span>Observed Pattern:</span>
                  </div>
                  <p className="text-[11px] text-[#5A524D] font-mono">
                    {anom.metricSummary}
                  </p>
                </div>

                {/* Why Flagged (Groq Explanation) */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#5A524D] block">
                    Why Flagged:
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {anom.whyFlagged}
                  </p>
                </div>

                {/* Suggested Review Action */}
                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-purple-900 block">
                    Recommended Administrative Action:
                  </span>
                  <p className="text-purple-900 text-[11px] leading-relaxed">
                    {anom.suggestedAction}
                  </p>
                </div>

                {/* Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleInspectFaculty(anom.empId)}
                    className="text-xs font-bold text-[#E43D12] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Raw GPS Proof</span>
                  </button>
                  <span className="text-[10px] text-slate-400">
                    Review Indicator Only
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Administrative Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Administrative Governance Notice:</strong> Anomaly flags generated by Groq are designed as preliminary decision-support indicators for HOD and Registrar reviews. They do not represent automatic disciplinary penalties or punitive deductions. Faculty are entitled to submit regularization requests for genuine field visits, emergency duties, or approved leaves.
        </p>
      </div>

      {/* Inspection Modal */}
      {selectedProofRecord && (
        <AttendanceDetailModal
          record={selectedProofRecord}
          onClose={() => setSelectedProofRecord(null)}
        />
      )}

    </div>
  );
};
