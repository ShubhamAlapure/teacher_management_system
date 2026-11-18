import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MitAdtLogo } from '../MitAdtLogo';
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  FileText, 
  GraduationCap, 
  Lightbulb, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Users,
  Wrench,
  Compass,
  MapPin,
  Camera,
  Clock,
  Building2,
  TrendingUp,
  BarChart3,
  FileCheck,
  Cpu,
  Layers,
  Calendar,
  Zap,
  Check,
  Eye,
  HelpCircle,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Receipt,
  ArrowLeftRight,
  UserPlus,
  FolderLock,
  UserX,
  AlertCircle,
  Info,
  FileSpreadsheet,
  Activity,
  HeartHandshake,
  Landmark,
  BadgeCheck
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  const { login } = useApp();

  // State for interactive FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => (prev === index ? -1 : index));
  };

  // State for Downloads modal or popup
  const [showDownloadsModal, setShowDownloadsModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans text-[#1A1412] flex flex-col selection:bg-[#E43D12] selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. STRICTLY PRESERVED: Header Navigation Bar
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E2DDD2] shadow-sm px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MitAdtLogo variant="light" />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#453D38]">
          <a href="#home" className="text-[#E43D12] font-black hover:text-[#C7310B] transition-colors">Home</a>
          <a href="#overview" className="hover:text-[#E43D12] transition-colors">About TLMS</a>
          <button 
            type="button" 
            onClick={() => setShowDownloadsModal(true)} 
            className="hover:text-[#E43D12] transition-colors cursor-pointer font-bold text-[#453D38]"
          >
            Downloads
          </button>
          <div className="relative group flex items-center gap-1 cursor-pointer hover:text-[#E43D12] transition-colors">
            <span>More</span>
            <ChevronDown className="w-4 h-4" />
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-white border border-[#E2DDD2] rounded-2xl shadow-xl py-2 w-48 text-xs font-bold text-[#1A1412]">
              <a href="#lifecycle" className="block px-4 py-2 hover:bg-[#FDF2EE] hover:text-[#E43D12]">Faculty Lifecycle</a>
              <a href="#modules" className="block px-4 py-2 hover:bg-[#FDF2EE] hover:text-[#E43D12]">Key Modules</a>
              <a href="#roles" className="block px-4 py-2 hover:bg-[#FDF2EE] hover:text-[#E43D12]">Role Governance</a>
              <a href="#service-book" className="block px-4 py-2 hover:bg-[#FDF2EE] hover:text-[#E43D12]">Digital Service Book</a>
              <a href="#faq" className="block px-4 py-2 hover:bg-[#FDF2EE] hover:text-[#E43D12]">FAQ & Support</a>
            </div>
          </div>
        </nav>

        {/* Right Action Pill Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('teacher')}
            className="px-5 py-2 rounded-full border-2 border-[#E43D12] text-[#E43D12] text-xs font-black hover:bg-[#FDF2EE] transition-all"
          >
            Faculty Login
          </button>
          
          <button
            onClick={() => onOpenAuth('admin')}
            className="px-5 py-2.5 rounded-full bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black shadow-md shadow-[#E43D12]/30 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#EFB11D]" />
            <span>Master Admin Login</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. STRICTLY PRESERVED: Hero Section (with Campus Background)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="text-white py-20 px-6 lg:px-16 overflow-hidden relative"
        style={{
          backgroundImage: 'url(/mit_adt_campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          minHeight: '520px',
        }}
      >
        {/* Dark + warm vermillion/espresso tint overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#170E0C]/92 via-[#26130F]/85 to-black/60 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#FFA2B6]/40 text-xs font-black uppercase tracking-widest text-[#FFA2B6]">
              MIT-ADT UNIVERSITY FACULTY SYSTEM
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Where Every Educator Inspires a <span className="text-[#EFB11D]">Legacy Worth Building</span>
            </h1>

            <p className="text-sm sm:text-base text-[#F5F2ED] leading-relaxed max-w-2xl">
              A cloud-enabled platform that digitizes the complete faculty lifecycle — from recruitment and posting to e-Service Book, 7th Pay payroll, APAR research appraisals, and superannuation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onOpenAuth('teacher')}
                className="px-7 py-3.5 rounded-full bg-[#E43D12] text-white font-black text-xs uppercase tracking-wider hover:bg-[#C7310B] transition-all shadow-lg shadow-[#E43D12]/40"
              >
                Get Started
              </button>

              <a
                href="#overview"
                className="px-7 py-3.5 rounded-full border-2 border-white/80 text-white font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Vector Illustration (3 Mentors Line Art SVG matching screenshot) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl relative">
              <svg className="w-full h-auto text-white" viewBox="0 0 400 300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Lightbulb Idea */}
                <path d="M70 110 C70 85 90 65 115 65 C140 65 160 85 160 110 C160 130 145 145 135 155 L135 175 L95 175 L95 155 C85 145 70 130 70 110 Z" fill="rgba(255, 235, 59, 0.2)" stroke="#fde047" strokeWidth="3" />
                <line x1="95" y1="185" x2="135" y2="185" stroke="#fde047" strokeWidth="3" />
                {/* Rays */}
                <line x1="115" y1="35" x2="115" y2="50" stroke="#fde047" strokeWidth="3" />
                <line x1="50" y1="70" x2="62" y2="80" stroke="#fde047" strokeWidth="3" />
                <line x1="180" y1="70" x2="168" y2="80" stroke="#fde047" strokeWidth="3" />

                {/* Person 1 Left */}
                <circle cx="115" cy="220" r="22" stroke="white" strokeWidth="3" />
                <path d="M70 280 C70 245 90 245 115 245 C140 245 160 245 160 280" stroke="white" strokeWidth="3" />

                {/* Person 2 Center (Main Mentor) */}
                <circle cx="230" cy="150" r="30" stroke="white" strokeWidth="3.5" />
                <path d="M165 240 C165 195 195 195 230 195 C265 195 295 195 295 240" stroke="white" strokeWidth="3.5" />

                {/* Person 3 Right */}
                <circle cx="330" cy="180" r="24" stroke="white" strokeWidth="3" />
                <path d="M285 270 C285 225 305 225 330 225 C355 225 375 225 375 270" stroke="white" strokeWidth="3" />

                {/* Laptop Screen */}
                <rect x="200" y="240" x2="300" y2="285" width="120" height="40" rx="6" fill="white" stroke="#E43D12" />
                <circle cx="260" cy="260" r="5" fill="#E43D12" />
                <path d="M190 285 L330 285" stroke="white" strokeWidth="4" />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. STRICTLY PRESERVED: Connected Stepper Bar
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#18110E] py-6 border-b border-[#2C1814] text-white">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between relative">
          {/* Horizontal Line */}
          <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-1 bg-[#3A1E18] -z-0" />

          {/* Stepper Node 1 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E43D12] border-4 border-[#18110E] flex items-center justify-center shadow-lg">
              <Lightbulb className="w-5 h-5 text-[#EFB11D]" />
            </div>
            <span className="text-[11px] font-black">1. Recruitment</span>
          </div>

          {/* Stepper Node 2 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E43D12] border-4 border-[#18110E] flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-[#FFA2B6]" />
            </div>
            <span className="text-[11px] font-black">2. e-Service Book</span>
          </div>

          {/* Stepper Node 3 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E43D12] border-4 border-[#18110E] flex items-center justify-center shadow-lg">
              <Wrench className="w-5 h-5 text-[#FFA2B6]" />
            </div>
            <span className="text-[11px] font-black">3. Transfers & APAR</span>
          </div>

          {/* Stepper Node 4 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#E43D12] border-4 border-[#18110E] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-[#EFB11D]" />
            </div>
            <span className="text-[11px] font-black">4. 7th Pay Payroll</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1 — Platform Overview (Alternating Light: #FAF9F5)
      ───────────────────────────────────────────────────────────── */}
      <section id="overview" className="py-20 px-6 lg:px-12 bg-[#FAF9F5] border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6] uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Faculty Platform</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1412] tracking-tight">
              One Platform. Every Stage of a Faculty Journey.
            </h2>
            <p className="text-sm text-[#5A524D] leading-relaxed">
              A unified digital platform designed to simplify faculty administration, centralize service records, and connect essential faculty-related processes across the university.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-7 rounded-3xl bg-white border border-[#E2DDD2] hover:border-[#FFA2B6] hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#E43D12] group-hover:bg-[#E43D12] group-hover:text-white transition-colors flex items-center justify-center">
                <FolderLock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Centralized Faculty Records</h3>
              <p className="text-xs text-[#5A524D] leading-relaxed">
                Consolidates biographical, pedagogical, educational, and service data into an immutable institutional single source of truth.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E2DDD2] hover:border-[#FFA2B6] hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#E43D12] group-hover:bg-[#E43D12] group-hover:text-white transition-colors flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Automated Workflows</h3>
              <p className="text-xs text-[#5A524D] leading-relaxed">
                Streamlines paperless approvals for department transfers, leave sanctioning, cadre promotions, and annual research appraisals.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E2DDD2] hover:border-[#FFA2B6] hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#E43D12] group-hover:bg-[#E43D12] group-hover:text-white transition-colors flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Transparent Service Management</h3>
              <p className="text-xs text-[#5A524D] leading-relaxed">
                Provides real-time visibility for faculty, department heads, and deans with audit-trailed verifications and prompt status updates.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#E2DDD2] hover:border-[#FFA2B6] hover:shadow-xl transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#E43D12] group-hover:bg-[#E43D12] group-hover:text-white transition-colors flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Data-Driven Insights</h3>
              <p className="text-xs text-[#5A524D] leading-relaxed">
                Empowers university leadership with instant analytics on cadre distribution, teacher-student ratios, accreditation readiness, and research outputs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2 — Faculty Lifecycle Journey (Alternating Dark: #170E0C)
      ───────────────────────────────────────────────────────────── */}
      <section id="lifecycle" className="py-20 px-6 lg:px-12 bg-gradient-to-b from-[#170E0C] via-[#22120F] to-[#170E0C] text-white border-b border-[#2C1814]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase tracking-wider inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#EFB11D]" />
              <span>End-to-End Career Continuum</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              The Complete Faculty Lifecycle Journey
            </h2>
            <p className="text-sm text-[#EAE4DF] leading-relaxed">
              From the day an educator joins MIT-ADT University to retirement, every milestone is orchestrated in a unified, transparent digital workflow.
            </p>
          </div>

          {/* Interactive 9-Stage Connected Journey Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-4 items-stretch relative">
            {[
              { num: '01', title: 'Recruitment', icon: UserPlus, desc: 'Public vacancy posting & digital portfolio scrutiny' },
              { num: '02', title: 'Appointment', icon: FileCheck, desc: 'Selection committee approval & formal appointment order' },
              { num: '03', title: 'Faculty Profile', icon: UserCheck, desc: 'Centralized e-ID, qualifications & cadre allocation' },
              { num: '04', title: 'Attendance & Leave', icon: Camera, desc: 'GPS Map Cam telemetry & smart leave sanctioning' },
              { num: '05', title: 'e-Service Book', icon: BookOpen, desc: 'Immutable chronological ledger of promotions & service' },
              { num: '06', title: 'Transfers', icon: ArrowLeftRight, desc: 'Inter-departmental & campus posting requests' },
              { num: '07', title: 'APAR & Review', icon: Award, desc: 'Annual performance appraisals & Scopus research API scores' },
              { num: '08', title: '7th Pay Payroll', icon: Receipt, desc: 'Academic pay band matrix & automated payslips' },
              { num: '09', title: 'Superannuation', icon: GraduationCap, desc: 'Gratuity, pension clearance & emeritus recognition' },
            ].map((stage, idx) => {
              const IconComp = stage.icon;
              return (
                <div 
                  key={stage.num}
                  className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#EFB11D]/50 transition-all duration-300 flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#EFB11D]">{stage.num}</span>
                    <div className="p-2 rounded-xl bg-[#E43D12]/20 text-[#FFA2B6] group-hover:bg-[#E43D12] group-hover:text-white transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-[#EFB11D] transition-colors">{stage.title}</h4>
                    <p className="text-[11px] text-[#C7BFB8] mt-1 leading-snug">{stage.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center text-[10px] text-[#FFA2B6] font-bold">
                    <span>Stage {idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 — Key Modules (Alternating Light: #EBE9E1)
      ───────────────────────────────────────────────────────────── */}
      <section id="modules" className="py-20 px-6 lg:px-12 bg-[#EBE9E1] border-b border-[#DDD7CB]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6] uppercase tracking-wider inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Institutional Capability</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1412] tracking-tight">
              Everything Faculty Administration Needs
            </h2>
            <p className="text-sm text-[#5A524D] leading-relaxed">
              Twelve mission-critical modules engineered to support university registrars, deans, department heads, and teaching faculty.
            </p>
          </div>

          {/* 12 Module Cards in a 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[
              { title: 'Faculty Management', icon: Users, desc: 'Centralized directory of professors, associate professors, and lecturers across all schools.' },
              { title: 'Recruitment & Job Repository', icon: UserPlus, desc: 'End-to-end recruitment pipeline with openings, candidate scrutiny, and appointment offers.' },
              { title: 'Attendance Management', icon: Camera, desc: 'Tamper-proof GPS Map Camera verification with high-accuracy altitude and campus geofencing.' },
              { title: 'Leave Management', icon: Clock, desc: 'Dynamic Casual, Medical, and Earned leave balances with multi-tier HOD sanctioning workflows.' },
              { title: 'Digital e-Service Book', icon: BookOpen, desc: 'Immutable chronological service records, pay band updates, qualifications, and increments.' },
              { title: 'Transfer Management', icon: ArrowLeftRight, desc: 'Departmental and campus transfer petitions with merit recommendations and executive sanction.' },
              { title: 'APAR & Performance', icon: Award, desc: 'Annual performance appraisals, research paper evaluations, and UGC/AICTE API scoring.' },
              { title: '7th Pay Payroll', icon: Receipt, desc: '7th Central Pay Commission salary matrix, allowances, deductions, and certified monthly payslips.' },
              { title: 'Training & Development', icon: GraduationCap, desc: 'Faculty Development Programs (FDP), AICTE refresher course enrollments, and credits.' },
              { title: 'Document Vault', icon: FolderLock, desc: 'Secure repository for Ph.D. degrees, Aadhaar, PAN, experience certificates, and credentials.' },
              { title: 'Institutional Notifications', icon: Sparkles, desc: 'University-wide circulars, approval status changes, and automated deadline reminders.' },
              { title: 'Reports & Analytics', icon: BarChart3, desc: 'NIRF/NAAC accreditation summaries, PTR metrics, and departmental strength dashboards.' },
            ].map((module) => {
              const IconComp = module.icon;
              return (
                <div 
                  key={module.title}
                  className="p-6 rounded-3xl bg-white border border-[#E2DDD2] hover:border-[#FFA2B6] hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FDF2EE] text-[#E43D12] group-hover:bg-[#E43D12] group-hover:text-white transition-colors flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-black text-[#1A1412] group-hover:text-[#E43D12] transition-colors">{module.title}</h3>
                    <p className="text-xs text-[#5A524D] leading-relaxed">{module.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-[#EBE9E1]">
                    <button
                      onClick={() => onOpenAuth('teacher')}
                      className="text-xs font-bold text-[#E43D12] hover:text-[#C7310B] flex items-center gap-1 transition-all group-hover:translate-x-1"
                    >
                      <span>Explore Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4 — Role-Based Access (Alternating Dark: #1E1210)
      ───────────────────────────────────────────────────────────── */}
      <section id="roles" className="py-20 px-6 lg:px-12 bg-[#1E1210] text-white border-b border-[#2C1814]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EFB11D]" />
              <span>Role Governance & Security</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Tailored Authority for Every Stakeholder
            </h2>
            <p className="text-sm text-[#EAE4DF] leading-relaxed">
              Granular access controls designed to provide educators, academic leadership, and administrators with the exact tools they need.
            </p>
          </div>

          {/* 4 Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Faculty */}
            <div className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFA2B6]/50 transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300">
                    Faculty
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">Faculty Member</h3>
                <ul className="text-xs text-[#EAE4DF] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Manage personal profile & qualifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Access e-Service Book & promotion records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mark daily GPS Map Cam geo-attendance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Submit leave requests & track approvals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Download 7th Pay monthly payslips</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('teacher')}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all"
              >
                Sign In as Faculty
              </button>
            </div>

            {/* HOD */}
            <div className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFA2B6]/50 transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300">
                    HOD
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">Head of Department (HOD)</h3>
                <ul className="text-xs text-[#EAE4DF] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Monitor department faculty daily attendance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Inspect GPS Map Cam photos & coordinates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Regularize punches & sanction leaves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Recommend inter-department transfers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Grade annual research APAR & API scores</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('principal')}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all"
              >
                Sign In as HOD
              </button>
            </div>

            {/* University Administration */}
            <div className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFA2B6]/50 transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300">
                    Dean / Admin
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">University Administration</h3>
                <ul className="text-xs text-[#EAE4DF] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Oversee campus-wide faculty lifecycle records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Administer recruitment vacancies & offers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Sanction gazetted transfer orders & cadres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Export NAAC / NIRF accreditation data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Authorize 7th CPC academic payroll</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('principal')}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all"
              >
                Sign In as Dean
              </button>
            </div>

            {/* Master Administrator */}
            <div className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFA2B6]/50 transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300">
                    Master Admin
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">Master Administrator</h3>
                <ul className="text-xs text-[#EAE4DF] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Manage platform configuration & settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Configure user roles & security permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Supabase database & cloud connectivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>System-level audit logging & monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Vice-Chancellor Executive Oversight</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('admin')}
                className="w-full py-2.5 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black transition-all"
              >
                Sign In as Master Admin
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 — Digital e-Service Book (Alternating Light: #FAF9F5)
      ───────────────────────────────────────────────────────────── */}
      <section id="service-book" className="py-20 px-6 lg:px-12 bg-[#FAF9F5] border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6] uppercase tracking-wider inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Government & UGC Compliant</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1412] tracking-tight leading-tight">
              Every Faculty Record. One Digital Journey.
            </h2>
            <p className="text-sm text-[#5A524D] leading-relaxed">
              Say goodbye to physical registers and paper files. The Digital Service Book centralizes important professional milestones in an immutable, structured electronic chronicle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2DDD2] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#E43D12] tracking-wider">Appointment Orders</span>
                <p className="text-xs font-bold text-[#1A1412]">Verified joining date & official cadre</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2DDD2] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#E43D12] tracking-wider">Pay Band Progression</span>
                <p className="text-xs font-bold text-[#1A1412]">7th CPC Academic Matrix revisions</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2DDD2] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#E43D12] tracking-wider">Leave Ledger</span>
                <p className="text-xs font-bold text-[#1A1412]">Accrual of earned, casual & medical leaves</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2DDD2] space-y-1">
                <span className="text-[10px] font-black uppercase text-[#E43D12] tracking-wider">FDP & Certifications</span>
                <p className="text-xs font-bold text-[#1A1412]">AICTE/UGC approved training credits</p>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('teacher')}
              className="px-6 py-3 rounded-2xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black shadow-lg shadow-[#E43D12]/30 transition-all flex items-center gap-2"
            >
              <span>View e-Service Book Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Visual Mockup Showcase */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-[#E2DDD2] shadow-2xl overflow-hidden p-6 space-y-5">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF2EE] text-[#E43D12] font-black flex items-center justify-center text-sm border border-[#FFA2B6]">
                    PS
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#1A1412]">Dr. Priya Sharma</h4>
                    <p className="text-[11px] text-[#5A524D]">Associate Professor &bull; Computer Science & Engineering</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  Active Service
                </span>
              </div>

              {/* Service Chronology Mock Timeline */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#5A524D] tracking-wider block">Service History Timeline</span>
                
                {[
                  { year: '2024', event: 'Cadre Promotion: Associate Professor', tag: 'Academic Level 13A', verified: true },
                  { year: '2021', event: 'UGC-FDP: Machine Learning in Education', tag: 'IIT Bombay (30 Hours)', verified: true },
                  { year: '2018', event: 'Department Reassignment: SOE - CSE', tag: 'Rajbaug Campus', verified: true },
                  { year: '2013', event: 'Initial Gazetted Appointment: Assistant Professor', tag: 'MIT-ADT University', verified: true }
                ].map((item) => (
                  <div key={item.year} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E2DDD2] flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#E43D12]">{item.year}</span>
                        <span className="font-bold text-[#1A1412]">{item.event}</span>
                      </div>
                      <span className="text-[10px] text-[#5A524D] block">{item.tag}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Gazetted
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#FDF2EE] border border-[#FFA2B6] text-[10px] text-[#5A524D] flex items-center justify-between">
                <span>Illustrative demonstration record &bull; Encrypted tamper-evident blockchain-style hash</span>
                <span className="font-mono text-[#E43D12] font-bold">#DSB-VERIFIED</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6 — Smart Attendance & Administration (Dark: #18110E)
      ───────────────────────────────────────────────────────────── */}
      <section id="attendance" className="py-20 px-6 lg:px-12 bg-[#18110E] text-white border-b border-[#2C1814]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Preview Card */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-gradient-to-br from-[#241310] to-[#170E0C] rounded-3xl border border-[#E43D12]/30 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-[#EFB11D]">GPS MAP CAM TELEMETRY</span>
                </div>
                <span className="text-[10px] font-mono text-[#FFA2B6]">08:52:14 AM</span>
              </div>

              <div className="aspect-[4/3] rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden flex flex-col justify-end p-4">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url(/mit_adt_campus.jpg)' }} />
                <div className="relative z-10 bg-black/80 backdrop-blur-md p-3 rounded-xl space-y-1 text-[10px] font-mono text-yellow-300 border border-yellow-500/20">
                  <p className="font-bold text-white text-xs truncate">📍 MIT-ADT University, Rajbaug Campus, Pune</p>
                  <p>LAT: 18.490218° N &bull; LONG: 74.025412° E</p>
                  <p>ALTITUDE: 564.2m ASL &bull; ACCURACY: 3.8m</p>
                  <div className="flex items-center justify-between text-emerald-400 pt-1 border-t border-white/10">
                    <span>✓ Campus Geofence Matched</span>
                    <span className="text-white font-bold">STATUS: PRESENT</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#FFA2B6] block">Total Faculty</span>
                  <strong className="text-sm font-black text-white">7</strong>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-300 block">Present</span>
                  <strong className="text-sm font-black text-emerald-400">100%</strong>
                </div>
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <span className="text-purple-300 block">Leave</span>
                  <strong className="text-sm font-black text-purple-400">0</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase tracking-wider inline-flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#EFB11D]" />
              <span>Smart Geofenced Attendance</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Next-Gen Geo-Attendance & Leave Intelligence
            </h2>
            <p className="text-sm text-[#EAE4DF] leading-relaxed">
              High-precision GPS telemetry, altitude ASL calculation, and photo verification eliminate proxy attendance and paper trail delays.
            </p>

            <div className="space-y-3.5">
              {[
                { title: 'GPS Map Cam Telemetry', desc: 'Captures high-resolution selfie proofs with stamped coordinates, altitude, and timestamp.' },
                { title: 'Campus Perimeter Geofencing', desc: 'Validates arrival within the recognized 125-acre Rajbaug Campus boundary.' },
                { title: 'Department Roster Visibility', desc: 'HODs view a complete roster with clear distinction between Present, Late, Leave, and Unmarked.' },
                { title: 'One-Click Regularization', desc: 'Direct HOD authorization for faculty on university field duty, exams, or conferences.' },
              ].map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-[#E43D12] text-white shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{feat.title}</h4>
                    <p className="text-[11px] text-[#C7BFB8]">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onOpenAuth('teacher')}
              className="px-6 py-3 rounded-2xl bg-[#EFB11D] hover:bg-[#DFA30E] text-[#1A110F] text-xs font-black shadow-lg transition-all flex items-center gap-2"
            >
              <span>Explore Geo-Attendance Portal</span>
              <ArrowRight className="w-4 h-4 text-[#1A110F]" />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7 — Insights & Analytics (Alternating Light: #EBE9E1)
      ───────────────────────────────────────────────────────────── */}
      <section id="analytics" className="py-20 px-6 lg:px-12 bg-[#EBE9E1] border-b border-[#DDD7CB]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6] uppercase tracking-wider inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Institutional Intelligence</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1412] tracking-tight">
              Data-Driven Decisions for University Leadership
            </h2>
            <p className="text-sm text-[#5A524D] leading-relaxed">
              Real-time dashboards and dynamic visualizations giving Vice-Chancellors, Deans, and Registrars actionable oversight across all university schools.
            </p>
          </div>

          {/* Analytics Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Faculty Distribution */}
            <div className="p-6 rounded-3xl bg-white border border-[#E2DDD2] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3">
                <h3 className="text-sm font-black text-[#1A1412]">Cadre Distribution</h3>
                <span className="text-[10px] font-bold text-[#E43D12]">University Cadres</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[#1A1412] mb-1">
                    <span>Professors & HODs</span>
                    <span>28%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EBE9E1] overflow-hidden">
                    <div className="h-full bg-[#E43D12] rounded-full w-[28%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[#1A1412] mb-1">
                    <span>Associate Professors</span>
                    <span>36%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EBE9E1] overflow-hidden">
                    <div className="h-full bg-[#EFB11D] rounded-full w-[36%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[#1A1412] mb-1">
                    <span>Assistant Professors</span>
                    <span>36%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EBE9E1] overflow-hidden">
                    <div className="h-full bg-[#D6536D] rounded-full w-[36%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Department Roster Strengths */}
            <div className="p-6 rounded-3xl bg-white border border-[#E2DDD2] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3">
                <h3 className="text-sm font-black text-[#1A1412]">Department Strengths</h3>
                <span className="text-[10px] font-bold text-emerald-700">PTR Compliant</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'Computer Science (CSE)', faculty: 7, ptr: '1:18' },
                  { name: 'AI & Data Science (AIDS)', faculty: 3, ptr: '1:15' },
                  { name: 'Mechanical Engineering', faculty: 3, ptr: '1:17' },
                  { name: 'Electronics & Telecom', faculty: 3, ptr: '1:16' }
                ].map(dept => (
                  <div key={dept.name} className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5]">
                    <span className="font-bold text-[#1A1412]">{dept.name}</span>
                    <span className="text-[11px] font-mono font-bold text-[#E43D12]">{dept.faculty} Faculty &bull; {dept.ptr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Research & APAR Metrics */}
            <div className="p-6 rounded-3xl bg-white border border-[#E2DDD2] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3">
                <h3 className="text-sm font-black text-[#1A1412]">Research & Appraisals</h3>
                <span className="text-[10px] font-bold text-blue-700">NAAC Ready</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-[#FDF2EE] border border-[#FFA2B6]">
                  <span className="text-[10px] font-bold text-[#5A524D] block uppercase">Avg API Score</span>
                  <span className="text-xl font-black text-[#E43D12]">87.4</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">Publications</span>
                  <span className="text-xl font-black text-amber-800">142</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">FDP Completed</span>
                  <span className="text-xl font-black text-emerald-800">96%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 block uppercase">Transfers Done</span>
                  <span className="text-xl font-black text-blue-800">18</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8 — AI & Intelligent Assistance (Dark: #1A110F)
      ───────────────────────────────────────────────────────────── */}
      <section id="ai-assistance" className="py-20 px-6 lg:px-12 bg-gradient-to-b from-[#1A110F] via-[#2A1612] to-[#1A110F] text-white border-b border-[#2C1814]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#E43D12]/30 text-[#FFA2B6] border border-[#FFA2B6]/40 uppercase tracking-wider inline-flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#EFB11D]" />
              <span>Emerging Innovation & Roadmap</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              AI-Assisted Faculty Administration
            </h2>
            <p className="text-sm text-[#EAE4DF] leading-relaxed">
              Leveraging intelligent algorithms to accelerate document scrutiny, extract qualification metadata, and provide proactive institutional insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#EFB11D]/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E43D12]/30 text-[#FFA2B6] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Automated Document Parsing</h3>
              <p className="text-xs text-[#C7BFB8] leading-relaxed">
                Extracts degree certificates, Ph.D. notification dates, and experience letters automatically during recruitment scrutiny.
              </p>
              <span className="inline-block text-[10px] font-bold text-[#EFB11D]">Active Assistant</span>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#EFB11D]/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E43D12]/30 text-[#FFA2B6] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">API Score & DOI Verification</h3>
              <p className="text-xs text-[#C7BFB8] leading-relaxed">
                Cross-references Scopus and Web of Science publication IDs to validate faculty research API claims during annual APAR cycles.
              </p>
              <span className="inline-block text-[10px] font-bold text-[#EFB11D]">Scrutiny Assistant</span>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#EFB11D]/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E43D12]/30 text-[#FFA2B6] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Smart Workload Balancing</h3>
              <p className="text-xs text-[#C7BFB8] leading-relaxed">
                Analyzes teaching credit hours and lab sessions across semesters to optimize department pupil-teacher ratios.
              </p>
              <span className="inline-block text-[10px] font-bold text-[#FFA2B6]">Platform Roadmap</span>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#EFB11D]/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E43D12]/30 text-[#FFA2B6] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Regulatory Audit Compliance</h3>
              <p className="text-xs text-[#C7BFB8] leading-relaxed">
                Pre-formats institutional faculty data into one-click accreditation packets for NAAC Criterion 2 and NIRF disclosures.
              </p>
              <span className="inline-block text-[10px] font-bold text-[#FFA2B6]">Platform Roadmap</span>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9 — Platform Benefits (Alternating Light: #FAF9F5)
      ───────────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 px-6 lg:px-12 bg-[#FAF9F5] border-b border-[#E2DDD2]">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6] uppercase tracking-wider inline-flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Institutional Excellence</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1412] tracking-tight">
              Designed for Simpler, Smarter Faculty Administration.
            </h2>
            <p className="text-sm text-[#5A524D] leading-relaxed">
              Transforming complex administrative bureaucracy into an intuitive, productive digital environment for university educators and academic leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Paperless Governance', desc: 'Over 95% reduction in physical paperwork, service registers, and physical leave sanction forms.' },
              { title: 'Centralized Records', desc: 'A unified institutional database shared seamlessly across HR, payroll, and academic departments.' },
              { title: 'Transparent Approvals', desc: 'Real-time tracking of transfer petitions, leave applications, and performance recommendations.' },
              { title: 'Faster Information Retrieval', desc: 'Sub-second digital lookup of faculty service chronicles, increments, and qualifications.' },
              { title: 'Accreditation Readiness', desc: 'One-click export of verified faculty qualification tables for NAAC and NIRF compliance.' },
              { title: 'Zero Proxy Attendance', desc: 'Dual-layer biometric and GPS camera verification ensures absolute accountability and fairness.' },
              { title: 'Integrated 7th CPC Payroll', desc: 'Automated synchronization between attendance records, leaves, and salary slip disbursement.' },
              { title: 'Multi-Device Responsiveness', desc: 'Accessible on desktop workstations, tablets, and mobile devices with clean responsive layout.' }
            ].map(b => (
              <div key={b.title} className="p-6 rounded-3xl bg-white border border-[#E2DDD2] hover:border-[#FFA2B6] hover:shadow-lg transition-all space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FDF2EE] text-[#E43D12] flex items-center justify-center font-bold">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <h4 className="text-base font-black text-[#1A1412]">{b.title}</h4>
                <p className="text-xs text-[#5A524D] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 10 — FAQ (Alternating Cream: #EBE9E1)
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-6 lg:px-12 bg-[#EBE9E1] border-b border-[#DDD7CB]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6] uppercase tracking-wider inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1412] tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="text-sm text-[#5A524D] leading-relaxed">
              Concise answers to common questions regarding TLMS access, policies, and system capabilities.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What is the Teacher Lifecycle Management System (TLMS)?',
                a: 'TLMS is MIT-ADT University\'s centralized digital platform governing the complete academic employment journey—from recruitment advertising and selection to service chronicles, attendance, transfers, appraisals, and retirement.'
              },
              {
                q: 'Who can use the platform?',
                a: 'Appointed university faculty members, prospective applicants/research scholars, Heads of Department (HODs), School Deans, University Registrars, and executive system administrators.'
              },
              {
                q: 'How can faculty access their Digital e-Service Book?',
                a: 'Faculty log in using their institutional email address. Once authenticated, they navigate to the "Digital Service Book" tab to view their Form 16, pay band progressions, promotion records, and leave history.'
              },
              {
                q: 'How does the system manage and verify daily attendance?',
                a: 'Attendance is marked via the GPS Map Camera module. It captures a verified live selfie imprinted with GPS latitude, longitude, altitude above sea level, address, and timestamp, cross-referencing it against the Rajbaug Campus geofence.'
              },
              {
                q: 'What administrative controls can Heads of Department (HODs) access?',
                a: 'HODs have direct oversight over their department\'s complete roster. They can view real-time attendance, regularize on-duty or missed punches, approve leave applications, recommend transfers, and evaluate annual APAR scores.'
              },
              {
                q: 'How are faculty records and confidential documents maintained?',
                a: 'All documents in the Document Vault are encrypted and access-controlled through strict role-based permissions. Only authorized university scrutiny cells and administrators can view sensitive personal records.'
              },
              {
                q: 'What is the purpose of the Digital e-Service Book?',
                a: 'It provides an immutable, transparent single source of truth for every faculty member\'s service history, promotions, qualifications, pay revisions, and disciplinary clearances, eliminating physical paperwork.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={faq.q}
                  className="rounded-2xl bg-white border border-[#E2DDD2] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1A1412] hover:text-[#E43D12] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <div className="p-1 rounded-full bg-[#FAF9F5] text-[#5A524D] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#5A524D] leading-relaxed border-t border-[#FAF9F5] pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 11 — Final Call-to-Action (Dark: #140D0B)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-[#1A110F] via-[#2A1612] to-[#140D0B] text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-[#FFA2B6]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-[#EFB11D] text-[#191210] uppercase tracking-widest inline-block shadow-md">
            EMPOWERING EDUCATORS
          </span>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Bringing Faculty Administration into a Connected Digital Future.
          </h2>

          <p className="text-sm sm:text-base text-[#EAE4DF] max-w-2xl mx-auto leading-relaxed">
            Explore a unified platform designed to make faculty-related services more accessible, organized, and efficient for the entire MIT-ADT University community.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenAuth('teacher')}
              className="px-8 py-4 rounded-full bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-[#E43D12]/40 transition-all flex items-center gap-2"
            >
              <span>Faculty Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#overview"
              className="px-8 py-4 rounded-full border-2 border-white/80 hover:bg-white/10 text-white text-xs font-black uppercase tracking-wider transition-all"
            >
              Explore the Platform
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 12 — Complete University Footer (#100A08)
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#100A08] text-[#D8D0C9] text-xs pt-16 pb-12 px-6 lg:px-12 border-t border-[#291713]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Col 1: University Identity */}
            <div className="lg:col-span-2 space-y-4">
              <MitAdtLogo />
              <p className="text-xs text-[#A69C95] leading-relaxed max-w-sm">
                Teacher Lifecycle Management System (TLMS) &bull; Official Digital Governance Platform for MIT-ADT University, Pune, India.
              </p>
              <div className="text-[11px] text-[#C7BFB8] space-y-1 font-mono">
                <p>📍 Rajbaug Campus, Loni Kalbhor, Pune - 412201</p>
                <p>Maharashtra, India</p>
              </div>
            </div>

            {/* Col 2: Quick Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-2 text-[11px] text-[#A69C95]">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#overview" className="hover:text-white transition-colors">About TLMS</a></li>
                <li><a href="#lifecycle" className="hover:text-white transition-colors">Faculty Lifecycle</a></li>
                <li><a href="#modules" className="hover:text-white transition-colors">Key Modules</a></li>
                <li><a href="#roles" className="hover:text-white transition-colors">Role Governance</a></li>
              </ul>
            </div>

            {/* Col 3: Portals & Access */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Portals & Access</h4>
              <ul className="space-y-2 text-[11px] text-[#A69C95]">
                <li><button onClick={() => onOpenAuth('teacher')} className="hover:text-white transition-colors text-left">Faculty Portal</button></li>
                <li><button onClick={() => onOpenAuth('principal')} className="hover:text-white transition-colors text-left">HOD Monitoring Desk</button></li>
                <li><button onClick={() => onOpenAuth('admin')} className="hover:text-white transition-colors text-left">Master Administrator</button></li>
                <li><button onClick={() => onOpenAuth('applicant')} className="hover:text-white transition-colors text-left">Applicant Job Portal</button></li>
                <li><button onClick={() => setShowDownloadsModal(true)} className="hover:text-white transition-colors text-left">Downloads & Circulars</button></li>
              </ul>
            </div>

            {/* Col 4: Governance & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Governance & Support</h4>
              <ul className="space-y-2 text-[11px] text-[#A69C95]">
                <li><a href="#faq" className="hover:text-white transition-colors">Help & FAQ</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Governance</a></li>
                <li><span className="text-[#C7BFB8]">IT Support Cell:</span></li>
                <li className="font-mono text-[#FFA2B6]">support@mituniversity.edu.in</li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C827A] text-center sm:text-left">
            <p>
              &copy; 2026 MIT Art, Design and Technology University, Pune. All Rights Reserved.
            </p>
            <p className="flex items-center gap-2">
              <span>Digital University Governance Initiative</span>
              <span>&bull;</span>
              <span className="text-[#EFB11D] font-bold">TLMS v2.6 Enterprise</span>
            </p>
          </div>

        </div>
      </footer>

      {/* Downloads Modal */}
      {showDownloadsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-[#1A1412] w-full max-w-md rounded-3xl border border-[#E2DDD2] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3">
              <h3 className="text-sm font-black text-[#1A1412] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#E43D12]" />
                <span>University Downloads & Circulars</span>
              </h3>
              <button 
                onClick={() => setShowDownloadsModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#5A524D]">
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DDD2] flex items-center justify-between">
                <span>7th Pay Matrix Scale Gazette (UGC)</span>
                <span className="font-mono text-[10px] text-[#E43D12] font-bold">PDF (1.2 MB)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DDD2] flex items-center justify-between">
                <span>APAR & API Guidelines Manual (2026)</span>
                <span className="font-mono text-[10px] text-[#E43D12] font-bold">PDF (840 KB)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2DDD2] flex items-center justify-between">
                <span>University Leave Rules & Holidays</span>
                <span className="font-mono text-[10px] text-[#E43D12] font-bold">PDF (420 KB)</span>
              </div>
            </div>
            <button
              onClick={() => setShowDownloadsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#E43D12] text-white text-xs font-black shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
