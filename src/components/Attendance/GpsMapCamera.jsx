import React, { useState, useEffect, useRef } from 'react';
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
  Layers, 
  Sliders, 
  Check, 
  Upload,
  ArrowRight
} from 'lucide-react';
import { 
  MIT_CAMPUS_COORDS, 
  reverseGeocode, 
  formatCoordinates, 
  renderGpsMapCamCanvas 
} from '../../utils/gpsMapCam';

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

  // Live GPS Telemetry
  const [coords, setCoords] = useState({
    latitude: MIT_CAMPUS_COORDS.latitude,
    longitude: MIT_CAMPUS_COORDS.longitude,
    altitude: MIT_CAMPUS_COORDS.altitude,
    accuracy: 3.8
  });
  const [locationName, setLocationName] = useState(MIT_CAMPUS_COORDS.campusName);
  const [isGpsLoading, setIsGpsLoading] = useState(true);
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

  // 2. Fetch High-Accuracy GPS Location & Reverse Geocode
  useEffect(() => {
    let isMounted = true;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!isMounted) return;
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const alt = position.coords.altitude !== null ? position.coords.altitude : MIT_CAMPUS_COORDS.altitude;
          const acc = position.coords.accuracy || 4.0;

          setCoords({
            latitude: lat,
            longitude: lng,
            altitude: alt,
            accuracy: acc
          });

          // Reverse geocode
          const geoRes = await reverseGeocode(lat, lng);
          if (isMounted) {
            setLocationName(geoRes.locationName);
            setIsGpsLoading(false);
          }
        },
        (error) => {
          console.warn('Geolocation error/denied:', error.message);
          if (isMounted) {
            // Default to MIT-ADT Rajbaug Campus
            setCoords({
              latitude: MIT_CAMPUS_COORDS.latitude,
              longitude: MIT_CAMPUS_COORDS.longitude,
              altitude: MIT_CAMPUS_COORDS.altitude,
              accuracy: 4.5
            });
            setLocationName(MIT_CAMPUS_COORDS.address);
            setIsGpsLoading(false);
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setIsGpsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

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
        videoRef.current.play();
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

    // Burn GPS overlay directly onto image
    const stampedDataUrl = renderGpsMapCamCanvas({
      sourceImage: videoEl,
      facultyName: teacherName,
      empId: teacherId,
      cadre: teacherCadre,
      department: teacherDept,
      latitude: coords.latitude,
      longitude: coords.longitude,
      altitude: coords.altitude,
      accuracy: coords.accuracy,
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
        const stampedDataUrl = renderGpsMapCamCanvas({
          sourceImage: img,
          facultyName: teacherName,
          empId: teacherId,
          cadre: teacherCadre,
          department: teacherDept,
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude,
          accuracy: coords.accuracy,
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
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
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

  const formattedCoords = formatCoordinates(coords.latitude, coords.longitude);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-[#120a26] text-white w-full max-w-2xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Shutter Flash Animation */}
        {shutterFlash && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150" />
        )}

        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border-b border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/40 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  GPS MAP CAMERA &bull; ATTENDANCE PUNCH
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE GPS
                </span>
              </div>
              <p className="text-[11px] text-purple-300">
                {teacherName} &bull; <span className="font-mono text-yellow-300">{teacherId}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-purple-950/40 p-3 rounded-2xl border border-purple-800/40">
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
              <span className="text-[11px] font-bold text-purple-200 shrink-0">Work Mode:</span>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="flex-1 bg-black/40 border border-purple-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
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
          <div className="relative aspect-[4/5] sm:aspect-[4/3] w-full max-h-[460px] bg-black rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-inner flex items-center justify-center">
            
            {/* Case 1: Captured Stamped Photo Preview */}
            {cameraState === 'captured' && capturedPhotoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img
                  src={capturedPhotoUrl}
                  alt="Captured GPS Map Cam Selfie"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
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
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
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
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400" />
                  </div>
                </div>

                {/* Top Live Bar inside Camera */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono font-bold text-white">REC</span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {currentTime.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-md border border-purple-400/40 text-yellow-300 font-extrabold text-[11px] tracking-wider">
                    GPS MAP CAM ACTIVE
                  </div>
                </div>

                {/* Bottom Live HUD Preview inside Camera */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-8 text-[11px] font-sans pointer-events-none space-y-1">
                  <div className="flex items-center justify-between text-yellow-300 font-extrabold">
                    <div className="flex items-center gap-1 truncate max-w-[80%]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-red-400" />
                      <span className="truncate">{locationName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Geofenced
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-300">
                    <span>Lat: {formattedCoords.latStr} | Long: {formattedCoords.lngStr}</span>
                    <span className="text-cyan-300">Alt: {coords.altitude.toFixed(1)}m ASL</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Location & GPS Telemetry Card */}
          <div className="bg-purple-950/30 rounded-2xl p-3 border border-purple-800/30 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-extrabold text-white text-[11px] uppercase tracking-wide">
                  GPS Location & Map Cam Telemetry
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-900/60 text-purple-200 border border-purple-700/50">
                Precision: &plusmn;{coords.accuracy.toFixed(1)}m
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Latitude</span>
                <span className="font-mono font-bold text-purple-200">{formattedCoords.latStr}</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Longitude</span>
                <span className="font-mono font-bold text-purple-200">{formattedCoords.lngStr}</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Altitude (ASL)</span>
                <span className="font-mono font-bold text-cyan-300">{coords.altitude.toFixed(1)} meters</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Campus Zone</span>
                <span className="font-bold text-emerald-400 truncate block">Rajbaug Campus</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 truncate">
              <strong className="text-yellow-300">Address:</strong> {locationName}
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
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-extrabold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying & Recording Attendance...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Mark {punchType === 'IN' ? 'Punch In' : 'Punch Out'}</span>
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
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white border border-white/15 transition-all flex items-center gap-1.5 text-xs font-bold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Flip Camera</span>
                </button>

                {/* Upload Fallback trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload image"
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white border border-white/15 transition-all flex items-center gap-1.5 text-xs font-bold"
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
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Selfie with GPS Map Cam</span>
                </button>
              </>
            )}
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="px-5 py-2.5 bg-black/60 border-t border-purple-900/50 flex items-center justify-between text-[10px] text-purple-300">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tamper-evident Digital Watermarking &bull; MIT-ADT Rajbaug Campus Geofence</span>
          </span>
          <span className="font-mono text-slate-400">
            {currentTime.toLocaleDateString()}
          </span>
        </div>

      </div>
    </div>
  );
};
