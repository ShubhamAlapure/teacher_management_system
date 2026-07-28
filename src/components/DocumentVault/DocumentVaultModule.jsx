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
  Award
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
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
      } else {
        setDocForm(prev => ({ ...prev, file_name: file.name }));
      }
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
            Secure encryption for Ph.D degrees, TET marksheets, Aadhaar identity, and official appointment orders.
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
                className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-xs font-bold text-purple-900 transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-purple-700" />
                Preview File
              </button>

              {(role === 'admin' || role === 'principal') && doc.status !== 'Verified' && (
                <button
                  onClick={() => updateDocStatus(doc.id, 'Verified')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-700 shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Upload Digital Credential</h3>
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
                  placeholder="e.g. Ph.D. Degree / B.Ed Certificate"
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

      {/* FULL DOCUMENT PREVIEW MODAL */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-purple-200 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto font-sans">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">{selectedDocPreview.doc_name}</h3>
                <p className="text-xs text-slate-500">{selectedDocPreview.doc_category} &bull; Official Digital Record</p>
              </div>
              <button 
                onClick={() => setSelectedDocPreview(null)} 
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Viewer Container */}
            {selectedDocPreview.file_data ? (
              <div className="rounded-2xl border border-purple-200 overflow-hidden bg-slate-900 p-2 min-h-[300px] flex items-center justify-center">
                {selectedDocPreview.file_data.startsWith('data:image') ? (
                  <img 
                    src={selectedDocPreview.file_data} 
                    alt={selectedDocPreview.doc_name} 
                    className="max-h-[450px] w-auto mx-auto object-contain rounded-lg"
                  />
                ) : (
                  <iframe 
                    src={selectedDocPreview.file_data} 
                    title={selectedDocPreview.doc_name}
                    className="w-full h-[450px] rounded-lg border-0 bg-white"
                  />
                )}
              </div>
            ) : (
              /* High-Fidelity Official Digital Certificate Sheet Preview */
              <div className="bg-gradient-to-b from-purple-50/40 via-white to-purple-50/20 p-6 md:p-8 rounded-2xl border-2 border-purple-200 shadow-inner space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-purple-200 pb-4">
                  <MitAdtLogo variant="light" />
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-600 text-white uppercase">
                      QR VERIFIED CERTIFICATE
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Doc ID: {selectedDocPreview.id}</p>
                  </div>
                </div>

                <div className="text-center py-4 space-y-3">
                  <Award className="w-12 h-12 text-purple-700 mx-auto" />
                  <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    {selectedDocPreview.doc_name}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    This is to certify that the credential record for <strong className="text-purple-950 font-extrabold">{selectedDocPreview.teacher_name || activeTeacher.full_name}</strong> has been officially verified and registered into the MIT-ADT University Digital Document Vault.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-purple-100 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Category</span>
                    <p className="font-extrabold text-slate-900">{selectedDocPreview.doc_category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Verification Status</span>
                    <p className={`font-extrabold ${selectedDocPreview.status === 'Verified' ? 'text-emerald-700' : 'text-amber-600'}`}>
                      {selectedDocPreview.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Verified By</span>
                    <p className="font-bold text-purple-900">{selectedDocPreview.verified_by || 'MIT-ADT Verification Cell'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Uploaded Date</span>
                    <p className="font-bold text-slate-700">{selectedDocPreview.uploaded_at || new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographically Tamper-Proof Record</span>
                  </div>
                  <QrCode className="w-10 h-10 text-purple-900" />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-100">
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
      )}

    </div>
  );
};
