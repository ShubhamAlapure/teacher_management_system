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
  FileText, 
  GraduationCap, 
  Lightbulb, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Users,
  Wrench,
  Compass
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  const { login } = useApp();

  return (
    <div className="min-h-screen bg-[#EBE9E1] font-sans text-[#1A1412] flex flex-col">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E2DDD2] shadow-sm px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MitAdtLogo variant="light" />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#453D38]">
          <a href="#home" className="text-[#E43D12] font-black hover:text-[#C7310B] transition-colors">Home</a>
          <a href="#about" className="hover:text-[#E43D12] transition-colors">About TLMS</a>
          <a href="#downloads" className="hover:text-[#E43D12] transition-colors">Downloads</a>
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#E43D12] transition-colors">
            <span>More</span>
            <ChevronDown className="w-4 h-4" />
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

      {/* 2. Hero Section — MIT-ADT Campus photo background */}
      <section
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
                href="#features"
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

      {/* 3. Connected Stepper Bar */}
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

      {/* 4. Master Admin Spotlight Section */}
      <section className="py-16 px-6 lg:px-12 bg-[#EBE9E1]" id="about">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#FDF2EE] text-[#E43D12] border border-[#FFA2B6]">
              EXCLUSIVE GOVERNANCE
            </span>
            <h2 className="text-3xl font-black text-[#1A1412]">Master Admin Control Center</h2>
            <p className="text-xs text-[#5A524D] leading-relaxed">
              Authorized personnel access assigned to University Master Administrator — System Admin Office.
            </p>
          </div>

          {/* Master Admin Profile Card */}
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-[#1A110F] via-[#2A1612] to-[#3B1912] text-white shadow-2xl border border-[#E43D12]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#EFB11D] text-[#1A110F] flex items-center justify-center font-black text-xl shadow-lg border-2 border-white">
                AD
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#EFB11D]/20 text-[#EFB11D] border border-[#EFB11D]/40">
                  MASTER ADMINISTRATOR
                </span>
                <h3 className="text-xl font-black">MIT-ADT System Administrator</h3>
                <p className="text-xs text-[#F2ECE6]">University Vice-Chancellor Office & Registrar Secretariat</p>
                <p className="text-[11px] text-[#FFA2B6] font-mono">Official Email: admin@mituniversity.edu.in</p>
              </div>
            </div>

            <button
              onClick={() => {
                login('admin', 'admin@mituniversity.edu.in', 'admin@123');
              }}
              className="px-6 py-3 rounded-2xl bg-[#EFB11D] hover:bg-[#DFA30E] text-[#1A110F] font-black text-xs uppercase tracking-wider shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#1A110F]" />
              <span>Login as Master Admin</span>
            </button>
          </div>

        </div>
      </section>

      {/* 5. Footer */}
      <footer className="mt-auto bg-[#140D0B] text-[#D8D0C9] text-xs py-8 px-6 border-t border-[#291713]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <MitAdtLogo />
            <p className="text-[11px] text-[#A69C95] mt-2">
              &copy; 2026 MIT-ADT University Pune, India &bull; All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#C7BFB8] font-bold">
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            <a href="#terms" className="hover:text-white">Terms of Governance</a>
            <a href="#support" className="hover:text-white">IT Support Cell</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
