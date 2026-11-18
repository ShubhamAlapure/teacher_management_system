import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Download, 
  Users, 
  Building2, 
  Calendar,
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { generateAnalyticsExecutiveSummary } from '../../services/groqService';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';

export const AnalyticsModule = () => {
  const { districtStats, pushNotification, setActiveTab } = useApp();

  const [aiSummary, setAiSummary] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const totalTeachers = (districtStats || []).reduce((sum, d) => sum + (d.total_teachers || 0), 0);
      const totalVacancies = (districtStats || []).reduce((sum, d) => sum + (d.vacancies || 0), 0);
      const deptNames = (districtStats || []).map(d => d.name).join(', ');

      const res = await generateAnalyticsExecutiveSummary({
        totalFaculty: totalTeachers,
        openVacancies: totalVacancies,
        activeDepartments: deptNames,
        attendanceRate: 91,
        geoVerifiedCount: 22,
        lateCount: 2
      });

      setAiSummary(res.content);
      pushNotification('Groq AI Brief Ready', 'Institutional intelligence summary generated via Groq.', 'success');
    } catch (err) {
      console.error('Groq AI summary error:', err);
      pushNotification('Groq Error', err.message || 'Unable to generate summary.', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const retirementData = [
    { year: '2026', count: 420 },
    { year: '2027', count: 580 },
    { year: '2028', count: 640 },
    { year: '2029', count: 710 },
    { year: '2030', count: 850 }
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "District,Total Teachers,Vacancies,PTR,Total Schools\n"
      + districtStats.map(e => `${e.name},${e.total_teachers},${e.vacancies},${e.ptr},${e.total_schools}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "State_Teacher_Analytics_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    pushNotification('CSV Exported', 'District teacher deployment report downloaded to your device.', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
              STATE DECISION SUPPORT
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-purple-950 mt-1">MIT-ADT University Reports & Superannuation Forecast</h2>
          <p className="text-xs text-slate-500">
            Data-driven decision making for University Registrar, Deans, and Executive Council.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab && setActiveTab('ai_workforce')}
            className="px-4 py-2.5 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#EFB11D]" />
            <span>Open Workforce AI Suite</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-md shadow-purple-600/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export University CSV</span>
          </button>
        </div>
      </div>

      {/* Groq AI Institutional Executive Intelligence Brief */}
      <div className="bg-[#18110E] text-white p-6 rounded-3xl border border-[#E43D12]/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E43D12]/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E43D12] to-[#EFB11D] flex items-center justify-center text-white shadow-md">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-wide text-white">
                  GROQ AI &bull; EXECUTIVE INSTITUTIONAL INTELLIGENCE BRIEF
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-[#FFA2B6]">
                Instant LLM synthesis of faculty strength, department PTR, and attendance trends.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateAiSummary}
            disabled={isGeneratingAi}
            className="px-4 py-2 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] disabled:opacity-60 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            {isGeneratingAi ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing with Groq...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#EFB11D]" />
                <span>{aiSummary ? 'Refresh AI Brief' : 'Generate Executive Brief'}</span>
              </>
            )}
          </button>
        </div>

        {aiSummary ? (
          <div className="bg-[#24130F] p-4 rounded-2xl border border-[#E43D12]/20 space-y-2 text-xs leading-relaxed text-[#FAF9F5]">
            <div className="flex items-center justify-between text-[10px] text-[#FFA2B6] border-b border-white/10 pb-1.5 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Model: openai/gpt-oss-120b &bull; Low Latency LPU Inference</span>
              </span>
              <span>Updated Just Now</span>
            </div>
            <div className="whitespace-pre-line text-xs text-slate-200 pt-1">
              {aiSummary}
            </div>
          </div>
        ) : (
          <div className="bg-[#24130F]/60 p-4 rounded-2xl border border-white/5 text-xs text-slate-300 flex items-center justify-between">
            <p>
              Click <strong>"Generate Executive Brief"</strong> to run high-speed institutional analysis across all engineering branches using the Groq AI engine.
            </p>
            <span className="text-[10px] text-[#EFB11D] font-mono font-bold shrink-0 ml-3">
              ~0.2s Inference
            </span>
          </div>
        )}
      </div>

      {/* PTR Grid */}
      <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-600" />
          Institute Student-Faculty Ratio (SFR) & Cadre Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {districtStats.map((dist) => (
            <div key={dist.name} className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">{dist.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-600 text-white font-bold">
                  PTR {dist.ptr}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <p>Teachers: <strong className="text-slate-900">{dist.total_teachers.toLocaleString()}</strong></p>
                <p>Vacancies: <span className="text-amber-800 font-extrabold">{dist.vacancies}</span></p>
                <p>Schools: {dist.total_schools}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              5-Year Retirement Superannuation Forecast
            </h3>
            <p className="text-xs text-slate-500">Forecasted vacancies to plan proactive recruitment drives</p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retirementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" name="Retiring Teachers" stroke="#E43D12" fill="#E43D12" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-purple-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Cadre Density Ratio Analysis
            </h3>
            <p className="text-xs text-slate-500">Distribution of PRT, TGT, PGT, and School Headmasters</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>PRT Primary Cadre</span>
                <span className="text-purple-900 font-extrabold">42.5% (18,400)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '42.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>TGT Secondary Cadre</span>
                <span className="text-blue-900 font-extrabold">32.8% (14,200)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '32.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>PGT Sr Secondary Cadre</span>
                <span className="text-purple-900 font-extrabold">19.8% (8,600)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: '19.8%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
