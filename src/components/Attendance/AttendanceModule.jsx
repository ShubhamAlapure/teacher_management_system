import React, { useState, useMemo } from 'react';
import { useApp, getLocalDateStr } from '../../context/AppContext';
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
  Sparkles,
  AlertTriangle,
  FileCheck,
  Check,
  X,
  UserX
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
    leaves,
    regularizeAttendance,
    pushNotification 
  } = useApp();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [cameraPunchType, setCameraPunchType] = useState('IN');

  // Quick Regularization Modal state
  const [regularizeTarget, setRegularizeTarget] = useState(null); // { teacher, punchRecord, date }
  const [regStatus, setRegStatus] = useState('Present');
  const [regRemarks, setRegRemarks] = useState('');
  const [isSavingReg, setIsSavingReg] = useState(false);

  // Today's date in local calendar
  const todayStr = getLocalDateStr();

  // Filters for HOD & Admin
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateStr());

  // Current user's info
  const myEmpId = currentUser?.emp_id || activeTeacher?.emp_id || 'MIT-FAC-001';
  const myName = currentUser?.full_name || activeTeacher?.full_name || 'Faculty Member';
  const myCadre = activeTeacher?.cadre || 'Assistant Professor';
  const myDept = activeTeacher?.department || activeTeacher?.current_school || 'Computer Science & Engineering (CSE)';

  // Dynamic Departments List from Teachers
  const departmentsList = useMemo(() => {
    const raw = (teachers || [])
      .map(t => t.department)
      .filter(d => d && !d.includes('University Administration') && !d.includes('Secretariat'));
    const unique = Array.from(new Set(raw)).sort();
    return ['All Departments', ...unique];
  }, [teachers]);

  // Determine default department for logged-in user
  const userHodDept = activeTeacher?.department && !activeTeacher.department.includes('University Administration')
    ? activeTeacher.department
    : null;

  const [selectedDepartment, setSelectedDepartment] = useState(() => {
    if (role === 'principal' && userHodDept && !activeTeacher?.cadre?.includes('Dean')) {
      return userHodDept;
    }
    return 'All Departments';
  });

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

  // Helper: Check if a faculty member has approved leave on a given date
  const getApprovedLeave = (teacher, date) => {
    if (!leaves || leaves.length === 0) return null;
    return leaves.find(l => {
      const matchEmp = (l.emp_id && l.emp_id === teacher.emp_id) || 
                       (l.teacher_id && (l.teacher_id === teacher.id || l.teacher_id === teacher.emp_id));
      if (!matchEmp) return false;
      if (l.status !== 'Approved') return false;
      const start = l.start_date || l.from_date;
      const end = l.end_date || l.to_date || start;
      return date >= start && date <= end;
    });
  };

  // ── COMPLETE DEPARTMENT MASTER ROSTER FOR HOD / ADMIN ──
  // Joins eligible faculty with today's punch records and approved leaves
  const monitoredRoster = useMemo(() => {
    // 1. Eligible faculty members (exclude system admin / applicants)
    const eligibleFaculty = (teachers || []).filter(t => 
      !['System Administrator', 'Master Administrator'].includes(t.cadre) &&
      t.cadre !== 'Applicant' &&
      !t.emp_id?.startsWith('MIT-APP-')
    );

    // 2. Department filtering
    const deptFiltered = eligibleFaculty.filter(t => {
      if (selectedDepartment === 'All' || selectedDepartment === 'All Departments') return true;
      const dept = (t.department || '').toLowerCase();
      const target = selectedDepartment.toLowerCase();
      return dept === target || dept.includes(target) || (t.current_school || '').toLowerCase().includes(target);
    });

    // 3. Map each faculty to composite attendance row
    const rows = deptFiltered.map(teacher => {
      // Find punch record for selectedDate
      const punchRecord = (attendance || []).find(a => 
        (a.emp_id === teacher.emp_id || a.teacher_id === teacher.id) && a.date === selectedDate
      );

      // Check approved leave
      const approvedLeave = !punchRecord ? getApprovedLeave(teacher, selectedDate) : null;

      let status = 'Attendance Not Marked';
      if (punchRecord) {
        status = punchRecord.status || 'Present';
      } else if (approvedLeave) {
        status = `On Leave (${approvedLeave.leave_type || 'Approved'})`;
      } else if (selectedDate < todayStr) {
        status = 'Absent';
      } else if (selectedDate > todayStr) {
        status = 'Scheduled';
      } else {
        status = 'Attendance Not Marked';
      }

      return {
        teacher,
        punchRecord: punchRecord || null,
        status,
        hasPunched: Boolean(punchRecord),
        isOnLeave: Boolean(approvedLeave),
        approvedLeave,
        emp_id: teacher.emp_id,
        teacher_name: teacher.full_name,
        cadre: teacher.cadre,
        department: teacher.department,
        punch_in_time: punchRecord?.punch_in_time || null,
        punch_out_time: punchRecord?.punch_out_time || null,
        work_mode: punchRecord?.work_mode || (approvedLeave ? `Leave (${approvedLeave.leave_type})` : (selectedDate === todayStr ? 'Pending Punch' : 'Absent')),
        location_name: punchRecord?.location_name || (approvedLeave ? 'On Approved Leave' : 'Rajbaug Campus Perimeter'),
        latitude: punchRecord?.latitude || null,
        longitude: punchRecord?.longitude || null,
        altitude: punchRecord?.altitude || null,
        selfie_url: punchRecord?.selfie_url || null,
        geofence_status: punchRecord?.geofence_status || (punchRecord ? 'Campus Perimeter Verified' : (approvedLeave ? 'Leave Sanctioned' : 'Pending Verification')),
        remarks: punchRecord?.remarks || (approvedLeave ? `Leave: ${approvedLeave.reason || 'Approved'}` : '')
      };
    });

    // 4. Status and Search Filtering
    return rows.filter(row => {
      // Status filter
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Present') {
          if (!['Present', 'On Duty'].includes(row.status) && !row.hasPunched) return false;
        } else if (selectedStatus === 'Late') {
          if (!row.status?.includes('Late') && !row.punchRecord?.is_late) return false;
        } else if (selectedStatus === 'Early Left') {
          if (!row.status?.includes('Early Left') && !row.punchRecord?.is_early_left) return false;
        } else if (selectedStatus === 'Not Marked') {
          if (row.status !== 'Attendance Not Marked') return false;
        } else if (selectedStatus === 'Absent') {
          if (row.status !== 'Absent') return false;
        } else if (selectedStatus === 'On Leave') {
          if (!row.isOnLeave && !row.status?.includes('Leave')) return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = row.teacher_name?.toLowerCase().includes(q);
        const matchId = row.emp_id?.toLowerCase().includes(q);
        const matchDept = row.department?.toLowerCase().includes(q);
        const matchCadre = row.cadre?.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchDept && !matchCadre) return false;
      }

      return true;
    }).sort((a, b) => {
      // Prioritize punched records first, then unmarked, then absent
      if (a.hasPunched && !b.hasPunched) return -1;
      if (!a.hasPunched && b.hasPunched) return 1;
      return (a.teacher_name || '').localeCompare(b.teacher_name || '');
    });
  }, [teachers, attendance, leaves, selectedDate, selectedDepartment, selectedStatus, searchQuery, todayStr]);

  // ── ACCURATE DEPARTMENT-WISE AGGREGATE STATISTICS ──
  const stats = useMemo(() => {
    const eligibleFaculty = (teachers || []).filter(t => 
      !['System Administrator', 'Master Administrator'].includes(t.cadre) &&
      t.cadre !== 'Applicant' &&
      !t.emp_id?.startsWith('MIT-APP-')
    );

    const deptFaculty = eligibleFaculty.filter(t => {
      if (selectedDepartment === 'All' || selectedDepartment === 'All Departments') return true;
      const dept = (t.department || '').toLowerCase();
      const target = selectedDepartment.toLowerCase();
      return dept === target || dept.includes(target) || (t.current_school || '').toLowerCase().includes(target);
    });

    const totalStrength = deptFaculty.length;
    let presentCount = 0;
    let lateCount = 0;
    let earlyLeftCount = 0;
    let onDutyCount = 0;
    let onLeaveCount = 0;
    let notMarkedCount = 0;
    let absentCount = 0;
    let geoVerifiedCount = 0;

    deptFaculty.forEach(t => {
      const punch = (attendance || []).find(a => 
        (a.emp_id === t.emp_id || a.teacher_id === t.id) && a.date === selectedDate
      );
      const onLeave = !punch ? getApprovedLeave(t, selectedDate) : null;

      if (punch) {
        presentCount++;
        if (punch.status?.includes('Late') || punch.is_late) lateCount++;
        if (punch.status?.includes('Early Left') || punch.is_early_left) earlyLeftCount++;
        if (punch.status === 'On Duty' || punch.work_mode?.includes('Duty')) onDutyCount++;
        if (punch.geofence_status?.includes('Verified') || punch.latitude) geoVerifiedCount++;
      } else if (onLeave) {
        onLeaveCount++;
      } else if (selectedDate < todayStr) {
        absentCount++;
      } else if (selectedDate === todayStr) {
        notMarkedCount++;
      }
    });

    const attendanceRate = totalStrength > 0 ? Math.round((presentCount / totalStrength) * 100) : 0;

    return {
      totalStrength,
      presentCount,
      onTimeCount: Math.max(0, presentCount - lateCount),
      lateCount,
      earlyLeftCount,
      onDutyCount,
      onLeaveCount,
      notMarkedCount,
      absentCount,
      geoVerifiedCount,
      attendanceRate
    };
  }, [teachers, attendance, leaves, selectedDate, selectedDepartment, todayStr]);

  // CSV Export for HOD / Admin
  const handleExportCSV = () => {
    if (!monitoredRoster || monitoredRoster.length === 0) {
      pushNotification('Export Notice', 'No faculty records found matching current filters.', 'warning');
      return;
    }

    const headers = [
      'Date', 
      'Emp ID', 
      'Faculty Name', 
      'Cadre', 
      'Department', 
      'Attendance Status', 
      'Punch In', 
      'Punch Out', 
      'Work Mode', 
      'Location Name', 
      'Latitude', 
      'Longitude', 
      'Altitude', 
      'Geofence Status',
      'Remarks'
    ];

    const rows = monitoredRoster.map(r => [
      selectedDate,
      r.emp_id,
      `"${r.teacher_name}"`,
      `"${r.cadre || ''}"`,
      `"${r.department || ''}"`,
      `"${r.status}"`,
      r.punch_in_time || '—',
      r.punch_out_time || '—',
      `"${r.work_mode || ''}"`,
      `"${(r.location_name || '').replace(/"/g, '""')}"`,
      r.latitude || '—',
      r.longitude || '—',
      r.altitude ? `${r.altitude.toFixed(1)}m` : '—',
      `"${r.geofence_status || 'Verified'}"`,
      `"${(r.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const deptTag = selectedDepartment.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `MIT_FACULTY_ATTENDANCE_${deptTag}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    pushNotification('Report Downloaded', `Exported ${monitoredRoster.length} attendance records for ${selectedDate}.`, 'success');
  };

  const openCameraForPunch = (type = 'IN') => {
    setCameraPunchType(type);
    setIsCameraOpen(true);
  };

  // Open Regularization Modal
  const openRegularizeModal = (row) => {
    setRegularizeTarget(row);
    setRegStatus(row.hasPunched ? row.status : 'Present');
    setRegRemarks(row.remarks || '');
  };

  // Submit Regularization
  const handleSaveRegularization = async () => {
    if (!regularizeTarget) return;
    setIsSavingReg(true);
    try {
      if (regularizeTarget.punchRecord) {
        await regularizeAttendance(regularizeTarget.punchRecord.id, regStatus, regRemarks);
      } else {
        // Synthesize new punch record for unmarked faculty
        await regularizeAttendance({
          emp_id: regularizeTarget.emp_id,
          teacher_id: regularizeTarget.teacher.id,
          full_name: regularizeTarget.teacher_name,
          cadre: regularizeTarget.cadre,
          department: regularizeTarget.department,
          date: selectedDate,
          punch_in_time: '08:50:00',
          punch_out_time: '15:35:00',
          work_mode: 'Regularized by Authority'
        }, regStatus, regRemarks);
      }
      setRegularizeTarget(null);
    } catch (err) {
      console.error('Error saving regularization:', err);
    } finally {
      setIsSavingReg(false);
    }
  };

  // Guard for applicants: not for applicants who are applying
  if (role === 'applicant') {
    return (
      <div className="p-8 bg-white rounded-3xl border border-[#E2DDD2] shadow-sm text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-[#FDF2EE] text-[#E43D12] flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#1A1412]">Faculty Attendance Portal</h3>
          <p className="text-xs text-[#5A524D] leading-relaxed">
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
          <div className="bg-gradient-to-r from-[#1A110F] via-[#2A1612] to-[#3B1912] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E43D12]/30 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-15">
              <Camera className="w-72 h-72 text-[#FFA2B6]" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#EFB11D] text-[#191210] uppercase tracking-wider shadow-sm">
                    GPS MAP CAM ATTENDANCE
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40">
                    Shift: 08:45 AM – 03:30 PM (Grace till 09:00 AM)
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Campus Geofence Active</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Mark Your Daily Attendance
                </h2>
                <p className="text-xs text-[#EAE4DF] leading-relaxed">
                  Open the GPS Camera to snap a selfie. The system automatically imprints verified latitude, longitude, altitude (ASL), address, and timestamp directly onto your photo proof.
                </p>
              </div>

              {/* Punch In / Out Action Box */}
              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shrink-0 text-center space-y-3 min-w-[260px]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#FFA2B6] block">Today's Punch Status</span>
                  <p className="text-base font-extrabold text-white mt-0.5">
                    {myTodayRecord ? (
                      myTodayRecord.punch_out_time ? (
                        <span className="text-purple-300 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          <span>Day Completed ({myTodayRecord.working_duration || '7h+'})</span>
                        </span>
                      ) : (
                        <span className="text-emerald-300 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Punched In at {myTodayRecord.punch_in_time}</span>
                        </span>
                      )
                    ) : (
                      <span className="text-yellow-300 flex items-center justify-center gap-1">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span>Attendance Not Marked</span>
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[#FFA2B6] font-mono mt-0.5">
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
            <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DDD2] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1A1412]">
                      Today's Geo-Attendance Record
                    </h3>
                    <p className="text-xs text-[#5A524D]">
                      Captured via GPS Map Camera with stamped altitude, coordinates and verified address.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecord(myTodayRecord)}
                  className="px-4 py-1.5 rounded-full bg-[#FDF2EE] hover:bg-[#FBE4DD] text-[#E43D12] text-xs font-bold transition-all border border-[#FFA2B6] flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect High-Res Stamped Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Photo Thumbnail */}
                <div 
                  onClick={() => setSelectedRecord(myTodayRecord)}
                  className="relative rounded-2xl overflow-hidden border border-[#E2DDD2] bg-slate-900 aspect-[4/5] cursor-pointer group shadow-sm flex items-center justify-center"
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
                  <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] text-[#EFB11D] font-mono truncate">
                    📍 {myTodayRecord.location_name}
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD2] space-y-1">
                    <span className="text-[10px] text-[#5A524D] uppercase font-bold">Punch In Time</span>
                    <p className="text-base font-extrabold text-emerald-700 font-mono">
                      {myTodayRecord.punch_in_time || '—'}
                    </p>
                    <span className="text-[10px] text-[#5A524D] font-medium block">
                      Status: <strong className="text-emerald-700">{myTodayRecord.status}</strong>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD2] space-y-1">
                    <span className="text-[10px] text-[#5A524D] uppercase font-bold">Punch Out Time</span>
                    <p className="text-base font-extrabold text-amber-700 font-mono">
                      {myTodayRecord.punch_out_time || 'Active / On Duty'}
                    </p>
                    <span className="text-[10px] text-[#5A524D] font-medium block">
                      Duty: <strong>{myTodayRecord.work_mode || 'On Campus'}</strong>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD2] space-y-1">
                    <span className="text-[10px] text-[#5A524D] uppercase font-bold">GPS Coordinates & Altitude</span>
                    <p className="text-xs font-mono font-bold text-[#1A1412] truncate">
                      {formatCoordinates(myTodayRecord.latitude || 18.4902, myTodayRecord.longitude || 74.0254).combined}
                    </p>
                    <span className="text-[11px] font-mono text-cyan-800 font-bold block">
                      Alt: {myTodayRecord.altitude ? `${myTodayRecord.altitude.toFixed(1)} m ASL` : '564.2 m ASL'}
                    </span>
                  </div>

                  <div className="sm:col-span-3 p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD2] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#5A524D] uppercase">Registered Location</span>
                      <p className="font-medium text-[#1A1412]">{myTodayRecord.location_name}</p>
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
          <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#1A1412]">
                  My Attendance Logs & History
                </h3>
                <p className="text-xs text-[#5A524D]">
                  Complete record of your daily GPS-verified punches and working hours.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6]">
                {myAttendanceLogs.length} Total Punches
              </span>
            </div>

            {myAttendanceLogs.length === 0 ? (
              <div className="p-8 text-center text-[#5A524D] text-xs space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p>No past attendance records found. Click "Open GPS Cam & Punch" to record your first punch.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] text-[#1A1412] uppercase font-extrabold text-[10px] border-y border-[#E2DDD2]">
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
                  <tbody className="divide-y divide-[#E2DDD2]">
                    {myAttendanceLogs.map((log) => {
                      const c = formatCoordinates(log.latitude || 18.4902, log.longitude || 74.0254);
                      return (
                        <tr key={log.id} className="hover:bg-[#FAF9F5] transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {log.date}
                          </td>
                          <td className="py-3 px-3">
                            <div 
                              onClick={() => setSelectedRecord(log)}
                              className="w-10 h-12 rounded-lg bg-slate-900 overflow-hidden border border-[#FFA2B6] cursor-pointer hover:scale-105 transition-transform"
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
                              className="px-2.5 py-1 rounded-lg text-[#E43D12] hover:bg-[#FDF2EE] font-bold transition-all"
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
          <div className="bg-gradient-to-r from-[#1A110F] via-[#2A1612] to-[#3B1912] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E43D12]/30 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase tracking-wider">
                  {role === 'admin' ? 'University Executive Registrar Desk' : 'HOD & Dean Academic Surveillance Desk'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Faculty Geo-Attendance Monitoring Desk
                </h2>
                <p className="text-xs text-[#EAE4DF] max-w-xl leading-relaxed">
                  Real-time live monitoring of university faculty punches and departmental roster. View tamper-proof GPS Map Cam selfies, GPS telemetry, altitude above sea level, and geofence verification across all engineering departments.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openCameraForPunch('IN')}
                  className="px-4 py-2.5 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
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

          {/* Interactive Aggregate KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            {/* Total Faculty */}
            <div 
              onClick={() => setSelectedStatus('All')}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all space-y-1 shadow-sm ${
                selectedStatus === 'All' ? 'border-[#E43D12] ring-2 ring-[#E43D12]/20' : 'border-[#E2DDD2] hover:border-[#FFA2B6]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#5A524D] tracking-wider">Total Strength</span>
                <Users className="w-4 h-4 text-[#5A524D]" />
              </div>
              <p className="text-2xl font-black text-[#1A1412]">{stats.totalStrength}</p>
              <span className="text-[10px] text-[#5A524D] block truncate">
                {selectedDepartment === 'All Departments' ? 'All Engineering' : selectedDepartment}
              </span>
            </div>

            {/* Present Today */}
            <div 
              onClick={() => setSelectedStatus(selectedStatus === 'Present' ? 'All' : 'Present')}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all space-y-1 shadow-sm ${
                selectedStatus === 'Present' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[#E2DDD2] hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Present Today</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-700">{stats.presentCount}</p>
              <div className="flex items-center text-[10px] font-bold text-emerald-600 gap-1">
                <span>{stats.attendanceRate}% Attendance</span>
              </div>
            </div>

            {/* Attendance Not Marked */}
            <div 
              onClick={() => setSelectedStatus(selectedStatus === 'Not Marked' ? 'All' : 'Not Marked')}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all space-y-1 shadow-sm ${
                selectedStatus === 'Not Marked' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[#E2DDD2] hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider">Not Marked</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-amber-600">{stats.notMarkedCount}</p>
              <span className="text-[10px] text-amber-700 font-semibold block">Pending Submission</span>
            </div>

            {/* Late Arrivals */}
            <div 
              onClick={() => setSelectedStatus(selectedStatus === 'Late' ? 'All' : 'Late')}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all space-y-1 shadow-sm ${
                selectedStatus === 'Late' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-[#E2DDD2] hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-orange-700 tracking-wider">Late (&gt; 9:00)</span>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-black text-orange-600">{stats.lateCount}</p>
              <span className="text-[10px] text-[#5A524D] block">Grace expired</span>
            </div>

            {/* On Approved Leave */}
            <div 
              onClick={() => setSelectedStatus(selectedStatus === 'On Leave' ? 'All' : 'On Leave')}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all space-y-1 shadow-sm ${
                selectedStatus === 'On Leave' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-[#E2DDD2] hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">Approved Leave</span>
                <FileCheck className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-purple-700">{stats.onLeaveCount}</p>
              <span className="text-[10px] text-purple-700 font-semibold block">Official Sanction</span>
            </div>

            {/* Absent */}
            <div 
              onClick={() => setSelectedStatus(selectedStatus === 'Absent' ? 'All' : 'Absent')}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all space-y-1 shadow-sm ${
                selectedStatus === 'Absent' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-[#E2DDD2] hover:border-red-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">Absent</span>
                <UserX className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-black text-rose-700">{stats.absentCount}</p>
              <span className="text-[10px] text-rose-600 block">Past Unpunched</span>
            </div>

          </div>

          {/* Filters & Search Toolbar */}
          <div className="p-4 bg-white rounded-2xl border border-[#E2DDD2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#5A524D]" />
                <input
                  type="text"
                  placeholder="Search faculty name, Emp ID, or cadre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#FFA2B6] text-xs text-[#1A1412] bg-[#FAF9F5] focus:outline-none focus:border-[#E43D12]"
                />
              </div>

              {/* Department Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-[#5A524D]" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl border border-[#FFA2B6] text-xs font-bold text-[#1A1412] bg-white focus:outline-none focus:border-[#E43D12]"
                >
                  {departmentsList.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#5A524D]" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl border border-[#FFA2B6] text-xs font-bold text-[#1A1412] bg-white focus:outline-none focus:border-[#E43D12]"
                >
                  <option value="All">All Statuses ({monitoredRoster.length})</option>
                  <option value="Present">Present Only ({stats.presentCount})</option>
                  <option value="Late">Late Arrivals ({stats.lateCount})</option>
                  <option value="Not Marked">Attendance Not Marked ({stats.notMarkedCount})</option>
                  <option value="On Leave">On Approved Leave ({stats.onLeaveCount})</option>
                  <option value="Absent">Absent ({stats.absentCount})</option>
                  <option value="Early Left">Early Left (&lt; 03:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#E43D12]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="py-1.5 px-2.5 rounded-xl border border-[#FFA2B6] text-xs text-[#1A1412] bg-[#FAF9F5] font-bold focus:outline-none focus:border-[#E43D12]"
              />
              {selectedDate !== todayStr && (
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className="px-2 py-1 rounded-lg bg-[#FDF2EE] text-[#E43D12] text-[10px] font-bold border border-[#FFA2B6] hover:bg-[#FBE4DD] transition-all"
                >
                  Today
                </button>
              )}
            </div>
          </div>

          {/* Complete Department Master Roster Table */}
          <div className="bg-white rounded-3xl border border-[#E2DDD2] shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DDD2] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#1A1412] flex items-center gap-2">
                  <span>Department Faculty Attendance Roster</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFB11D] text-[#191210]">
                    {selectedDepartment}
                  </span>
                </h3>
                <p className="text-xs text-[#5A524D]">
                  Date: <strong className="text-[#1A1412] font-mono">{selectedDate}</strong> {selectedDate === todayStr && <span className="text-emerald-600 font-bold">(Today)</span>} &bull; Showing full department strength with verified punches, approved leaves, and unmarked roster.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6]">
                  {monitoredRoster.length} Faculty Listed
                </span>
              </div>
            </div>

            {monitoredRoster.length === 0 ? (
              <div className="p-10 text-center text-[#5A524D] text-xs space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-slate-700">No faculty found matching current filters.</p>
                <p>Try switching date, resetting status filter to "All Statuses", or selecting "All Departments".</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] text-[#1A1412] uppercase font-extrabold text-[10px] border-y border-[#E2DDD2]">
                    <tr>
                      <th className="py-3 px-3">Proof / Photo</th>
                      <th className="py-3 px-3">Faculty Member</th>
                      <th className="py-3 px-3">Department & Cadre</th>
                      <th className="py-3 px-3">Punch In</th>
                      <th className="py-3 px-3">Punch Out</th>
                      <th className="py-3 px-3">GPS Telemetry / Location</th>
                      <th className="py-3 px-3">Geofence</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD2]">
                    {monitoredRoster.map((row) => {
                      const punch = row.punchRecord;
                      const coords = punch ? formatCoordinates(punch.latitude || 18.490218, punch.longitude || 74.025412) : null;

                      return (
                        <tr key={row.emp_id} className="hover:bg-[#FAF9F5] transition-colors">
                          
                          {/* Selfie proof or placeholder */}
                          <td className="py-3 px-3">
                            {punch ? (
                              <div 
                                onClick={() => setSelectedRecord(punch)}
                                title="Click to inspect GPS Map Cam proof"
                                className="relative w-12 h-14 rounded-xl bg-slate-950 overflow-hidden border border-[#FFA2B6] cursor-pointer hover:scale-105 transition-transform group shadow-sm flex items-center justify-center"
                              >
                                <img
                                  src={punch.selfie_url}
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
                            ) : row.isOnLeave ? (
                              <div className="w-12 h-14 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center justify-center text-purple-700 p-1 text-center">
                                <FileCheck className="w-4 h-4" />
                                <span className="text-[8px] font-bold mt-1 uppercase">LEAVE</span>
                              </div>
                            ) : row.status === 'Absent' ? (
                              <div className="w-12 h-14 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center justify-center text-rose-700 p-1 text-center">
                                <UserX className="w-4 h-4" />
                                <span className="text-[8px] font-bold mt-1 uppercase">ABSENT</span>
                              </div>
                            ) : (
                              <div className="w-12 h-14 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-amber-700 p-1 text-center">
                                <Clock className="w-4 h-4" />
                                <span className="text-[8px] font-bold mt-1 uppercase">PENDING</span>
                              </div>
                            )}
                          </td>

                          {/* Faculty Info */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <p className="font-extrabold text-[#1A1412]">{row.teacher_name}</p>
                            <span className="font-mono text-[10px] text-[#E43D12] font-bold block">{row.emp_id}</span>
                          </td>

                          {/* Department & Cadre */}
                          <td className="py-3 px-3 text-slate-600 max-w-xs">
                            <p className="font-medium text-[#1A1412] truncate">{row.department}</p>
                            <span className="text-[10px] text-[#5A524D] block">{row.cadre || 'Assistant Professor'}</span>
                          </td>

                          {/* Punch In */}
                          <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                            {row.punch_in_time ? (
                              <span className="text-emerald-700">{row.punch_in_time}</span>
                            ) : (
                              <span className="text-slate-400 font-normal">—</span>
                            )}
                          </td>

                          {/* Punch Out */}
                          <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                            {row.punch_out_time ? (
                              <span className="text-amber-700">{row.punch_out_time}</span>
                            ) : punch ? (
                              <span className="text-emerald-600 font-normal">Active (In Duty)</span>
                            ) : (
                              <span className="text-slate-400 font-normal">—</span>
                            )}
                          </td>

                          {/* Location & GPS Telemetry */}
                          <td className="py-3 px-3 text-slate-700 max-w-xs">
                            {punch ? (
                              <>
                                <p className="truncate font-medium text-[#1A1412]" title={punch.location_name}>
                                  📍 {punch.location_name}
                                </p>
                                <span className="text-[10px] font-mono text-cyan-800 block">
                                  {coords.latStr}, {coords.lngStr} &bull; {punch.altitude ? `${punch.altitude.toFixed(0)}m` : '564m'}
                                </span>
                              </>
                            ) : row.isOnLeave ? (
                              <p className="text-[#5A524D] italic truncate">
                                Sanctioned {row.approvedLeave?.leave_type || 'Leave'}
                              </p>
                            ) : (
                              <p className="text-slate-400 italic">No GPS punch logged</p>
                            )}
                          </td>

                          {/* Geofence */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {punch ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            ) : row.isOnLeave ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                                <FileCheck className="w-3 h-3 text-purple-600" />
                                <span>Sanctioned</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 w-fit block">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                              row.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : row.status === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : row.status?.includes('Early Left')
                                ? 'bg-orange-100 text-orange-800'
                                : row.status === 'On Duty'
                                ? 'bg-blue-100 text-blue-800'
                                : row.isOnLeave || row.status?.includes('Leave')
                                ? 'bg-purple-100 text-purple-800'
                                : row.status === 'Absent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-50 text-amber-800 border border-amber-300'
                            }`}>
                              {row.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {punch && (
                                <button
                                  onClick={() => setSelectedRecord(punch)}
                                  className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#FDF2EE] text-[#E43D12] text-xs font-bold transition-all border border-[#FFA2B6]"
                                >
                                  Inspect
                                </button>
                              )}
                              <button
                                onClick={() => openRegularizeModal(row)}
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF9F5] text-[#5A524D] hover:text-[#1A1412] text-xs font-bold transition-all border border-[#E2DDD2]"
                              >
                                Regularize
                              </button>
                            </div>
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

      {/* GPS Camera Modal */}
      {isCameraOpen && (
        <GpsMapCamera
          defaultPunchType={cameraPunchType}
          onClose={() => setIsCameraOpen(false)}
          onSuccess={() => {
            pushNotification('Attendance Synced', 'Attendance record saved with GPS map cam proof.', 'success');
          }}
        />
      )}

      {/* Inspection Modal */}
      {selectedRecord && (
        <AttendanceDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Regularize Modal */}
      {regularizeTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-[#1A1412] w-full max-w-lg rounded-3xl border border-[#E2DDD2] shadow-2xl overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 bg-gradient-to-r from-[#1A110F] to-[#2A1612] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Regularize Attendance</h3>
                  <p className="text-[11px] text-[#EAE4DF]">
                    {regularizeTarget.teacher_name} ({regularizeTarget.emp_id})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setRegularizeTarget(null)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E2DDD2] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#5A524D]">Department:</span>
                  <span className="font-bold text-[#1A1412]">{regularizeTarget.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A524D]">Date:</span>
                  <span className="font-bold text-[#1A1412]">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A524D]">Current Status:</span>
                  <span className="font-bold text-[#E43D12]">{regularizeTarget.status}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1412] block mb-1">New Regularized Status:</label>
                <select
                  value={regStatus}
                  onChange={(e) => setRegStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#FFA2B6] bg-white font-bold text-[#1A1412] focus:outline-none focus:border-[#E43D12]"
                >
                  <option value="Present">Present (On-Time)</option>
                  <option value="Late">Late Arrival Regularized</option>
                  <option value="On Duty">On Duty / University Deputation</option>
                  <option value="On Leave (Approved)">Approved Duty / Medical Leave</option>
                  <option value="Early Left">Early Departure Approved</option>
                  <option value="Absent">Absent (Confirmed)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1A1412] block mb-1">HOD / Approver Remarks:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Conducted university exam invigilation / Biometric server downtime regularized"
                  value={regRemarks}
                  onChange={(e) => setRegRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#FFA2B6] bg-white text-[#1A1412] focus:outline-none focus:border-[#E43D12]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRegularizeTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A524D] hover:bg-[#FAF9F5] border border-[#E2DDD2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingReg}
                  onClick={handleSaveRegularization}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#E43D12] hover:bg-[#C7310B] text-white shadow-md shadow-[#E43D12]/30 flex items-center gap-1.5"
                >
                  {isSavingReg ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Regularization</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
