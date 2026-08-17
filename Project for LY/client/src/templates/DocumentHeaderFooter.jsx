import React from 'react';

export const DocumentHeader = ({ 
  universityName = "MIT Art, Design and Technology University", 
  schoolName = "School of Computing", 
  department = "Department of Computer Science & Engineering",
  address = "Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune - 412201, Maharashtra, India" 
}) => {
  return (
    <div className="doc-header-block">
      <div className="doc-univ-logo-row">
        {/* Institutional Crest / Emblem */}
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          border: '2px solid #0b192c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b192c, #1e3e62)',
          color: '#ffffff',
          fontWeight: '900',
          fontSize: '11pt',
          letterSpacing: '0.05em',
          fontFamily: 'var(--font-sans)',
          flexShrink: 0
        }}>
          MIT
        </div>

        <div>
          <div className="doc-univ-name">
            {universityName}
          </div>
          <div className="doc-school-name">
            {schoolName}
          </div>
          {department && (
            <div className="doc-dept-subtext">
              {department}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DocumentFooter = ({
  address = "Rajbaug, Next to Hadapsar, Loni Kalbhor, Pune - 412201, Maharashtra, India",
  website = "www.mituniversity.ac.in",
  email = "info@mituniversity.edu.in",
  docCode = "MIT-ADT/SOC/DOC-2026"
}) => {
  return (
    <div className="doc-footer-block">
      <div>{address}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '2px' }}>
        <span>Web: <strong>{website}</strong></span>
        <span>•</span>
        <span>Email: <strong>{email}</strong></span>
        <span>•</span>
        <span>Doc Ref: <strong>{docCode}</strong></span>
      </div>
    </div>
  );
};
