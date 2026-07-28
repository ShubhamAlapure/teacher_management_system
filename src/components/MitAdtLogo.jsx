import React from 'react';

export const MitAdtLogo = ({ variant = 'header', className = '' }) => {
  const isLightHeader = variant === 'light';

  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className={`flex items-center rounded-xl transition-all ${isLightHeader ? 'bg-[#2a1052] px-3 py-1.5 shadow-md border border-purple-800/40' : ''}`}>
        <img 
          src="/mit_adt_logo.png" 
          alt="MIT-ADT University, Pune, India" 
          className="h-10 sm:h-11 w-auto object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
};
