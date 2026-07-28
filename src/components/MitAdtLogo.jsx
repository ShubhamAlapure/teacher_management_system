import React from 'react';

export const MitAdtLogo = ({ variant = 'header', className = '' }) => {
  const isLightHeader = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Circular Emblem Seal */}
      <div className="relative shrink-0">
        <svg viewBox="0 0 200 200" className="w-11 h-11 drop-shadow-md">
          {/* Outer Gold Ring */}
          <circle cx="100" cy="100" r="96" fill="#c59b27" />
          <circle cx="100" cy="100" r="88" fill="#ffffff" />
          {/* Inner Purple Ring */}
          <circle cx="100" cy="100" r="80" fill="#4c1d95" />

          {/* Dome & Pillars Illustration */}
          <path d="M100 45 C80 45 65 60 65 78 L135 78 C135 60 120 45 100 45 Z" fill="#ffffff" opacity="0.95" />
          <rect x="97" y="32" width="6" height="14" fill="#ffffff" />
          <polygon points="100,24 95,33 105,33" fill="#ffffff" />

          {/* Pillars */}
          <rect x="70" y="82" width="10" height="35" fill="#ffffff" rx="2" />
          <rect x="95" y="82" width="10" height="35" fill="#ffffff" rx="2" />
          <rect x="120" y="82" width="10" height="35" fill="#ffffff" rx="2" />
          {/* Base */}
          <rect x="62" y="117" width="76" height="7" fill="#ffffff" rx="2" />
          <rect x="56" y="124" width="88" height="6" fill="#ffffff" rx="2" />

          {/* Laurel Wreath Left & Right */}
          <path d="M52 100 Q44 70 56 50" stroke="#ffffff" strokeWidth="3" fill="none" />
          <path d="M148 100 Q156 70 144 50" stroke="#ffffff" strokeWidth="3" fill="none" />

          {/* Sanskrit Text Banner */}
          <text x="100" y="145" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            || अथतो ज्ञान जिज्ञासा ||
          </text>
          <text x="100" y="157" textAnchor="middle" fill="#d8b4fe" fontSize="8" fontFamily="sans-serif">
            Estd. 2015
          </text>

          {/* Outer Ring Curved Text */}
          <path id="textPathOuter" d="M 20,100 A 80,80 0 1,1 180,100" fill="none" />
          <text fontSize="10" fontWeight="900" fill="#4c1d95" letterSpacing="1">
            <textPath href="#textPathOuter" startOffset="50%" textAnchor="middle">
              MIT UNIVERSITY
            </textPath>
          </text>
        </svg>
      </div>

      {/* Text Branding */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-lg font-black tracking-tight font-sans ${isLightHeader ? 'text-slate-900' : 'text-white'}`}>
            MIT-ADT
          </span>
          <span className={`text-base font-extrabold tracking-normal ${isLightHeader ? 'text-purple-950' : 'text-purple-200'}`}>
            UNIVERSITY
          </span>
        </div>

        {/* Three Color Accent Line */}
        <div className="flex h-[3px] w-full my-1 rounded-full overflow-hidden">
          <div className="w-1/3 bg-purple-500" />
          <div className="w-1/3 bg-amber-500" />
          <div className="w-1/3 bg-emerald-500" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider leading-none">
          <span className={isLightHeader ? 'text-slate-600' : 'text-purple-200'}>PUNE, INDIA</span>
          <span className={`text-[8px] font-semibold italic ${isLightHeader ? 'text-purple-700' : 'text-yellow-300'}`}>
            TLMS Portal
          </span>
        </div>
      </div>
    </div>
  );
};
