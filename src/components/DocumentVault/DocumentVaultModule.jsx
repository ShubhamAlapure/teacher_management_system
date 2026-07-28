import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Upload, 
  FileCheck, 
  Eye, 
  X, 
  FileText,
  Printer,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';

const getUploaderName = (doc) => {
  const name = doc.teacher_name;
  if (!name || name.includes('SHUBHAM') || name.includes('System Administrator') || name.includes('MASTER-ADMIN') || name.includes('MIT-ADT System')) {
    return 'Dr. SS Reddy (Faculty Applicant)';
  }
  return name;
};

export const DocumentVaultModule = () => {
  const { documents, uploadDocument, updateDocStatus, deleteDocument, role, activeTeacher, currentUser } = useApp();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState(null); // doc to confirm deletion

  const [docForm, setDocForm] = useState({
    doc_name: '',
    doc_category: 'Qualification Certificate',
    file_name: '',
    file_object: null,
    file_data: null   // Base64 Data URL for instant preview fallback
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Read as Base64 for immediate in-session preview (fallback)
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocForm(prev => ({
        ...prev,
        file_name: file.name,
        file_object: file,       // actual File binary for Storage upload
        file_data: reader.result // Base64 for instant preview
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!docForm.doc_name || !docForm.file_object) return;

    setIsUploading(true);
    await uploadDocument({
      doc_name: docForm.doc_name,
      doc_category: docForm.doc_category,
      file_name: docForm.file_name,
      file_object: docForm.file_object,
      file_data: docForm.file_data
    });
    setIsUploading(false);
    setIsUploadModalOpen(false);
    setDocForm({ doc_name: '', doc_category: 'Qualification Certificate', file_name: '', file_object: null, file_data: null });
  };

  // Determine best src to use for preview
  const getPreviewSrc = (doc) => {
    // Priority: Supabase Storage public URL > Base64 file_data > null
    if (doc.file_url && doc.file_url.startsWith('http')) return doc.file_url;
    if (doc.file_data && doc.file_data.startsWith('data:')) return doc.file_data;
    return null;
  };

  const isImage = (src) => {
    if (!src) return false;
    return src.startsWith('data:image') || /\.(png|jpg|jpeg|webp|gif|svg)(\?|$)/i.test(src);
  };

  const isPdf = (src) => {
    if (!src) return false;
    return src.startsWith('data:application/pdf') || /\.pdf(\?|$)/i.test(src);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
            DIGITAL DOCUMENT VAULT
          </span>
          <h2 className="text-xl font-extrabold text-purple-950 mt-1">Verified Credentials & Document Repository</h2>
          <p className="text-xs text-slate-500">
            Secure Supabase Storage for degrees, marksheets, Aadhaar, and appointment orders.
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
        {documents
          .filter(doc => {
            // Admin and Principal/HOD can see ALL documents
            if (role === 'admin' || role === 'principal') return true;
            // Applicants and teachers can only see their OWN uploaded documents
            const myId = currentUser?.emp_id || currentUser?.id || activeTeacher.emp_id || activeTeacher.id;
            return (
              doc.teacher_id === myId ||
              doc.teacher_id === currentUser?.id ||
              doc.teacher_id === activeTeacher.id ||
              doc.teacher_name === currentUser?.full_name ||
              doc.teacher_name === activeTeacher.full_name
            );
          })
          .map((doc) => {
          const src = getPreviewSrc(doc);
          return (
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
                    doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
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
                    <p className="text-xs font-mono text-slate-500 mt-1 truncate max-w-[180px]">{doc.file_name || 'document'}</p>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-[11px] text-slate-600 space-y-1">
                  <p>Submitted By: <strong className="text-slate-900">{getUploaderName(doc)}</strong></p>
                  <p>Verified By: <span className="text-purple-700 font-bold">{doc.verified_by || 'Pending Audit'}</span></p>
                  {src && src.startsWith('http') && (
                    <p className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Stored in Supabase Storage
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDocPreview(doc)}
                  disabled={!src}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm ${
                    src 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {src ? 'Preview File' : 'No Preview'}
                </button>

                {(role === 'admin' || role === 'principal') && doc.status !== 'Verified' && (
                  <button
                    onClick={() => updateDocStatus(doc.id, 'Verified')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 shadow-sm"
                  >
                    Verify
                  </button>
                )}

                {/* DELETE — only for candidate/applicant on their own Pending docs */}
                {(role === 'applicant' || role === 'teacher') && doc.status !== 'Verified' && (
                  <button
                    onClick={() => setConfirmDeleteDoc(doc)}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all"
                    title="Delete this document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
          })
        }
        {/* Empty state for applicants with no own documents */}
        {(role === 'applicant' || role === 'teacher') && documents.filter(doc => {
          const myId = currentUser?.emp_id || currentUser?.id || activeTeacher.emp_id || activeTeacher.id;
          return (
            doc.teacher_id === myId ||
            doc.teacher_id === currentUser?.id ||
            doc.teacher_id === activeTeacher.id ||
            doc.teacher_name === currentUser?.full_name ||
            doc.teacher_name === activeTeacher.full_name
          );
        }).length === 0 && (
          <div className="col-span-3 py-16 flex flex-col items-center text-center text-slate-400 gap-3">
            <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center">
              <Upload className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-bold text-slate-600">No documents uploaded yet</p>
            <p className="text-xs text-slate-400">Click <strong>Upload Credential</strong> to submit your certificates, degrees, or ID proofs for verification.</p>
          </div>
        )}
      </div>
      {/* DELETE CONFIRMATION DIALOG */}
      {confirmDeleteDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-rose-200 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Delete Document?</h4>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-0.5">
              <p><span className="text-slate-400">Document:</span> <strong>{confirmDeleteDoc.doc_name}</strong></p>
              <p><span className="text-slate-400">Category:</span> {confirmDeleteDoc.doc_category}</p>
              <p><span className="text-slate-400">Status:</span> <span className="text-amber-700 font-bold">{confirmDeleteDoc.status}</span></p>
            </div>

            <p className="text-xs text-slate-500">
              The file will be removed from the Vault and deleted from Supabase Storage permanently.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setConfirmDeleteDoc(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteDocument(confirmDeleteDoc);
                  setConfirmDeleteDoc(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-purple-950">Upload Credential File</h3>
                <p className="text-[11px] text-emerald-700 font-bold">Files saved to Supabase Storage</p>
              </div>
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
                  placeholder="e.g. Ph.D. Degree / Aadhaar Card / CTET Scorecard"
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
                  <option value="TET Certificate">NET / SET / GATE / CTET Scorecard</option>
                  <option value="Identity Proof">Aadhaar Card / Passport / PAN</option>
                  <option value="Appointment Letter">Appointment / Service / Offer Letter</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select File (PDF or Image) *</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-slate-600 bg-slate-50"
                />
                {docForm.file_name && (
                  <p className="mt-1 text-emerald-700 font-bold flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> {docForm.file_name} — Ready to upload
                  </p>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2 text-[11px] text-blue-800">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  Files are uploaded to <strong>Supabase Storage</strong> and a permanent public URL is stored in PostgreSQL. 
                  Run the SQL command in Supabase to create the storage bucket if not done yet.
                </span>
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
                  disabled={isUploading || !docForm.file_object}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold shadow-md shadow-purple-600/20 flex items-center gap-2 disabled:opacity-60"
                >
                  {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Upload to Supabase Storage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXACT FILE PREVIEW MODAL */}
      {selectedDocPreview && (() => {
        const src = getPreviewSrc(selectedDocPreview);
        const isImg = isImage(src);
        const isPdfDoc = isPdf(src);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 font-sans">
            <div className="w-full max-w-4xl bg-white border border-purple-200 rounded-3xl p-5 md:p-6 shadow-2xl animate-in zoom-in-95 max-h-[95vh] flex flex-col gap-4">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-purple-100 pb-3 shrink-0">
                <div>
                  <h3 className="text-base font-extrabold text-purple-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    {selectedDocPreview.doc_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedDocPreview.file_name} &bull; {selectedDocPreview.doc_category} &bull; Status: {selectedDocPreview.status}
                  </p>
                </div>
                <button onClick={() => setSelectedDocPreview(null)} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* FILE VIEWER */}
              <div className="flex-1 min-h-[380px] max-h-[68vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center">
                {isImg ? (
                  <img
                    src={src}
                    alt={selectedDocPreview.doc_name}
                    className="max-h-[66vh] max-w-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : isPdfDoc ? (
                  <iframe
                    src={src}
                    title={selectedDocPreview.doc_name}
                    className="w-full h-full border-0 bg-white"
                    style={{ minHeight: '380px' }}
                  />
                ) : (
                  <div className="text-center text-slate-400 space-y-2 p-8">
                    <FileText className="w-12 h-12 mx-auto text-slate-600" />
                    <p className="text-sm font-bold">File preview unavailable</p>
                    <p className="text-xs">The file was not stored in Supabase Storage yet.<br/>Re-upload the file to enable preview.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {src && src.startsWith('http') ? 'Stored in Supabase Storage' : 'Local Session Preview'}
                </div>

                <div className="flex items-center gap-2">
                  {src && src.startsWith('http') && (
                    <a
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1.5"
                    >
                      Open in New Tab
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedDocPreview(null)}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md"
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
