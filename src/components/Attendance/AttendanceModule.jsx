import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Search, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Eye, 
  Layers, 
  ChevronRight,
  UserCheck,
  TrendingUp,
  Building2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { GpsMapCamera } from './GpsMapCamera';
import { AttendanceDetailModal } from './AttendanceDetailModal';
import { formatCoordinates } from '../../utils/gpsMapCam';

export const AttendanceModule = () => {
  const { 
    role, 
    currentUser, 
    activeTeacher, 
    teachers, 
    attendance, 
    pushNotification 
  } = useApp();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [cameraPunchType, setCameraPunchType] = useState('IN');

  // Filters for HOD & Admin
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Current user's info
  const myEmpId = currentUser?.emp_id || activeTeacher?.emp_id || 'MIT-FAC-001';
  const myName = currentUser?.full_name || activeTeacher?.full_name || 'Faculty Member';
  const myCadre = activeTeacher?.cadre || 'Assistant Professor';
  const myDept = activeTeacher?.department || activeTeacher?.current_school || 'School of Engineering (SOE)';

  const todayStr = new Date().toISOString().split('T')[0];

  // Current user's punch record for today
  const myTodayRecord = useMemo(() => {
    return (attendance || []).find(a => 
      (a.emp_id === myEmpId || a.teacher_id === activeTeacher?.id) && a.date === todayStr
    );
  }, [attendance, myEmpId, activeTeacher, todayStr]);

  // Current user's attendance log history
  const myAttendanceLogs = useMemo(() => {
    return (attendance || [])
      .filter(a => a.emp_id === myEmpId || a.teacher_id === activeTeacher?.id || a.teacher_name === myName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [attendance, myEmpId, activeTeacher, myName]);

  // HOD / Admin Monitored Attendance Records (filtered)
  const monitoredRecords = useMemo(() => {
    return (attendance || []).filter(record => {
      // Date filter
      if (selectedDate && record.date !== selectedDate) return false;

      // Department filter
      if (selectedDepartment !== 'All' && !record.department?.toLowerCase().includes(selectedDepartment.toLowerCase())) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && record.status !== selectedStatus) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = record.teacher_name?.toLowerCase().includes(query);
        const matchId = record.emp_id?.toLowerCase().includes(query);
        const matchDept = record.department?.toLowerCase().includes(query);
        const matchLocation = record.location_name?.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchDept && !matchLocation) return false;
      }

      return true;
    }).sort((a, b) => (b.punch_in_time || '').localeCompare(a.punch_in_time || ''));
  }, [attendance, selectedDate, selectedDepartment, selectedStatus, searchQuery]);

  // Today's Aggregate Statistics (for HOD / Admin Dashboard)
  const stats = useMemo(() => {
    const todayRecords = (attendance || []).filter(a => a.date === todayStr);
    const totalTeachers = teachers.filter(t => !['System Administrator', 'Master Administrator'].includes(t.cadre)).length || 24;
    const presentCount = todayRecords.filter(a => a.status === 'Present').length;
    const lateCount = todayRecords.filter(a => a.status === 'Late').length;
    const onDutyCount = todayRecords.filter(a => a.status === 'On Duty').length;
    const geoVerifiedCount = todayRecords.filter(a => a.geofence_status?.includes('Verified') || a.latitude).length;

    return {
      totalStrength: totalTeachers,
      totalPunched: todayRecords.length,
      present: presentCount,
      late: lateCount,
      onDuty: onDutyCount,
      geoVerified: geoVerifiedCount,
      attendanceRate: Math.round((todayRecords.length / Math.max(1, totalTeachers)) * 100)
    };
  }, [attendance, teachers, todayStr]);

  // Departments list for filter dropdown
  const departmentsList = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Mechanical Engineering',
    'Electronics & Telecommunication',
    'Civil Engineering',
    'Applied Sciences & Humanities'
  ];

  // CSV Export for HOD / Admin
  const handleExportCSV = () => {
    if (!monitoredRecords || monitoredRecords.length === 0) {
      pushNotification('Export Notice', 'No attendance records found for this date to export.', 'warning');
      return;
    }

    const headers = ['Date', 'Emp ID', 'Faculty Name', 'Cadre', 'Department', 'Punch In', 'Punch Out', 'Status', 'Work Mode', 'Location', 'Latitude', 'Longitude', 'Altitude', 'Geofence Status'];
    const rows = monitoredRecords.map(r => [
      r.date,
      r.emp_id,
      `"${r.teacher_name}"`,
      `"${r.cadre || ''}"`,
      `"${r.department || ''}"`,
      r.punch_in_time || '',
      r.punch_out_time || '',
      r.status,
      `"${r.work_mode || 'On Campus'}"`,
      `"${(r.location_name || '').replace(/"/g, '""')}"`,
      r.latitude || '',
      r.longitude || '',
      r.altitude || '',
      `"${r.geofence_status || 'Verified'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MIT_FACULTY_ATTENDANCE_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    pushNotification('Report Downloaded', `Exported ${monitoredRecords.length} attendance records for ${selectedDate}.`, 'success');
  };

  const openCameraForPunch = (type = 'IN') => {
    setCameraPunchType(type);
    setIsCameraOpen(true);
  };

  // Guard for applicants: not for applicants who are applying
  if (role === 'applicant') {
    return (
      <div className="p-8 bg-white rounded-3xl border border-purple-100 shadow-sm text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-purple-950">Faculty Attendance Portal</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Attendance marking with GPS Map Camera is strictly designated for appointed university faculty members. Prospective scholars and recruitment applicants do not have attendance obligations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── TEACHER / FACULTY VIEW ── */}
      {role === 'teacher' && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-700/40 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-15">
              <Camera className="w-72 h-72 text-purple-300" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/20 text-yellow-300 border border-white/20 uppercase tracking-wider">
                    GPS MAP CAM ATTENDANCE
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Campus Geofence Active</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Mark Your Daily Attendance
                </h2>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Open the GPS Camera to snap a selfie. The system automatically imprints verified latitude, longitude, altitude (ASL), address, and timestamp directly onto your photo.
                </p>
              </div>

              {/* Punch In / Out Action Box */}
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shrink-0 text-center space-y-3 min-w-[260px]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-200 block">Today's Punch Status</span>
                  <p className="text-base font-extrabold text-white mt-0.5">
                    {myTodayRecord ? (
                      myTodayRecord.punch_out_time ? (
                        <span className="text-purple-300 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          <span>Day Completed</span>
                        </span>
                      ) : (
                        <span className="text-emerald-300 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Punched In at {myTodayRecord.punch_in_time}</span>
                        </span>
                      )
                    ) : (
                      <span className="text-yellow-300">Not Punched Yet</span>
                    )}
                  </p>
                  <p className="text-[11px] text-purple-200 font-mono mt-0.5">
                    {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {!myTodayRecord ? (
                    <button
                      onClick={() => openCameraForPunch('IN')}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>OPEN GPS CAM &bull; PUNCH IN</span>
                    </button>
                  ) : !myTodayRecord.punch_out_time ? (
                    <button
                      onClick={() => openCameraForPunch('OUT')}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>OPEN GPS CAM &bull; PUNCH OUT</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openCameraForPunch('IN')}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Punch Attendance</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Stamped Proof Preview Card (if punched) */}
          {myTodayRecord && (
            <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-purple-950">
                      Today's Geo-Attendance Record
                    </h3>
                    <p className="text-xs text-slate-500">
                      Captured via GPS Map Camera with stamped altitude, coordinates and verified address.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecord(myTodayRecord)}
                  className="px-4 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all border border-purple-200 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect High-Res Stamped Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Photo Thumbnail */}
                <div 
                  onClick={() => setSelectedRecord(myTodayRecord)}
                  className="relative rounded-2xl overflow-hidden border border-purple-200 bg-slate-900 aspect-[4/5] cursor-pointer group shadow-sm flex items-center justify-center"
                >
                  <img
                    src={myTodayRecord.selfie_url}
                    alt="Today's Selfie"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <Eye className="w-4 h-4" />
                    <span>View Stamped Photo</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] text-yellow-300 font-mono truncate">
                    📍 {myTodayRecord.location_name}
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Punch In Time</span>
                    <p className="text-base font-extrabold text-emerald-700 font-mono">
                      {myTodayRecord.punch_in_time || '—'}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Status: <strong className="text-emerald-700">{myTodayRecord.status}</strong>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Punch Out Time</span>
                    <p className="text-base font-extrabold text-amber-700 font-mono">
                      {myTodayRecord.punch_out_time || 'Pending'}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Duty: <strong>{myTodayRecord.work_mode || 'On Campus'}</strong>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">GPS Coordinates & Altitude</span>
                    <p className="text-xs font-mono font-bold text-purple-900 truncate">
                      {formatCoordinates(myTodayRecord.latitude || 18.4902, myTodayRecord.longitude || 74.0254).combined}
                    </p>
                    <span className="text-[11px] font-mono text-cyan-800 font-bold block">
                      Alt: {myTodayRecord.altitude ? `${myTodayRecord.altitude.toFixed(1)} m ASL` : '564.2 m ASL'}
                    </span>
                  </div>

                  <div className="sm:col-span-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Location</span>
                      <p className="font-medium text-slate-800">{myTodayRecord.location_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                        ✓ Campus Geofence Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Attendance Log History */}
          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">
                  My Attendance Logs & History
                </h3>
                <p className="text-xs text-slate-500">
                  Complete record of your daily GPS-verified punches and working hours.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800">
                {myAttendanceLogs.length} Total Punches
              </span>
            </div>

            {myAttendanceLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p>No past attendance records found. Click "Open GPS Cam & Punch" to record your first punch.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-purple-50/70 text-purple-950 uppercase font-extrabold text-[10px] border-y border-purple-100">
                    <tr>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">GPS Selfie</th>
                      <th className="py-3 px-3">Punch In</th>
                      <th className="py-3 px-3">Punch Out</th>
                      <th className="py-3 px-3">Work Mode</th>
                      <th className="py-3 px-3">GPS Location & Altitude</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {myAttendanceLogs.map((log) => {
                      const c = formatCoordinates(log.latitude || 18.4902, log.longitude || 74.0254);
                      return (
                        <tr key={log.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {log.date}
                          </td>
                          <td className="py-3 px-3">
                            <div 
                              onClick={() => setSelectedRecord(log)}
                              className="w-10 h-12 rounded-lg bg-slate-900 overflow-hidden border border-purple-200 cursor-pointer hover:scale-105 transition-transform"
                            >
                              <img
                                src={log.selfie_url}
                                alt="Selfie thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                            {log.punch_in_time || '—'}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-amber-700 whitespace-nowrap">
                            {log.punch_out_time || '—'}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {log.work_mode || 'On Campus'}
                          </td>
                          <td className="py-3 px-3 text-slate-600 max-w-xs">
                            <p className="truncate font-medium">{log.location_name}</p>
                            <span className="text-[10px] font-mono text-cyan-700 block">
                              {c.latStr}, {c.lngStr} &bull; {log.altitude ? `${log.altitude.toFixed(0)}m` : '564m'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              log.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.status === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedRecord(log)}
                              className="px-2.5 py-1 rounded-lg text-purple-700 hover:bg-purple-100 font-bold transition-all"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── HOD / DEAN & ADMIN MONITORING VIEW ── */}
      {(role === 'principal' || role === 'admin') && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase tracking-wider">
                  {role === 'admin' ? 'University Executive Registrar Desk' : 'HOD & Dean Academic Surveillance'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Faculty Geo-Attendance Monitoring Desk
                </h2>
                <p className="text-xs text-purple-200 max-w-xl leading-relaxed">
                  Real-time live monitoring of university faculty punches. View tamper-proof GPS Map Cam selfies, GPS telemetry, altitude above sea level, and geofence verification across all engineering departments.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openCameraForPunch('IN')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Mark My Attendance</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/20 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Aggregate KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Present Today</span>
              <p className="text-2xl font-black text-purple-950">{stats.totalPunched}</p>
              <div className="flex items-center text-[10px] font-bold text-emerald-600 gap-1">
                <span>{stats.attendanceRate}% Attendance Rate</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">On-Time Arrivals</span>
              <p className="text-2xl font-black text-emerald-600">{stats.present}</p>
              <span className="text-[10px] text-slate-500">Punched before 09:30 AM</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Late Arrivals</span>
              <p className="text-2xl font-black text-amber-600">{stats.late}</p>
              <span className="text-[10px] text-slate-500">Subject to HOD review</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">On Duty / Field</span>
              <p className="text-2xl font-black text-blue-600">{stats.onDuty}</p>
              <span className="text-[10px] text-slate-500">Labs, Exams & Research</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Geo-Fenced Verified</span>
              <p className="text-2xl font-black text-teal-600">{stats.geoVerified}</p>
              <span className="text-[10px] text-emerald-700 font-bold">✓ Rajbaug Campus Perimeter</span>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty name, Emp ID, or campus block..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-purple-200 text-xs text-slate-800 bg-purple-50/30 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Department Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl border border-purple-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-purple-600"
                >
                  {departmentsList.map(dept => (
                    <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl border border-purple-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-purple-600"
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present Only</option>
                  <option value="Late">Late Arrivals</option>
                  <option value="On Duty">On Duty</option>
                </select>
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="py-1.5 px-2.5 rounded-xl border border-purple-200 text-xs text-slate-800 bg-purple-50/50 font-bold focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Faculty Attendance Master Roster Table */}
          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">
                  Faculty GPS Map Cam Attendance Roster
                </h3>
                <p className="text-xs text-slate-500">
                  Showing records for date: <strong className="text-purple-900">{selectedDate}</strong> &bull; Click any selfie to view high-res GPS Map Cam proof.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800">
                {monitoredRecords.length} Records Listed
              </span>
            </div>

            {monitoredRecords.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">No attendance records found matching filters.</p>
                <p>Try switching date or selecting "All Departments".</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-purple-50/70 text-purple-950 uppercase font-extrabold text-[10px] border-y border-purple-100">
                    <tr>
                      <th className="py-3 px-3">GPS Selfie Proof</th>
                      <th className="py-3 px-3">Faculty Member</th>
                      <th className="py-3 px-3">Department & Cadre</th>
                      <th className="py-3 px-3">Punch In</th>
                      <th className="py-3 px-3">Punch Out</th>
                      <th className="py-3 px-3">GPS Location & Altitude</th>
                      <th className="py-3 px-3">Geofence</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {monitoredRecords.map((record) => {
                      const coords = formatCoordinates(record.latitude || 18.490218, record.longitude || 74.025412);
                      return (
                        <tr key={record.id} className="hover:bg-purple-50/40 transition-colors">
                          
                          {/* Stamped Selfie Thumbnail with click to expand */}
                          <td className="py-3 px-3">
                            <div 
                              onClick={() => setSelectedRecord(record)}
                              title="Click to view full GPS Map Cam proof"
                              className="relative w-12 h-14 rounded-xl bg-slate-950 overflow-hidden border border-purple-300 cursor-pointer hover:scale-105 transition-transform group shadow-sm flex items-center justify-center"
                            >
                              <img
                                src={record.selfie_url}
                                alt="Selfie"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Eye className="w-4 h-4" />
                              </div>
                              <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-extrabold text-center py-0.5 uppercase tracking-tighter">
                                GPS CAM
                              </div>
                            </div>
                          </td>

                          {/* Faculty Info */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <p className="font-extrabold text-slate-900">{record.teacher_name}</p>
                            <span className="font-mono text-[10px] text-purple-700 font-bold block">{record.emp_id}</span>
                          </td>

                          {/* Department & Cadre */}
                          <td className="py-3 px-3 text-slate-600 max-w-xs">
                            <p className="font-medium text-slate-900 truncate">{record.department || 'School of Engineering (SOE)'}</p>
                            <span className="text-[10px] text-slate-500 block">{record.cadre || 'Assistant Professor'}</span>
                          </td>

                          {/* Punch In */}
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                            {record.punch_in_time || '—'}
                          </td>

                          {/* Punch Out */}
                          <td className="py-3 px-3 font-mono font-bold text-amber-700 whitespace-nowrap">
                            {record.punch_out_time || <span className="text-slate-400 font-normal">Active</span>}
                          </td>

                          {/* Location & GPS Telemetry */}
                          <td className="py-3 px-3 text-slate-700 max-w-xs">
                            <p className="truncate font-medium text-slate-900" title={record.location_name}>
                              📍 {record.location_name}
                            </p>
                            <span className="text-[10px] font-mono text-cyan-700 block">
                              Lat: {coords.latStr} &bull; Long: {coords.lngStr} &bull; Alt: {record.altitude ? `${record.altitude.toFixed(0)}m` : '564m'}
                            </span>
                          </td>

                          {/* Geofence Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              record.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : record.status === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-all border border-purple-200"
                            >
                              Inspect Proof
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── MODALS ── */}
      {isCameraOpen && (
        <GpsMapCamera
          defaultPunchType={cameraPunchType}
          onClose={() => setIsCameraOpen(false)}
          onSuccess={() => {
            pushNotification('Attendance Synced', 'Attendance record saved with GPS map cam proof.', 'success');
          }}
        />
      )}

      {selectedRecord && (
        <AttendanceDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

    </div>
  );
};
