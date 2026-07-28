import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderLock, 
  Upload, 
  FileCheck, 
  Eye, 
  X, 
  FileText
} from 'lucide-react';

export const DocumentVaultModule = () => {
  const { documents, uploadDocument, updateDocStatus, role } = useApp();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);

  const [docForm, setDocForm] = useState({
    doc_name: '',
    doc_category: 'TET Certificate',
    file_name: ''
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!docForm.doc_name || !docForm.file_name) return;

    uploadDocument({
      doc_name: docForm.doc_name,
      doc_category: docForm.doc_category,
      file_name: docForm.file_name
    });

    setIsUploadModalOpen(false);
    setDocForm({ doc_name: '', doc_category: 'TET Certificate', file_name: '' });
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
          <h2 className="text-xl font-extrabold text-purple-950 mt-1">Verified Credentials & Repository</h2>
          <p className="text-xs text-slate-500">
            Secure storage for TET marksheets, B.Ed degrees, Aadhaar identity, and appointment orders.
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

      {/* Grid */}
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
                  <p className="text-xs font-mono text-slate-500 mt-1 truncate max-w-[180px]">{doc.file_name}</p>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-[11px] text-slate-600 space-y-1">
                <p>Teacher: <strong className="text-slate-900">{doc.teacher_name}</strong></p>
                <p>Verified By: <span className="text-purple-700 font-bold">{doc.verified_by}</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedDocPreview(doc)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview File
              </button>

              {(role === 'admin' || role === 'principal') && doc.status !== 'Verified' && (
                <button
                  onClick={() => updateDocStatus(doc.id, 'Verified')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-700"
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
              <h3 className="text-base font-extrabold text-purple-950">Upload Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Ed Degree 2024"
                  value={docForm.doc_name}
                  onChange={(e) => setDocForm({ ...docForm, doc_name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  value={docForm.doc_category}
                  onChange={(e) => setDocForm({ ...docForm, doc_category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                >
                  <option value="TET Certificate">TET / CTET Scorecard</option>
                  <option value="Qualification Certificate">B.Ed / Graduation Degree</option>
                  <option value="Identity Proof">Aadhaar / PAN Card</option>
                  <option value="Appointment Letter">Posting / Appointment Order</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setDocForm({ ...docForm, file_name: e.target.files[0]?.name || 'doc_upload.pdf' })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-600"
                />
              </div>

              <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold"
                >
                  Upload & Submit Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">{selectedDocPreview.doc_name}</h3>
                <p className="text-xs text-slate-500">{selectedDocPreview.doc_category}</p>
              </div>
              <button onClick={() => setSelectedDocPreview(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-purple-50 border border-purple-100 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white mx-auto flex items-center justify-center">
                <FileCheck className="w-8 h-8" />
              </div>
              <p className="text-sm font-extrabold text-slate-900">{selectedDocPreview.file_name}</p>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900">
                Status: {selectedDocPreview.status}
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
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
