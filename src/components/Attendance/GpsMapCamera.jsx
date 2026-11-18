import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, 
  MapPin, 
  Compass, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Clock, 
  Upload,
  AlertOctagon,
  LocateFixed,
  Info
} from 'lucide-react';
import { 
  MIT_CAMPUS_COORDS, 
  reverseGeocode, 
  formatCoordinates, 
  renderGpsMapCamCanvas 
} from '../../utils/gpsMapCam';
import { 
  validateCoordinatesAgainstGeofence, 
  getActiveCampusGeofenceConfig 
} from '../../utils/geofenceConfig';

export const GpsMapCamera = ({ onClose, onSuccess, defaultPunchType = 'IN' }) => {
  const { currentUser, activeTeacher, markAttendance } = useApp();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [cameraState, setCameraState] = useState('initializing'); // 'initializing' | 'streaming' | 'error' | 'captured'
  const [cameraError, setCameraError] = useState(null);

  // Punch options
  const [punchType, setPunchType] = useState(defaultPunchType); // 'IN' | 'OUT'
  const [workMode, setWorkMode] = useState('On Campus');
  const [remarks, setRemarks] = useState('');

  // Live GPS Telemetry - NEVER default to fake campus coordinates
  const [coords, setCoords] = useState(null); // null until locked
  const [gpsStatus, setGpsStatus] = useState('acquiring'); // 'acquiring' | 'locked' | 'denied' | 'error' | 'timeout'
  const [gpsErrorMsg, setGpsErrorMsg] = useState(null);
  const [geofenceResult, setGeofenceResult] = useState(null);
  const [locationName, setLocationName] = useState('Acquiring physical location...');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Captured output
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);

  // Faculty details
  const teacherName = currentUser?.full_name || activeTeacher?.full_name || 'Faculty Member';
  const teacherId = currentUser?.emp_id || activeTeacher?.emp_id || 'MIT-FAC-001';
  const teacherCadre = activeTeacher?.cadre || 'Assistant Professor';
  const teacherDept = activeTeacher?.department || activeTeacher?.current_school || 'School of Engineering (SOE)';

  // 1. Live Clock Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. High-Accuracy GPS Acquisition Engine (Strict - No Fake Fallback)
  const acquireFreshLocation = useCallback(async () => {
    setGpsStatus('acquiring');
    setGpsErrorMsg(null);

    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      setGpsErrorMsg('Geolocation API is not supported by your browser.');
      setLocationName('GPS API Unsupported');
      const badValidation = validateCoordinatesAgainstGeofence(null, null, null);
      setGeofenceResult(badValidation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const alt = position.coords.altitude !== null ? position.coords.altitude : 564.0;
        const acc = position.coords.accuracy || 10.0;

        const liveCoords = {
          latitude: lat,
          longitude: lng,
          altitude: alt,
          accuracy: acc,
          timestamp: position.timestamp || Date.now()
        };

        setCoords(liveCoords);
        setGpsStatus('locked');

        // Execute authoritative geofence validation
        const validation = validateCoordinatesAgainstGeofence(lat, lng, acc);
        setGeofenceResult(validation);

        // Fetch reverse geocode address
        try {
          const geoRes = await reverseGeocode(lat, lng);
          setLocationName(geoRes.locationName);
        } catch (e) {
          setLocationName(`${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`);
        }
      },
      (error) => {
        let errorMsg = 'Failed to acquire location.';
        let status = 'error';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location access denied. Please allow GPS permissions in your browser settings to mark attendance.';
            status = 'denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'GPS satellite signal unavailable. Please ensure location services are enabled on your device.';
            status = 'error';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Retrying satellite connection...';
            status = 'timeout';
            break;
          default:
            errorMsg = error.message || 'GPS acquisition failed.';
            status = 'error';
        }

        console.warn('GPS Error:', status, errorMsg);
        setGpsStatus(status);
        setGpsErrorMsg(errorMsg);
        setCoords(null);
        setLocationName('GPS unavailable');
        
        const invalidValidation = validateCoordinatesAgainstGeofence(null, null, null);
        setGeofenceResult(invalidValidation);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 12000, 
        maximumAge: 0 // STRICT: Never use cached coordinates
      }
    );
  }, []);

  useEffect(() => {
    acquireFreshLocation();
  }, [acquireFreshLocation]);

  // 3. Start Camera Stream
  const startCamera = async (mode = facingMode) => {
    try {
      setCameraState('initializing');
      setCameraError(null);

      // Stop previous tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.setAttribute('muted', 'true');
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.warn('Play video stream error:', e));
        };
      }
      setCameraState('streaming');
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions.');
      setCameraState('error');
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Flip Front/Back Camera
  const toggleCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  // 4. Capture Frame & Burn GPS Map Cam Overlay onto Canvas
  const capturePhoto = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);

    const videoEl = videoRef.current;
    if (!videoEl && cameraState === 'streaming') return;

    const lat = coords ? coords.latitude : null;
    const lng = coords ? coords.longitude : null;
    const alt = coords ? coords.altitude : 564.0;
    const acc = coords ? coords.accuracy : null;

    // Burn GPS overlay directly onto image
    const stampedDataUrl = renderGpsMapCamCanvas({
      sourceImage: videoEl,
      isMirrored: facingMode === 'user',
      facultyName: teacherName,
      empId: teacherId,
      cadre: teacherCadre,
      department: teacherDept,
      latitude: lat,
      longitude: lng,
      altitude: alt,
      accuracy: acc,
      locationName: locationName,
      punchType: punchType,
      workMode: workMode,
      timestamp: currentTime
    });

    setCapturedPhotoUrl(stampedDataUrl);
    setCameraState('captured');

    // Stop camera stream while reviewing
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Handle Simulated/Fallback Image Upload (for devices without active webcam)
  const handleSimulatedImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const lat = coords ? coords.latitude : null;
        const lng = coords ? coords.longitude : null;
        const alt = coords ? coords.altitude : 564.0;
        const acc = coords ? coords.accuracy : null;

        const stampedDataUrl = renderGpsMapCamCanvas({
          sourceImage: img,
          isMirrored: false,
          facultyName: teacherName,
          empId: teacherId,
          cadre: teacherCadre,
          department: teacherDept,
          latitude: lat,
          longitude: lng,
          altitude: alt,
          accuracy: acc,
          locationName: locationName,
          punchType: punchType,
          workMode: workMode,
          timestamp: currentTime
        });
        setCapturedPhotoUrl(stampedDataUrl);
        setCameraState('captured');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Retake Photo
  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    startCamera(facingMode);
  };

  // 5. Submit Attendance Record
  const handleSubmitAttendance = async () => {
    if (!capturedPhotoUrl) return;

    setIsSubmitting(true);
    try {
      await markAttendance({
        punchType: punchType,
        workMode: workMode,
        photoUrl: capturedPhotoUrl,
        latitude: coords ? coords.latitude : null,
        longitude: coords ? coords.longitude : null,
        altitude: coords ? coords.altitude : null,
        accuracy: coords ? coords.accuracy : null,
        locationName: locationName,
        remarks: remarks || `Geo-attendance stamped via GPS Map Camera`
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Error submitting attendance:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedCoords = coords 
    ? formatCoordinates(coords.latitude, coords.longitude) 
    : { latStr: '—', lngStr: '—', combined: 'Coordinates Pending' };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-[#18110E] text-white w-full max-w-2xl rounded-3xl border border-[#E43D12]/30 shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Shutter Flash Animation */}
        {shutterFlash && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150" />
        )}

        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#170E0C] via-[#24130F] to-[#2E1612] border-b border-[#E43D12]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E43D12]/20 border border-[#E43D12]/40 flex items-center justify-center text-[#FFA2B6]">
              <Camera className="w-4 h-4 text-[#FFA2B6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  GPS MAP CAMERA &bull; ATTENDANCE PUNCH
                </h3>
                {gpsStatus === 'locked' && geofenceResult?.isValid && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>CAMPUS VERIFIED</span>
                  </span>
                )}
                {gpsStatus === 'locked' && !geofenceResult?.isValid && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    OUTSIDE CAMPUS
                  </span>
                )}
                {gpsStatus === 'acquiring' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                    ACQUIRING GPS...
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#FFA2B6]">
                {teacherName} &bull; <span className="font-mono text-[#EFB11D]">{teacherId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Controls Bar: Punch Mode & Duty Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#24130F] p-3 rounded-2xl border border-[#E43D12]/20">
            {/* Punch In / Out Toggle */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setPunchType('IN')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  punchType === 'IN'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>Punch In (Arrival)</span>
              </button>
              <button
                type="button"
                onClick={() => setPunchType('OUT')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  punchType === 'OUT'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                <span>Punch Out (Departure)</span>
              </button>
            </div>

            {/* Duty Session Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#FFA2B6] shrink-0">Work Mode:</span>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="flex-1 bg-black/40 border border-[#E43D12]/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E43D12]"
              >
                <option value="On Campus">Regular Campus Duty</option>
                <option value="Lecture & Lab">Lecture & Lab Session</option>
                <option value="Exam Invigilation">Examination Invigilation</option>
                <option value="Research & Field Duty">Research & Field Duty</option>
                <option value="Conference / Workshop">Academic Conference</option>
              </select>
            </div>
          </div>

          {/* Camera Viewfinder / Preview Container */}
          <div className="relative aspect-[4/5] sm:aspect-[4/3] w-full max-h-[440px] bg-black rounded-2xl overflow-hidden border-2 border-[#E43D12]/40 shadow-inner flex items-center justify-center">
            
            {/* Case 1: Captured Stamped Photo Preview */}
            {cameraState === 'captured' && capturedPhotoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img
                  src={capturedPhotoUrl}
                  alt="Captured GPS Map Cam Selfie"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GPS Map Cam Stamp Burned Successfully</span>
                </div>
              </div>
            ) : cameraState === 'error' ? (
              /* Case 2: Camera Error / Fallback UI */
              <div className="p-6 text-center space-y-4 max-w-md">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-white">Camera Access Notice</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cameraError || 'Webcam permission was blocked or unavailable on this device.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Selfie & Stamp GPS</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSimulatedImage}
                  />
                </div>
              </div>
            ) : (
              /* Case 3: Live Video Stream Viewfinder with Real-time GPS Overlay */
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {/* Viewfinder Target Guide / Crosshairs */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-[45%] border-2 border-dashed border-white/40 shadow-sm relative flex items-center justify-center">
                    <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest bg-black/40 px-2 py-0.5 rounded-full">
                      Align Face in Oval
                    </span>
                    {/* Crosshair corners */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#EFB11D]" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#EFB11D]" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#EFB11D]" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#EFB11D]" />
                  </div>
                </div>

                {/* Top Live Bar inside Camera */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono font-bold text-white">LIVE</span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {currentTime.toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Geofence Status Pill on Top Right of Camera Viewfinder */}
                  {gpsStatus === 'acquiring' ? (
                    <div className="px-3 py-1 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 font-extrabold text-[11px] flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Locking GPS...</span>
                    </div>
                  ) : geofenceResult?.isValid ? (
                    <div className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-extrabold text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Inside Campus ({geofenceResult.distanceMeters}m)</span>
                    </div>
                  ) : geofenceResult?.status === 'OUTSIDE_CAMPUS' ? (
                    <div className="px-3 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300 font-extrabold text-[11px] flex items-center gap-1.5">
                      <AlertOctagon className="w-3 h-3 text-rose-400" />
                      <span>Outside Campus ({geofenceResult.distanceMeters >= 1000 ? `${(geofenceResult.distanceMeters / 1000).toFixed(2)}km` : `${geofenceResult.distanceMeters}m`})</span>
                    </div>
                  ) : geofenceResult?.status === 'UNCERTAIN_ACCURACY' ? (
                    <div className="px-3 py-1 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 font-extrabold text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>GPS Low Precision (&plusmn;{geofenceResult.accuracyMeters}m)</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300 font-extrabold text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>GPS Denied / Unavailable</span>
                    </div>
                  )}
                </div>

                {/* Bottom Live HUD Preview inside Camera */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent p-3 pt-8 text-[11px] font-sans pointer-events-none space-y-1">
                  <div className="flex items-center justify-between font-extrabold">
                    <div className="flex items-center gap-1 truncate max-w-[70%] text-[#EFB11D]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-red-400" />
                      <span className="truncate">{locationName}</span>
                    </div>
                    {geofenceResult?.isValid ? (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        &bull; Perimeter OK ({geofenceResult.distanceMeters}m)
                      </span>
                    ) : geofenceResult?.status === 'OUTSIDE_CAMPUS' ? (
                      <span className="text-[10px] text-rose-400 font-mono font-bold">
                        &bull; Outside Perimeter ({geofenceResult.distanceMeters}m)
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono">
                        &bull; Telemetry Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-300">
                    <span>Lat: {formattedCoords.latStr} | Long: {formattedCoords.lngStr}</span>
                    <span className="text-cyan-300">
                      Alt: {coords ? `${coords.altitude.toFixed(1)}m ASL` : '—'} &bull; Prec: &plusmn;{coords?.accuracy ? coords.accuracy.toFixed(1) : '—'}m
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Location & GPS Telemetry Card */}
          <div className="bg-[#24130F] rounded-2xl p-3 border border-[#E43D12]/20 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-[#E43D12]/30 pb-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#E43D12]" />
                <span className="font-extrabold text-white text-[11px] uppercase tracking-wide">
                  GPS Telemetry & Campus Geofence Engine
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={acquireFreshLocation}
                  disabled={gpsStatus === 'acquiring'}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFA2B6] hover:text-white border border-white/15 text-[10px] font-bold transition-all flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${gpsStatus === 'acquiring' ? 'animate-spin' : ''}`} />
                  <span>Refresh GPS</span>
                </button>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/40 text-[#FFA2B6] border border-[#FFA2B6]/30">
                  Precision: &plusmn;{coords?.accuracy ? coords.accuracy.toFixed(1) : '—'}m
                </span>
              </div>
            </div>

            {/* Live GPS Warning / Verification Alert Box */}
            {geofenceResult && (
              <div className={`p-2.5 rounded-xl border flex items-start gap-2 text-[11px] ${
                geofenceResult.isValid
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : geofenceResult.status === 'OUTSIDE_CAMPUS'
                  ? 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                  : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
              }`}>
                {geofenceResult.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-extrabold block text-white">
                    {geofenceResult.badgeText}
                  </span>
                  <p className="opacity-90">{geofenceResult.message}</p>
                </div>
              </div>
            )}

            {/* Telemetry Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Latitude</span>
                <span className="font-mono font-bold text-white">{formattedCoords.latStr}</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Longitude</span>
                <span className="font-mono font-bold text-white">{formattedCoords.lngStr}</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Distance from Center</span>
                <span className={`font-mono font-bold ${geofenceResult?.isInsideCampus ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {geofenceResult?.distanceMeters != null ? `${geofenceResult.distanceMeters}m (Max: 850m)` : '—'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Verification Status</span>
                <span className={`font-bold truncate block ${geofenceResult?.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {geofenceResult?.badgeText || 'Awaiting GPS Lock'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 truncate">
              <strong className="text-[#EFB11D]">Address:</strong> {locationName}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {cameraState === 'captured' ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitAttendance}
                  className={`flex-1 py-3 px-6 rounded-2xl text-white text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 ${
                    geofenceResult?.isValid
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/30'
                      : 'bg-gradient-to-r from-[#E43D12] to-orange-600 hover:from-[#C7310B] hover:to-orange-500 shadow-orange-950/40'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying & Recording Attendance...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Confirm & Mark {punchType === 'IN' ? 'Punch In' : 'Punch Out'}
                        {!geofenceResult?.isValid && ' (Outside Campus)'}
                      </span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Switch Camera Button (if device has front & back camera) */}
                <button
                  type="button"
                  onClick={toggleCamera}
                  title="Switch camera"
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#FFA2B6] hover:text-white border border-white/15 transition-all flex items-center gap-1.5 text-xs font-bold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Flip Camera</span>
                </button>

                {/* Upload Fallback trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload image"
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#FFA2B6] hover:text-white border border-white/15 transition-all flex items-center gap-1.5 text-xs font-bold"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSimulatedImage}
                />

                {/* Shutter Capture Button */}
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 py-3 px-6 rounded-2xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-sm font-black shadow-lg shadow-[#E43D12]/30 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Selfie with GPS Map Cam</span>
                </button>
              </>
            )}
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="px-5 py-2.5 bg-black/70 border-t border-[#E43D12]/30 flex items-center justify-between text-[10px] text-[#FFA2B6]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Cryptographic Stamp &bull; MIT-ADT Rajbaug Campus Geofence Perimeter</span>
          </span>
          <span className="font-mono text-slate-400">
            {currentTime.toLocaleDateString()}
          </span>
        </div>

      </div>
    </div>
  );
};
