import React, { useState, useRef, useEffect } from 'react';
import { useApp, getLocalDateStr } from '../../context/AppContext';
import { 
  Bot, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Clock, 
  Calendar, 
  FileText, 
  Award, 
  Building2, 
  UserCheck, 
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { queryTlmsAssistantWithGroq } from '../../services/groqService';

export const AiAssistantChatModule = () => {
  const { role, currentUser, activeTeacher, attendance, leaves, teachers, vacancies, transfers } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const teacherName = currentUser?.full_name || activeTeacher?.full_name || 'Faculty Member';
  const teacherId = currentUser?.emp_id || activeTeacher?.emp_id || 'MIT-FAC-001';
  const teacherDept = activeTeacher?.department || 'Computer Science & Engineering (CSE)';

  // Initial welcome message based on role
  const getInitialMessage = () => {
    if (role === 'teacher') {
      return `Namaste **${teacherName}**! I am your personal **TLMS AI Assistant**, powered by Groq. I can assist you with your personal attendance records, remaining leave balances, service book details, or university transfer and CAS promotion policies.`;
    } else if (role === 'principal') {
      return `Welcome **${teacherName}** (Head of Department)! I am your **Departmental AI Intelligence Copilot**. Ask me for real-time summaries of ${teacherDept} faculty strength, today's attendance compliance, pending leave approvals, or APAR review guidelines.`;
    } else {
      return `Welcome, **Master Administrator**! I am your **University Executive AI Copilot**. I provide high-level summaries of university faculty distribution, active recruitment drives, pending inter-departmental transfers, and institutional accreditation compliance.`;
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      content: getInitialMessage(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Context preparation with strict role boundaries
  const prepareRoleContext = () => {
    const todayStr = getLocalDateStr();
    const myTodayPunch = (attendance || []).find(a => 
      (a.emp_id === teacherId || a.teacher_id === activeTeacher?.id) && a.date === todayStr
    );

    const deptFaculty = (teachers || []).filter(t => 
      !['System Administrator', 'Master Administrator', 'Applicant'].includes(t.cadre) &&
      (t.department || '').toLowerCase().includes((teacherDept || '').toLowerCase())
    );

    const pendingLeaves = (leaves || []).filter(l => l.status === 'Pending').length;
    const pendingTransfers = (transfers || []).filter(t => t.status?.includes('Pending')).length;

    return {
      myTodayStatus: myTodayPunch ? `${myTodayPunch.status} at ${myTodayPunch.punch_in_time}` : 'Not punched yet today',
      deptFacultyCount: deptFaculty.length,
      deptPresentCount: (attendance || []).filter(a => a.date === todayStr && a.status?.includes('Present')).length,
      deptLateCount: (attendance || []).filter(a => a.date === todayStr && a.status?.includes('Late')).length,
      deptLeaveCount: (leaves || []).filter(l => l.status === 'Approved').length,
      pendingLeavesCount: pendingLeaves,
      pendingTransfersCount: pendingTransfers,
      totalFaculty: (teachers || []).length,
      openVacancies: (vacancies || []).reduce((s, v) => s + (v.total_posts || 0), 0)
    };
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const systemContext = prepareRoleContext();
      const response = await queryTlmsAssistantWithGroq({
        query: query.trim(),
        userRole: role,
        currentUser,
        activeTeacher,
        systemContext,
        chatHistory: messages.slice(-6)
      });

      const assistantMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: response.content || 'I processed your query, but no response was returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: response.modelUsed
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Assistant query error:', err);
      const errorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Processing Error**: ${err.message || 'Groq AI service unreachable.'}\n\nPlease check your internet connection and verify \`VITE_GROQ_API_KEY\` in your \`.env\` configuration.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Role-adaptive Starter Prompts
  const starterPrompts = useMemo(() => {
    if (role === 'teacher') {
      return [
        { label: '📍 My Attendance Status', prompt: 'Summarize my attendance status and punch times for today.' },
        { label: '📝 My Leave Balances', prompt: 'How much Casual, Medical, and Duty leave do I have remaining?' },
        { label: '📖 Transfer Application Rules', prompt: 'What documents and criteria are needed to apply for a department transfer?' },
        { label: '🎯 APAR Appraisal Guidelines', prompt: 'Explain the 7th Pay APAR score criteria and research publication weightage.' }
      ];
    } else if (role === 'principal') {
      return [
        { label: '👥 Department Attendance', prompt: `Summarize today's attendance compliance for ${teacherDept}.` },
        { label: '⏳ Pending Leave Requests', prompt: 'Who has pending leave requests in my department requiring approval?' },
        { label: '📊 Department Staffing Strength', prompt: `Give me a breakdown of faculty strength and designations in ${teacherDept}.` },
        { label: '🛡️ Geofence Rules for HODs', prompt: 'Explain the campus geofence boundary rules and grace period for attendance regularizations.' }
      ];
    } else {
      return [
        { label: '🏛️ University Faculty Strength', prompt: 'Give me a department-wise faculty strength and recruitment summary.' },
        { label: '📋 Open Recruitment Drives', prompt: 'Summarize the open vacancies across engineering and current candidate applications.' },
        { label: '⚡ University Governance Status', prompt: 'Summarize pending transfer requests and leaves requiring Vice Chancellor sanction.' },
        { label: '📈 Accreditation Benchmarks', prompt: 'What are our current student-faculty ratios (SFR) and NAAC A+ readiness metrics?' }
      ];
    }
  }, [role, teacherDept]);

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init-reset',
        role: 'assistant',
        content: getInitialMessage(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#18110E] via-[#24130F] to-[#3B1912] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E43D12]/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15">
          <Bot className="w-72 h-72 text-[#FFA2B6]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#EFB11D] text-[#191210] uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#191210]" />
                <span>GROQ AI COPILOT</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase">
                Role-Aware &bull; Minimum Data Scope
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Authorized Query Boundary Active
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              TLMS Intelligent University Assistant
            </h2>
            <p className="text-xs text-[#EAE4DF] leading-relaxed">
              Ask official questions regarding your service book, leave entitlements, shift and geofence guidelines, or departmental rosters. Queries are scoped strictly to your authenticated role.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-[#FFA2B6]" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-[#E2DDD2] shadow-sm overflow-hidden flex flex-col h-[650px]">
        
        {/* Chat Header Bar */}
        <div className="px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2DDD2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E43D12] to-[#EFB11D] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-[#1A1412] tracking-wide">
                  MIT-ADT TLMS COPILOT
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  openai/gpt-oss-120b
                </span>
              </div>
              <p className="text-[10px] text-[#5A524D]">
                Acting for: <strong className="text-[#1A1412]">{teacherName}</strong> ({role.toUpperCase()} &bull; {teacherDept})
              </p>
            </div>
          </div>

          <span className="text-[10px] text-[#5A524D] font-mono hidden sm:inline">
            Zero Data Leakage &bull; RBAC Protected
          </span>
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="bg-[#F7F5F0] px-6 py-2.5 border-b border-[#E2DDD2] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5A524D] shrink-0">
            Suggested Queries:
          </span>
          {starterPrompts.map((sp, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(sp.prompt)}
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-[#18110E] border border-[#E2DDD2] hover:border-[#E43D12] hover:text-[#E43D12] transition-all whitespace-nowrap shadow-2xs shrink-0"
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl shadow-2xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#18110E] text-white rounded-br-none'
                    : msg.isError
                    ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-bl-none'
                    : 'bg-[#FAF9F5] text-[#1A1412] border border-[#E2DDD2] rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line text-xs space-y-1">
                  {msg.content}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1 px-2 text-[10px] text-slate-400 font-mono">
                <span>{msg.timestamp}</span>
                {msg.modelUsed && (
                  <span className="text-[#E43D12]">&bull; {msg.modelUsed}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-4 bg-[#FAF9F5] border border-[#E2DDD2] rounded-3xl w-fit">
              <RefreshCw className="w-4 h-4 text-[#E43D12] animate-spin" />
              <span className="text-xs font-bold text-slate-600">
                Groq AI is reviewing verified database records...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Input Box */}
        <div className="p-4 bg-white border-t border-[#E2DDD2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about shift rules, remaining leaves, CAS increments, department statistics..."
              disabled={isLoading}
              className="flex-1 bg-[#FAF9F5] border border-[#E2DDD2] focus:border-[#E43D12] rounded-2xl px-4 py-3 text-xs text-[#18110E] outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="py-3 px-5 rounded-2xl bg-[#E43D12] hover:bg-[#C7310B] disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Responses are formulated strictly from authorized university records and statutory policies.
          </p>
        </div>

      </div>

    </div>
  );
};
