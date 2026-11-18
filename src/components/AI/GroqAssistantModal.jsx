import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  RefreshCw, 
  ChevronRight, 
  ShieldCheck, 
  MapPin, 
  BookOpen, 
  Award,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { askTLMSAssistant, isGroqConfigured, PRIMARY_GROQ_MODEL } from '../../services/groqService';

export const GroqAssistantModal = () => {
  const { role, currentUser, activeTeacher } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Namaste! I am the **MIT-ADT AI Copilot**, powered by ultra-fast Groq inference. How can I assist you with university governance, attendance geofencing, leave policies, or 7th Pay records today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const facultyName = currentUser?.full_name || activeTeacher?.full_name || 'Faculty Member';
  const facultyDept = activeTeacher?.department || 'School of Engineering (SOE)';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askTLMSAssistant({
        query: query.trim(),
        userRole: role,
        facultyName,
        department: facultyDept,
        chatHistory: messages.slice(-6)
      });

      const assistantMsg = {
        role: 'assistant',
        content: response.content || 'I processed your request, but received an empty response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: response.modelUsed
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Groq Assistant error:', err);
      const errorMsg = {
        role: 'assistant',
        content: `⚠️ **AI Processing Error**: ${err.message || 'Unable to reach Groq Cloud.'}\n\nPlease verify that your \`VITE_GROQ_API_KEY\` is configured in \`.env\`.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: '📍 Shift & Geofence', prompt: 'What are the MIT-ADT attendance shift rules and campus geofence radius?' },
    { label: '📝 Leave Entitlements', prompt: 'What are the annual Casual, Medical, and Duty leave entitlements for faculty?' },
    { label: '📊 7th Pay Criteria', prompt: 'How does 7th Pay Academic Level progression work for Assistant Professors?' },
    { label: '🎯 APAR Scoring', prompt: 'Explain the APAR annual appraisal scoring benchmarks and research weightage.' }
  ];

  return (
    <>
      {/* Floating Launcher Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-[#18110E] hover:bg-[#2A1612] text-white py-2.5 px-4 rounded-full border border-[#E43D12]/50 shadow-2xl flex items-center gap-2.5 group transition-all transform hover:scale-105"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E43D12] to-[#EFB11D] flex items-center justify-center text-white shadow-md">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-white">MIT-ADT AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-[#FFA2B6] font-mono block">Groq 120B Active</span>
          </div>
        </button>
      )}

      {/* Floating Copilot Modal */}
      {isOpen && (
        <div className="fixed bottom-5 right-3 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[580px] max-h-[85vh] bg-[#FAF9F5] rounded-3xl shadow-2xl border border-[#E2DDD2] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-[#18110E] text-white p-4 flex items-center justify-between border-b border-[#E43D12]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E43D12] to-[#EFB11D] flex items-center justify-center text-white shadow">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black tracking-wider text-white">
                    MIT-ADT AI COPILOT
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#E43D12]/40 text-[#FFA2B6] border border-[#FFA2B6]/30">
                    GROQ LPU
                  </span>
                </div>
                <p className="text-[10px] text-[#FFA2B6] truncate max-w-[240px]">
                  {facultyName} &bull; {role.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#F4EFEA] px-3 py-2 border-b border-[#E2DDD2] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={isLoading}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-[#18110E] border border-[#E2DDD2] hover:border-[#E43D12] hover:text-[#E43D12] transition-all whitespace-nowrap shrink-0 shadow-2xs"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl shadow-2xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#18110E] text-white rounded-br-none'
                      : msg.isError
                      ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-bl-none'
                      : 'bg-white text-[#18110E] border border-[#E2DDD2] rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-[11px]">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && (
                    <span className="text-[#E43D12]">&bull; {msg.modelUsed.split('/')[1] || msg.modelUsed}</span>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[#E2DDD2] rounded-2xl w-fit">
                <RefreshCw className="w-3.5 h-3.5 text-[#E43D12] animate-spin" />
                <span className="text-[11px] font-bold text-slate-600">Groq AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E2DDD2] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about geofence, leaves, 7th Pay..."
              disabled={isLoading}
              className="flex-1 bg-[#FAF9F5] border border-[#E2DDD2] focus:border-[#E43D12] rounded-xl px-3 py-2 text-xs text-[#18110E] outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer Status */}
          <div className="bg-[#FAF9F5] px-3 py-1.5 border-t border-[#E2DDD2] flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>Powered by Groq LPUs</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              API Connected
            </span>
          </div>

        </div>
      )}
    </>
  );
};
