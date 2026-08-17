import React from 'react';
import { Bell, ChevronDown, Sparkles } from 'lucide-react';

export const Navbar = ({ currentRoute, onNavigate, userRole = "Student" }) => {
  return (
    <header className="portal-topbar non-printable">
      {/* Left side: MIT-ADT University Logo Header */}
      <div 
        onClick={() => onNavigate('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        {/* White Emblem */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '9px',
          lineHeight: 1
        }}>
          <span>MIT</span>
          <span style={{ fontSize: '10px', color: '#c4b5fd' }}>★</span>
        </div>

        <div>
          <div style={{
            fontSize: '1.05rem',
            fontWeight: '900',
            letterSpacing: '0.04em',
            color: 'white',
            lineHeight: 1.15
          }}>
            MIT-ADT
          </div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: '#c4b5fd',
            letterSpacing: '0.06em'
          }}>
            UNIVERSITY
          </div>
          <div style={{
            fontSize: '0.58rem',
            color: 'rgba(255, 255, 255, 0.65)',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
            lineHeight: 1
          }}>
            PUNE, INDIA • A Leap Towards World Class Education
          </div>
        </div>
      </div>

      {/* Right side: Notifications & User Persona Header (Matching Image 3) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification Bell */}
        <button
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
          title="Notifications"
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '7px',
            height: '7px',
            backgroundColor: '#a855f7',
            borderRadius: '50%',
            border: '1.5px solid #240d4f'
          }} />
        </button>

        {/* User Persona Pill (from Image 3) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.35rem 0.6rem 0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '0.785rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              {userRole === "Dean" ? "DR. RAJESH KUMAR" : "SHRAWAN MOKALE"}
            </div>
            <div style={{
              fontSize: '0.675rem',
              color: '#c4b5fd',
              fontWeight: 500
            }}>
              {userRole === "Dean" ? "MIT-DEAN-2012-0056 • School Dean" : "ADT23SOCA1062 • AIA-3 Final Year"}
            </div>
          </div>

          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.8rem',
            color: 'white',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
          }}>
            {userRole === "Dean" ? "DR" : "SM"}
          </div>

          <ChevronDown size={14} color="#c4b5fd" />
        </div>
      </div>
    </header>
  );
};
