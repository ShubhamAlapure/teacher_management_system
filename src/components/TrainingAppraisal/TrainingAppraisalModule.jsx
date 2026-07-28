import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  X
} from 'lucide-react';

export const TrainingAppraisalModule = () => {
  const { 
    trainings, 
    teacherTrainings, 
    apars, 
    enrollCourse, 
    submitApar, 
    updateAparReview, 
    role 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('training');
  const [isAparModalOpen, setIsAparModalOpen] = useState(false);
  const [selectedAparForReview, setSelectedAparForReview] = useState(null);

  const [aparForm, setAparForm] = useState({ self_score: 90, teacher_remarks: '' });
  const [reviewForm, setReviewForm] = useState({ principal_score: 90, deo_score: 90, remarks: '' });

  const handleAparSubmit = (e) => {
    e.preventDefault();
    if (!aparForm.teacher_remarks) return;

    submitApar({
      self_appraisal_score: Number(aparForm.self_score),
      teacher_remarks: aparForm.teacher_remarks
    });

    setIsAparModalOpen(false);
    setAparForm({ self_score: 90, teacher_remarks: '' });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedAparForReview) return;

    const pScore = Number(reviewForm.principal_score);
    const dScore = role === 'admin' ? Number(reviewForm.deo_score) : null;
    const finalScore = dScore || pScore;
    const grade = finalScore >= 90 ? 'Outstanding' : finalScore >= 80 ? 'Very Good' : finalScore >= 70 ? 'Good' : 'Satisfactory';

    updateAparReview(selectedAparForReview.id, pScore, dScore, grade, reviewForm.remarks);
    setSelectedAparForReview(null);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                CAPACITY & EVALUATION
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-purple-950 mt-1">Training (CPD) & APAR Performance Appraisal</h2>
            <p className="text-xs text-slate-500">
              NISHTHA training credit tracking and Annual Performance Appraisal Report (APAR) evaluation.
            </p>
          </div>

          <button
            onClick={() => setIsAparModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            File APAR Self-Assessment
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 border-t border-purple-100 pt-4">
          <button
            onClick={() => setActiveSubTab('training')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'training'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            CPD Training Courses ({trainings.length})
          </button>

          <button
            onClick={() => setActiveSubTab('apar')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeSubTab === 'apar'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Award className="w-4 h-4" />
            APAR Evaluation Module ({apars.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: TRAINING */}
      {activeSubTab === 'training' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trainings.map((c) => {
            const isEnrolled = teacherTrainings.some(t => t.course_code === c.course_code);

            return (
              <div key={c.id} className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-900 font-bold">
                      {c.course_code}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700">+{c.credit_points} CPD Credits</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Provider: {c.provider}</span>
                  <button
                    disabled={isEnrolled}
                    onClick={() => enrollCourse(c.course_code, c.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      isEnrolled 
                        ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20'
                    }`}
                  >
                    {isEnrolled ? 'Enrolled' : 'Enroll Free'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: APAR */}
      {activeSubTab === 'apar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apars.map((apar) => (
            <div 
              key={apar.id}
              className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-3 hover:border-purple-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                  AY {apar.academic_year}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                  {apar.final_grade}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{apar.teacher_name}</h4>
                <p className="text-xs text-slate-600">Self Score: <strong className="text-purple-700">{apar.self_appraisal_score} / 100</strong></p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Principal Score:</span>
                  <strong className="text-slate-900">{apar.principal_score ? `${apar.principal_score} pts` : 'Pending Review'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>DEO Final Score:</span>
                  <strong className="text-purple-900 font-extrabold">{apar.deo_score ? `${apar.deo_score} pts` : 'Pending Review'}</strong>
                </div>
                <p className="pt-2 border-t border-purple-100 text-[11px] text-slate-600 italic">
                  &ldquo;{apar.teacher_remarks}&rdquo;
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{apar.status}</span>
                {(role === 'principal' || role === 'admin') && (
                  <button
                    onClick={() => {
                      setSelectedAparForReview(apar);
                      setReviewForm({ principal_score: apar.principal_score || 90, deo_score: apar.deo_score || 90, remarks: '' });
                    }}
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-extrabold"
                  >
                    Evaluate & Grade
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Self APAR Modal */}
      {isAparModalOpen && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">APAR Self-Assessment (2025-2026)</h3>
              <button onClick={() => setIsAparModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAparSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Self Score (Out of 100)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  required
                  value={aparForm.self_score}
                  onChange={(e) => setAparForm({ ...aparForm, self_score: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Summary & Achievements</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail class pass %, pedagogical innovations..."
                  value={aparForm.teacher_remarks}
                  onChange={(e) => setAparForm({ ...aparForm, teacher_remarks: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAparModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold"
                >
                  Submit Self-Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedAparForReview && (
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-purple-100 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">Appraise Performance</h3>
              <button onClick={() => setSelectedAparForReview(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Principal Score (Out of 100)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  required
                  value={reviewForm.principal_score}
                  onChange={(e) => setReviewForm({ ...reviewForm, principal_score: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                />
              </div>

              {role === 'admin' && (
                <div>
                  <label className="text-xs font-bold text-slate-700">DEO Final Score</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    required
                    value={reviewForm.deo_score}
                    onChange={(e) => setReviewForm({ ...reviewForm, deo_score: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700">Evaluation Remarks</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comments..."
                  value={reviewForm.remarks}
                  onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAparForReview(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold"
                >
                  Finalize Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
