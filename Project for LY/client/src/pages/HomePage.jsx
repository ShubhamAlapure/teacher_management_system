import React from 'react';
import { 
  FileCheck2, 
  Award, 
  ArrowRight, 
  Printer, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';
import { DOCUMENTS } from '../data/documentsConfig';

export const HomePage = ({ onNavigate, onSelectDocument }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-gradient" style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid var(--slate-200)',
        textAlign: 'center'
      }}>
        <div className="container container-narrow">
          {/* Institutional Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span className="badge badge-primary" style={{ padding: '0.35rem 0.95rem', gap: '0.5rem' }}>
              <Sparkles size={14} />
              University Internship Document Generator
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            color: 'var(--navy-900)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Generate Your Internship Documents <br />
            <span style={{
              background: 'linear-gradient(135deg, #1e40af, #2563eb, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              in Minutes
            </span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--slate-600)',
            maxWidth: '680px',
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.6
          }}>
            Fill in your details once and generate properly formatted internship documents ready for printing.
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => onNavigate('documents')}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '200px' }}
            >
              Generate Document
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onNavigate('documents')}
              className="btn btn-secondary btn-lg"
              style={{ minWidth: '180px' }}
            >
              <Layers size={18} />
              View Documents
            </button>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--slate-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                <Zap size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)' }}>Instant A4 Preview</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>Exact print formatting</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--success-50)', color: 'var(--success-600)' }}>
                <Printer size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)' }}>1-Click Print & PDF</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>High-res document export</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                <ShieldCheck size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)' }}>100% Privacy Friendly</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>No database required</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Document Cards Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--slate-100)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Select Document</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Choose Document to Generate
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Select from official university-approved internship formats.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Document Card 1: Undertaking */}
            <div className="card" style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #2563eb, #3b82f6)'
              }}></div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileCheck2 size={26} />
                  </div>
                  <span className="badge badge-primary">DOC-01</span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                  Internship Undertaking
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Generate the internship undertaking form by entering your academic and internship details.
                </p>

                <div style={{
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.8rem',
                  color: 'var(--slate-600)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} color="var(--success-600)" />
                    <span>Clauses I to IX Institutional Declaration</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} color="var(--success-600)" />
                    <span>Candidate, Mentor & HOD Signatory Layout</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectDocument('undertaking')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Generate Undertaking
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Document Card 2: NOC */}
            <div className="card" style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1e3e62, #0b192c)'
              }}></div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--slate-100)',
                    color: 'var(--navy-900)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Award size={26} />
                  </div>
                  <span className="badge badge-neutral">DOC-02</span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                  Internship NOC
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Generate a university No Objection Certificate for your internship.
                </p>

                <div style={{
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.8rem',
                  color: 'var(--slate-600)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} color="var(--success-600)" />
                    <span>Institutional Letterhead & Ref Number</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} color="var(--success-600)" />
                    <span>3 Signatories + University Seal Placeholder</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectDocument('noc')}
                className="btn btn-dark"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Generate NOC
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>How It Works</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              3 Simple Steps to Your Document
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              From blank form to verified print-ready A4 document in under 3 minutes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--primary-200)',
                lineHeight: 1,
                marginBottom: '1rem',
                fontFamily: 'var(--font-sans)'
              }}>
                01
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Select Document
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Choose between Internship Undertaking or No Objection Certificate (NOC) based on your university requirement.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--primary-300)',
                lineHeight: 1,
                marginBottom: '1rem',
                fontFamily: 'var(--font-sans)'
              }}>
                02
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Enter Details
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Fill in student credentials, internship role, company information, and duration. Or use "Load Sample Data" for quick testing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--primary-400)',
                lineHeight: 1,
                marginBottom: '1rem',
                fontFamily: 'var(--font-sans)'
              }}>
                03
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                Preview & Print
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Inspect the live A4 preview with exact institutional margins, then download crisp PDF or print directly from your browser.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
