import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DocumentSelectionPage } from './pages/DocumentSelectionPage';
import { UndertakingFormPage } from './pages/UndertakingFormPage';
import { NOCFormPage } from './pages/NOCFormPage';
import { DocumentPreviewPage } from './pages/DocumentPreviewPage';
import { FileText, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import './index.css';
import './print.css';

export const App = () => {
  const [currentRoute, setCurrentRoute] = useState('home'); // 'home' | 'documents' | 'undertaking' | 'noc' | 'preview' | 'about'
  const [activeDocType, setActiveDocType] = useState('undertaking');
  const [previewData, setPreviewData] = useState(null);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDocument = (docId) => {
    if (docId === 'undertaking') {
      setActiveDocType('undertaking');
      setCurrentRoute('undertaking');
    } else if (docId === 'noc') {
      setActiveDocType('noc');
      setCurrentRoute('noc');
    } else {
      setCurrentRoute('documents');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGeneratePreview = (docType, data) => {
    setActiveDocType(docType);
    setPreviewData(data);
    setCurrentRoute('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditDetails = () => {
    setCurrentRoute(activeDocType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNew = () => {
    setPreviewData(null);
    setCurrentRoute('documents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Global Navbar */}
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Main Content Router */}
      <main className="main-content">
        {currentRoute === 'home' && (
          <HomePage 
            onNavigate={handleNavigate} 
            onSelectDocument={handleSelectDocument} 
          />
        )}

        {currentRoute === 'documents' && (
          <DocumentSelectionPage 
            onSelectDocument={handleSelectDocument} 
          />
        )}

        {currentRoute === 'undertaking' && (
          <UndertakingFormPage 
            onGeneratePreview={handleGeneratePreview}
            onBack={() => handleNavigate('documents')}
          />
        )}

        {currentRoute === 'noc' && (
          <NOCFormPage 
            onGeneratePreview={handleGeneratePreview}
            onBack={() => handleNavigate('documents')}
          />
        )}

        {currentRoute === 'preview' && (
          <DocumentPreviewPage
            docType={activeDocType}
            formData={previewData}
            onEdit={handleEditDetails}
            onStartNew={handleStartNew}
          />
        )}

        {currentRoute === 'about' && (
          <div className="animate-fade-in" style={{ padding: '4rem 0 6rem 0' }}>
            <div className="container container-narrow">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>About InternDocs</span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Student Internship Document Generation System
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Tagline: <strong>"Generate. Preview. Print."</strong>
                </p>
              </div>

              <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1rem' }}>
                  Institutional Mission
                </h2>
                <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  InternDocs simplifies the creation of official university documentation for students undergoing industrial training and corporate internships. Instead of struggling with manual document formatting, messy word processors, or inconsistent letterhead layouts, students can enter their credentials once and generate pixel-perfect, institutionally approved documents ready for submission.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={18} color="var(--primary-600)" />
                      100% Institutional Compliance
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      Preserves exact clauses, margins, headings, signatory layouts, and university seal formatting.
                    </p>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
                      <Shield size={18} color="var(--success-600)" />
                      Zero Data Privacy Leakage
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      All data processing, PDF compilation, and printing occurs directly in your local browser runtime.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleNavigate('documents')}
                  className="btn btn-primary btn-lg"
                >
                  Explore Document Templates
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
