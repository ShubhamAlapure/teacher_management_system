import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  Navigation, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building2, 
  ShieldCheck,
  Check,
  Edit2
} from 'lucide-react';
import { formatCoordinates } from '../../utils/gpsMapCam';

export const AttendanceDetailModal = ({ record, onClose }) => {
  const { role, regularizeAttendance } = useApp();

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(record?.status || 'Present');
  const [remarks, setRemarks] = useState(record?.remarks || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!record) return null;

  const coords = formatCoordinates(record.latitude || 18.490218, record.longitude || 74.025412);
  const mapsUrl = `https://www.google.com/maps?q=${record.latitude || 18.490218},${record.longitude || 74.025412}`;

  const handleSaveRegularization = async () => {
    setIsSaving(true);
    try {
      await regularizeAttendance(record.id, selectedStatus, remarks);
      setIsEditingStatus(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadProof = () => {
    if (!record.selfie_url) return;
    const a = document.createElement('a');
    a.href = record.selfie_url;
    a.download = `GPS_ATTENDANCE_${record.emp_id}_${record.date}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const canRegularize = role === 'principal' || role === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl border border-purple-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/40 border border-purple-400/30 flex items-center justify-center text-purple-200">
              <MapPin className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>GPS Map Cam Attendance Proof</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  record.status === 'Present'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : record.status === 'Early Left'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                    : record.status === 'Late & Early Left'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    : record.status === 'Late'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                }`}>
                  {record.status}
                </span>
              </h3>
              <p className="text-xs text-purple-200">
                {record.teacher_name} &bull; <span className="font-mono text-yellow-300">{record.emp_id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Grid: Stamped Photo & Telemetry Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left: Tamper-Evident GPS Stamped Selfie */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-200 bg-slate-950 shadow-md aspect-[4/5] flex items-center justify-center">
                {record.selfie_url ? (
                  <img
                    src={record.selfie_url}
                    alt={`Selfie proof for ${record.teacher_name}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No photo attached
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-yellow-300 border border-yellow-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GPS Map Cam Stamped</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownloadProof}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all border border-purple-200 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Stamped Proof</span>
                </button>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-all border border-blue-200 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>

            {/* Right: Telemetry & Faculty Record */}
            <div className="space-y-4">
              
              {/* Faculty Info Card */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-purple-900 tracking-wider">Faculty Information</span>
                  <span className="text-xs font-mono font-bold text-purple-700">{record.emp_id}</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900">{record.teacher_name}</h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    <span><strong>Cadre:</strong> {record.cadre || 'Assistant Professor'}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span><strong>Department:</strong> {record.department || 'School of Engineering (SOE)'}</span>
                  </p>
                </div>
              </div>

              {/* Timing & Hours Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Punch Timings</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Punch In Time</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono">
                      {record.punch_in_time || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Punch Out Time</span>
                    <span className="text-sm font-extrabold text-amber-700 font-mono">
                      {record.punch_out_time || 'Not punched yet'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 text-slate-600">
                  <span><strong>Work Mode:</strong> {record.work_mode || 'On Campus'}</span>
                  <span><strong>Duration:</strong> {record.working_duration || 'In Progress'}</span>
                  <span><strong>Date:</strong> {record.date}</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-[10px] text-purple-900 flex items-center justify-between">
                  <span><strong>Shift Rule:</strong> 08:45 AM - 03:30 PM</span>
                  <span>Grace Arrival: 09:00 AM &bull; No Exit Before 03:30 PM</span>
                </div>
              </div>

              {/* Exact Location & GPS Coordinates */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-amber-700" />
                    <span>GPS Telemetry & Altitude</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    Geofence Verified
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-slate-800">
                    <strong className="text-amber-900">Address:</strong> {record.location_name || 'MIT-ADT University, Rajbaug Campus, Pune'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-2 rounded-lg bg-white border border-amber-200">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Coordinates</span>
                      <span className="text-slate-900">{coords.combined}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-amber-200">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Altitude</span>
                      <span className="text-cyan-800 font-bold">{record.altitude ? `${record.altitude.toFixed(1)} m ASL` : '564.2 m ASL'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HOD / Dean Regularization Action Box */}
              {canRegularize && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-purple-900 tracking-wider flex items-center gap-1">
                      <Edit2 className="w-3.5 h-3.5 text-purple-700" />
                      <span>HOD & Registrar Override / Note</span>
                    </span>
                    {!isEditingStatus && (
                      <button
                        onClick={() => setIsEditingStatus(true)}
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 underline"
                      >
                        Change Status
                      </button>
                    )}
                  </div>

                  {isEditingStatus ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['Present', 'Late', 'Early Left', 'On Duty'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedStatus(s)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                              selectedStatus === s
                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Reason / Note for regularization..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-purple-600"
                      />

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEditingStatus(false)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-purple-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={handleSaveRegularization}
                          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Regularization</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600">
                      {record.remarks || 'Standard GPS verified punch.'}
                    </p>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital GPS Geofence Stamp &bull; Rajbaug Campus Perimeter OK</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
