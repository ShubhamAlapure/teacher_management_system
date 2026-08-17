import React from 'react';
import { FileText, Sparkles, Printer, Layers, Compass, HelpCircle } from 'lucide-react';

export const Navbar = ({ currentRoute, onNavigate }) => {
  return (
    <nav className="glass-nav app-navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <FileText size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--navy-900)',
                letterSpacing: '-0.02em'
              }}>
                Intern<span style={{ color: 'var(--primary-600)' }}>Docs</span>
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                v1.0
              </span>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--slate-500)',
              fontWeight: '500',
              lineHeight: 1
            }}>
              Generate. Preview. Print.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => onNavigate('home')}
            className={`btn btn-sm ${currentRoute === 'home' ? 'btn-secondary' : ''}`}
            style={{
              background: currentRoute === 'home' ? 'var(--slate-100)' : 'transparent',
              color: currentRoute === 'home' ? 'var(--primary-700)' : 'var(--slate-600)',
              border: 'none'
            }}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('documents')}
            className={`btn btn-sm ${currentRoute === 'documents' ? 'btn-secondary' : ''}`}
            style={{
              background: currentRoute === 'documents' ? 'var(--slate-100)' : 'transparent',
              color: currentRoute === 'documents' ? 'var(--primary-700)' : 'var(--slate-600)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Layers size={16} />
            Documents
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`btn btn-sm ${currentRoute === 'about' ? 'btn-secondary' : ''}`}
            style={{
              background: currentRoute === 'about' ? 'var(--slate-100)' : 'transparent',
              color: currentRoute === 'about' ? 'var(--primary-700)' : 'var(--slate-600)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <HelpCircle size={16} />
            About
          </button>
        </div>

        {/* Primary CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigate('documents')}
            className="btn btn-primary btn-sm"
            style={{ boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' }}
          >
            <Sparkles size={15} />
            Generate Document
          </button>
        </div>
      </div>
    </nav>
  );
};
