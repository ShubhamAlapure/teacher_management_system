import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Sparkles, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Building2, 
  RefreshCw, 
  Zap, 
  ArrowRight, 
  Check, 
  Filter, 
  Bookmark, 
  User, 
  ExternalLink,
  Target
} from 'lucide-react';
import { 
  generateTrainingRecommendationsWithGroq, 
  OFFICIAL_TRAINING_CATALOG 
} from '../../services/groqService';

export const AiTrainingRecommendationsModule = () => {
  const { role, currentUser, activeTeacher, teacherTrainings, enrollCourse, pushNotification } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [enrollingCode, setEnrollingCode] = useState(null);

  const teacherName = currentUser?.full_name || activeTeacher?.full_name || 'Faculty Member';
  const teacherCadre = activeTeacher?.cadre || 'Assistant Professor';
  const teacherDept = activeTeacher?.department || 'Computer Science & Engineering (CSE)';
  const teacherQual = activeTeacher?.qualification || 'M.Tech / Ph.D.';

  // Run Recommendation Analysis
  const handleRunRecommendations = async () => {
    setIsRecommending(true);
    try {
      const result = await generateTrainingRecommendationsWithGroq({
        facultyProfile: activeTeacher || currentUser || {},
        completedCourses: (teacherTrainings || []).map(t => t.course_code),
        catalog: OFFICIAL_TRAINING_CATALOG
      });

      setRecommendationResult(result);
      pushNotification(
        'AI Recommendations Generated',
        'Groq AI matched your faculty specialization with institutional CPD courses.',
        'success'
      );
    } catch (err) {
      console.error('Groq training recommendation error:', err);
      pushNotification('Groq Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setIsRecommending(false);
    }
  };

  useEffect(() => {
    handleRunRecommendations();
  }, [activeTeacher?.id]);

  // Handle Enrollment
  const handleEnroll = async (course) => {
    setEnrollingCode(course.courseCode);
    try {
      if (enrollCourse) {
        await enrollCourse({
          course_code: course.courseCode,
          course_title: course.title,
          credit_points: course.creditPoints || 4
        });
      }
      pushNotification('Enrolled Successfully', `Enrolled in ${course.title}. Progress logged to Digital Service Book.`, 'success');
    } catch (e) {
      console.error('Enroll error:', e);
    } finally {
      setEnrollingCode(null);
    }
  };

  // Filter recommendations by category
  const filteredCourses = useMemo(() => {
    const list = recommendationResult?.recommendedCourses || OFFICIAL_TRAINING_CATALOG;
    if (selectedCategory === 'All') return list;
    return list.filter(c => c.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [recommendationResult, selectedCategory]);

  const categories = ['All', 'Technical & AI', 'Research Development', 'Teaching & Pedagogy', 'Accreditation & Quality', 'Leadership & Administration'];

  return (
    <div className="space-y-6 font-sans animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#18110E] via-[#24130F] to-[#3B1912] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E43D12]/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15">
          <GraduationCap className="w-72 h-72 text-[#FFA2B6]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#EFB11D] text-[#191210] uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#191210]" />
                <span>GROQ CAREER AI</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase">
                UGC Continuing Professional Development
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Training & Professional Development Recommendation
            </h2>
            <p className="text-xs text-[#EAE4DF] leading-relaxed">
              Tailored professional development engine powered by Groq. Analyzes your academic cadre, subject specialization, and teaching experience to curate high-impact FDPs, grant-writing workshops, and pedagogical credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunRecommendations}
              disabled={isRecommending}
              className="px-5 py-3 rounded-2xl bg-[#E43D12] hover:bg-[#C7310B] disabled:opacity-60 text-white text-xs font-black shadow-lg shadow-[#E43D12]/30 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRecommending ? 'animate-spin' : ''}`} />
              <span>{isRecommending ? 'Curating with Groq...' : 'Refresh AI Recommendations'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Profile Summary & Target Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Snapshot Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2DDD2] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-2">
            <span className="text-[10px] font-extrabold uppercase text-[#5A524D] tracking-wider">
              Faculty Profile Snapshot
            </span>
            <span className="text-xs font-mono font-bold text-[#E43D12]">
              {activeTeacher?.emp_id || 'MIT-FAC-001'}
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-[#1A1412]">{teacherName}</h3>
            <p className="text-xs text-[#5A524D]">{teacherCadre} &bull; {teacherDept}</p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-[#E2DDD2]">
            <p><strong>Qualification:</strong> {teacherQual}</p>
            <p><strong>Experience:</strong> {activeTeacher?.experience_years || 4} Years</p>
            <p><strong>Specialization:</strong> {activeTeacher?.specialization || activeTeacher?.subject || 'Engineering'}</p>
          </div>
        </div>

        {/* Career Development Narrative Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#FAF9F5] border border-[#E2DDD2] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E43D12]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1412]">
                Groq AI Personalized Career Progression Narrative
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#E43D12]/10 text-[#E43D12] font-bold">
              CAS 7th Pay Alignment
            </span>
          </div>

          <p className="text-xs text-[#5A524D] leading-relaxed">
            {recommendationResult?.careerDevelopmentNote || 
              `Based on your appointment in ${teacherDept}, completing targeted courses in Outcome-Based Education and Scopus research methodologies will strongly position your dossier for Career Advancement Scheme (CAS) elevation to the next Academic Level.`}
          </p>

          {/* Skill Gaps Identified */}
          {recommendationResult?.targetedSkillGaps && (
            <div className="pt-2 border-t border-[#E2DDD2] space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1412] block">
                Targeted Competency Growth Areas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recommendationResult.targetedSkillGaps.map((gap, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#18110E] border border-[#E2DDD2] shadow-2xs flex items-center gap-1"
                  >
                    <Target className="w-3 h-3 text-[#E43D12]" />
                    <span>{gap}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Category Filter Pills */}
      <div className="bg-white p-3 rounded-2xl border border-[#E2DDD2] shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A524D] px-2 shrink-0">
          Domain:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 border ${
              selectedCategory === cat
                ? 'bg-[#E43D12] text-white border-[#E43D12] shadow-md'
                : 'bg-[#FAF9F5] text-[#1A1412] border-[#E2DDD2] hover:border-[#FFA2B6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = (teacherTrainings || []).some(t => t.course_code === course.courseCode);
          const isBusy = enrollingCode === course.courseCode;

          return (
            <div 
              key={course.courseCode}
              className="p-6 rounded-3xl bg-white border border-[#E2DDD2] hover:border-[#FFA2B6] shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{course.relevanceScore || 94}% Relevance Match</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#5A524D]">
                    {course.courseCode}
                  </span>
                </div>

                {/* Title & Provider */}
                <div>
                  <h4 className="text-sm font-black text-[#1A1412] leading-snug group-hover:text-[#E43D12] transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-[#5A524D] mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#E43D12] shrink-0" />
                    <span className="truncate">{course.provider}</span>
                  </p>
                </div>

                {/* Duration & Credits */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2DDD2]">
                    <span className="text-[#5A524D] block uppercase font-bold text-[9px]">Duration</span>
                    <span className="text-slate-900 font-bold">{course.duration}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E2DDD2]">
                    <span className="text-[#5A524D] block uppercase font-bold text-[9px]">Credit Points</span>
                    <span className="text-[#E43D12] font-bold">{course.creditPoints || 4} CPD Credits</span>
                  </div>
                </div>

                {/* Why Recommended by Groq */}
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD2] text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#E43D12] block">
                    Why Groq Recommends This:
                  </span>
                  <p className="text-[11px] text-[#5A524D] leading-relaxed">
                    {course.whyRecommended || `Essential competency alignment for ${teacherDept} faculty seeking accreditation readiness.`}
                  </p>
                </div>

                {/* Expected Outcome */}
                {course.expectedOutcome && (
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <strong className="text-slate-900 text-[10px] uppercase font-bold block">Target Learning Outcome:</strong>
                    <p className="leading-relaxed">{course.expectedOutcome}</p>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-[#E2DDD2]">
                {isEnrolled ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Enrolled & Tracked in Service Book</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleEnroll(course)}
                    className="w-full py-2.5 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isBusy ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enrolling...</span>
                      </>
                    ) : (
                      <>
                        <span>Enroll in Program</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
