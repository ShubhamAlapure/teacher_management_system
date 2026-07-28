import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MitAdtLogo } from '../MitAdtLogo';
import { 
  FolderLock, 
  Upload, 
  FileCheck, 
  Eye, 
  X, 
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Award,
  ExternalLink
} from 'lucide-react';

export const DocumentVaultModule = () => {
  const { documents, uploadDocument, updateDocStatus, role, activeTeacher } = useApp();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);

  const [docForm, setDocForm] = useState({
    doc_name: '',
    doc_category: 'Qualification Certificate',
    file_name: '',
    file_data: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocForm(prev => ({
          ...prev,
          file_name: file.name,
          file_data: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!docForm.doc_name) return;

    uploadDocument({
      doc_name: docForm.doc_name,
      doc_category: docForm.doc_category,
      file_name: docForm.file_name || 'degree_certificate.pdf',
      file_data: docForm.file_data
    });

    setIsUploadModalOpen(false);
    setDocForm({ doc_name: '', doc_category: 'Qualification Certificate', file_name: '', file_data: null });
  };

  const handlePrintPreview = () => {
    window.print();
  };

  // Helper to determine if Data URL or File URL is Image
  const isImageFile = (src = '') => {
    if (!src) return false;
    return src.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(src);
  };

  // Helper to determine if Data URL or File URL is PDF
  const isPdfFile = (src = '') => {
    if (!src) return false;
    return src.startsWith('data:application/pdf') || /\.pdf($|\?)/i.test(src);
  };

  // Generate SVG Data URL for default sample document
  const getSampleDocSvg = (doc) => {
    const title = doc.doc_name || 'CERTIFICATE OF QUALIFICATION';
    const recipient = doc.teacher_name || activeTeacher.full_name || 'DR. SS REDDY';
    const category = doc.doc_category || 'Academic Credential';

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
        <rect width="800" height="600" fill="#FBFBFE" rx="20"/>
        <rect x="20" y="20" width="760" height="560" fill="white" stroke="#7C3AED" stroke-width="4" stroke-dasharray="10 6" rx="16"/>
        <rect x="40" y="40" width="720" height="520" fill="#FAF5FF" stroke="#DDD6FE" stroke-width="2" rx="12"/>
        
        <circle cx="400" cy="110" r="40" fill="#7C3AED"/>
        <path d="M400 85 L410 105 L430 108 L415 122 L419 142 L400 132 L381 142 L385 122 L370 108 L390 105 Z" fill="#FDE047"/>
        
        <text x="400" y="180" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#4C1D95" text-anchor="middle" letter-spacing="2">MIT-ADT UNIVERSITY PUNE</text>
        <text x="400" y="205" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#6B21A8" text-anchor="middle" letter-spacing="4">DIGITAL DOCUMENT VAULT VERIFIED COPY</text>
        
        <line x1="150" y1="225" x2="650" y2="225" stroke="#C4B5FD" stroke-width="2"/>
        
        <text x="400" y="270" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#1E1B4B" text-anchor="middle">${title.toUpperCase()}</text>
        <text x="400" y="305" font-family="Arial, sans-serif" font-size="14" fill="#64748B" text-anchor="middle">This is to officially certify that</text>
        
        <text x="400" y="350" font-family="Georgia, serif" font-size="30" font-weight="900" fill="#6D28D9" text-anchor="middle">${recipient}</text>
        
        <text x="400" y="390" font-family="Arial, sans-serif" font-size="14" fill="#475569" text-anchor="middle">has successfully verified and uploaded their valid credential record</text>
        <text x="400" y="415" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0369A1" text-anchor="middle">Category: ${category}</text>
        
        <rect x="80" y="460" width="200" height="60" fill="#F3E8FF" rx="8" stroke="#D8B4FE"/>
        <text x="180" y="485" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#6B21A8" text-anchor="middle">VERIFICATION STATUS</text>
        <text x="180" y="505" font-family="Arial, sans-serif" font-size="13" font-weight="900" fill="#15803D" text-anchor="middle">OFFICIALLY VERIFIED</text>
        
        <rect x="520" y="460" width="200" height="60" fill="#F3E8FF" rx="8" stroke="#D8B4FE"/>
        <text x="620" y="485" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#6B21A8" text-anchor="middle">REGISTRAR SEAL</text>
        <text x="620" y="505" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#4338CA" text-anchor="middle">MIT-ADT SECRETARIAT</text>
      </svg>
    `;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
              DIGITAL DOCUMENT VAULT
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-purple-950 mt-1">Verified Credentials & Document Repository</h2>
          <p className="text-xs text-slate-500">
            Secure storage for Ph.D degrees, TET marksheets, Aadhaar identity, and official appointment orders.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Credential
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-900">
                  {doc.doc_category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-900' :
                  'bg-amber-100 text-amber-900'
                }`}>
                  {doc.status}
                </span>
              </div>

              <div className="flex items-start gap-3 mt-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{doc.doc_name}</h4>
                  <p className="text-xs font-mono text-slate-500 mt-1 truncate max-w-[180px]">{doc.file_name || `${doc.doc_name.toLowerCase().replace(/\s+/g, '_')}.pdf`}</p>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-[11px] text-slate-600 space-y-1">
                <p>Issued To: <strong className="text-slate-900">{doc.teacher_name || activeTeacher.full_name}</strong></p>
                <p>Verified By: <span className="text-purple-700 font-bold">{doc.verified_by || 'MIT-ADT Verification Cell'}</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDocPreview(doc)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-700 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview File
              </button>

              {(role === 'admin' || role === 'principal') && doc.status !== 'Verified' && (
                <button
                  onClick={() => updateDocStatus(doc.id, 'Verified')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 shadow-sm"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Upload Digital Credential File</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Ed Degree / Ph.D. Certificate"
                  value={docForm.doc_name}
                  onChange={(e) => setDocForm({ ...docForm, doc_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category *</label>
                <select
                  value={docForm.doc_category}
                  onChange={(e) => setDocForm({ ...docForm, doc_category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-900"
                >
                  <option value="Qualification Certificate">Ph.D. / B.Ed / Graduation Degree</option>
                  <option value="TET Certificate">NET / SET / GATE Scorecard</option>
                  <option value="Identity Proof">Aadhaar Card / Passport</option>
                  <option value="Appointment Letter">Appointment / Service Order</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select File Document (PDF / Image)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-600 bg-slate-50"
                  required
                />
              </div>

              <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold shadow-md shadow-purple-600/20"
                >
                  Upload & Submit Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXACT UPLOADED FILE PREVIEW MODAL */}
      {selectedDocPreview && (() => {
        const fileSrc = selectedDocPreview.file_data || selectedDocPreview.file_url || getSampleDocSvg(selectedDocPreview);
        const isImg = isImageFile(fileSrc);
        const isPdf = isPdfFile(fileSrc);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 font-sans">
            <div className="w-full max-w-4xl bg-white border border-purple-200 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[95vh] flex flex-col justify-between">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-purple-100 pb-3 shrink-0">
                <div>
                  <h3 className="text-base md:text-lg font-extrabold text-purple-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>{selectedDocPreview.doc_name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    File: {selectedDocPreview.file_name || 'document.pdf'} &bull; Category: {selectedDocPreview.doc_category}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedDocPreview(null)} 
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* EXACT FILE PREVIEW BODY */}
              <div className="flex-1 min-h-[350px] max-h-[68vh] overflow-auto bg-slate-900 rounded-2xl p-2 md:p-4 flex items-center justify-center border border-slate-800 shadow-inner">
                {isImg ? (
                  <img 
                    src={fileSrc} 
                    alt={selectedDocPreview.doc_name} 
                    className="max-h-[64vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-slate-700"
                  />
                ) : isPdf ? (
                  <iframe 
                    src={fileSrc} 
                    title={selectedDocPreview.doc_name}
                    className="w-full h-[64vh] rounded-xl border-0 bg-white"
                  />
                ) : (
                  /* Fallback SVG Document Image preview for exact file view */
                  <img 
                    src={fileSrc} 
                    alt={selectedDocPreview.doc_name} 
                    className="max-h-[64vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-slate-700"
                  />
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-purple-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Original Upload</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintPreview}
                    className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-extrabold flex items-center gap-2 transition-all"
                  >
                    <Printer className="w-4 h-4 text-purple-700" />
                    Print / Save PDF
                  </button>

                  <button
                    onClick={() => setSelectedDocPreview(null)}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-600/20"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
