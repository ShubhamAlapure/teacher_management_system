// Helper to generate sample GPS Map Cam stamped selfie photos for mock initial data
export function createSampleGpsSelfieSvg({
  name = 'Faculty Member',
  empId = 'MIT-FAC-001',
  time = '09:12 AM',
  date = '25 Sep 2026',
  lat = '18.49022° N',
  lng = '74.02541° E',
  alt = '564.2 m ASL',
  location = 'MIT-ADT University, Rajbaug, Pune',
  punchType = 'PUNCH IN',
  avatarBg = '#31105e'
}) {
  const isPunchIn = punchType.includes('IN');
  const badgeColor = isPunchIn ? '#10b981' : '#f59e0b';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${avatarBg}"/>
        <stop offset="50%" stop-color="#190a36"/>
        <stop offset="100%" stop-color="#090414"/>
      </linearGradient>
      <linearGradient id="banner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(10, 8, 22, 0.2)"/>
        <stop offset="25%" stop-color="rgba(12, 9, 28, 0.95)"/>
        <stop offset="100%" stop-color="#070311"/>
      </linearGradient>
    </defs>

    <!-- Background Silhouette / Faculty Selfie Mock -->
    <rect width="600" height="750" fill="url(#bg)"/>
    
    <!-- Face & Body Silhouette -->
    <circle cx="300" cy="260" r="110" fill="#f8fafc" opacity="0.18"/>
    <path d="M 170 540 C 170 420, 430 420, 430 540 Z" fill="#f8fafc" opacity="0.14"/>
    <circle cx="300" cy="245" r="75" fill="#f8fafc" opacity="0.25"/>

    <!-- Top Status Bar -->
    <rect x="0" y="0" width="600" height="70" fill="rgba(0,0,0,0.6)"/>
    <rect x="25" y="16" width="160" height="36" rx="18" fill="rgba(15,23,42,0.85)" stroke="${badgeColor}" stroke-width="2"/>
    <circle cx="44" cy="34" r="6" fill="${badgeColor}"/>
    <text x="60" y="39" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">${punchType}</text>

    <text x="575" y="39" fill="#fde047" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" text-anchor="end">MIT-ADT UNIVERSITY</text>

    <!-- Bottom GPS Map Cam Overlay Banner -->
    <rect x="0" y="470" width="600" height="280" fill="url(#banner)"/>
    <rect x="25" y="485" width="550" height="2" fill="#8b5cf6"/>

    <!-- Mini Radar / Compass Box -->
    <rect x="25" y="505" width="110" height="110" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <line x1="25" y1="560" x2="135" y2="560" stroke="rgba(56,189,248,0.3)" stroke-width="1"/>
    <line x1="80" y1="505" x2="80" y2="615" stroke="rgba(56,189,248,0.3)" stroke-width="1"/>
    <circle cx="80" cy="560" r="32" fill="none" stroke="rgba(56,189,248,0.4)" stroke-width="1"/>
    <circle cx="80" cy="560" r="16" fill="none" stroke="rgba(56,189,248,0.6)" stroke-width="1"/>
    <circle cx="80" cy="560" r="5" fill="#ef4444"/>
    <circle cx="80" cy="560" r="2" fill="#ffffff"/>
    <text x="80" y="605" fill="#38bdf8" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">GPS MAP CAM</text>

    <!-- Telemetry Details -->
    <text x="155" y="525" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">${name}</text>
    <text x="155" y="546" fill="#c084fc" font-family="monospace" font-size="13" font-weight="bold">${empId}</text>

    <text x="155" y="572" fill="#fde047" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">📍 ${location}</text>
    <text x="155" y="594" fill="#e2e8f0" font-family="monospace" font-size="12">🌐 Lat: ${lat} | Long: ${lng}</text>
    <text x="155" y="614" fill="#a5f3fc" font-family="monospace" font-size="12">⛰️ Alt: ${alt} • Precision: ± 3.8 m</text>
    <text x="155" y="636" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">🕒 ${date} • ${time}</text>

    <!-- Verified Badge -->
    <rect x="25" y="660" width="550" height="34" rx="17" fill="rgba(34,197,94,0.15)" stroke="#22c55e" stroke-width="1.2"/>
    <text x="300" y="682" fill="#4ade80" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✓ CAMPUS GEOFENCE VERIFIED • RAJBAUG CAMPUS PUNE</text>

    <!-- Watermark -->
    <text x="575" y="730" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="10" text-anchor="end">DIGITAL PROOF: MIT-ATT-GEO-${Date.now().toString(36).toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
