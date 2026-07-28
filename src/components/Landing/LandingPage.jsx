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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* 1. Header Navigation Bar (Exact match to screenshot pblmitadtu.in) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MitAdtLogo variant="light" />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
          <a href="#home" className="text-purple-700 font-extrabold hover:text-purple-800 transition-colors">Home</a>
          <a href="#about" className="hover:text-purple-700 transition-colors">About TLMS</a>
          <a href="#downloads" className="hover:text-purple-700 transition-colors">Downloads</a>
          <div className="flex items-center gap-1 cursor-pointer hover:text-purple-700 transition-colors">
            <span>More</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </nav>

        {/* Right Action Pill Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('teacher')}
            className="px-5 py-2 rounded-full border-2 border-purple-600 text-purple-700 text-xs font-extrabold hover:bg-purple-50 transition-all"
          >
            Faculty Login
          </button>
          
          <button
            onClick={() => onOpenAuth('admin')}
            className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-yellow-300" />
            <span>Master Admin Login</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section (Vivid Purple Banner matching screenshot pblmitadtu.in) */}
      <section className="bg-gradient-to-r from-[#6b21a8] via-[#7e22ce] to-[#9333ea] text-white py-16 px-6 lg:px-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-widest text-purple-100">
              MIT-ADT UNIVERSITY FACULTY SYSTEM
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Where Every Educator Inspires a <span className="text-yellow-300">Legacy Worth Building</span>
            </h1>

            <p className="text-sm sm:text-base text-purple-100 leading-relaxed max-w-2xl">
              A cloud-enabled platform that digitizes the complete faculty lifecycle — from recruitment and posting to e-Service Book, 7th Pay payroll, APAR research appraisals, and superannuation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onOpenAuth('teacher')}
                className="px-7 py-3.5 rounded-full bg-white text-purple-950 font-extrabold text-xs uppercase tracking-wider hover:bg-purple-50 transition-all shadow-lg shadow-purple-950/20"
              >
                Get Started
              </button>

              <a
                href="#features"
                className="px-7 py-3.5 rounded-full border-2 border-white/80 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-white/10 transition-all inline-flex items-center gap-2"
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
                <rect x="200" y="240" x2="300" y2="285" width="120" height="40" rx="6" fill="white" stroke="#6b21a8" />
                <circle cx="260" cy="260" r="5" fill="#6b21a8" />
                <path d="M190 285 L330 285" stroke="white" strokeWidth="4" />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Connected Stepper Bar (Matching bottom connected icons in screenshot) */}
      <section className="bg-purple-900 py-6 border-b border-purple-800 text-white">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between relative">
          {/* Horizontal Line */}
          <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-1 bg-purple-700 -z-0" />

          {/* Stepper Node 1 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-purple-900 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-5 h-5 text-yellow-300" />
            </div>
            <span className="text-[11px] font-extrabold">1. Recruitment</span>
          </div>

          {/* Stepper Node 2 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-purple-900 flex items-center justify-center shadow-lg">
              <Compass className="w-5 h-5 text-purple-200" />
            </div>
            <span className="text-[11px] font-extrabold">2. e-Service Book</span>
          </div>

          {/* Stepper Node 3 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-purple-900 flex items-center justify-center shadow-lg">
              <Wrench className="w-5 h-5 text-purple-200" />
            </div>
            <span className="text-[11px] font-extrabold">3. Transfers & APAR</span>
          </div>

          {/* Stepper Node 4 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-purple-900 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[11px] font-extrabold">4. 7th Pay Payroll</span>
          </div>
        </div>
      </section>

      {/* 4. Master Admin Spotlight Section (For Shubham Sharadrao Alapure) */}
      <section className="py-16 px-6 lg:px-12 bg-white" id="about">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
              EXCLUSIVE GOVERNANCE
            </span>
            <h2 className="text-3xl font-black text-purple-950">Master Admin Control Center</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized personnel access assigned to University Master Administrator — System Admin Office.
            </p>
          </div>

          {/* Master Admin Profile Card */}
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 text-white shadow-xl border border-purple-700/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-purple-950 flex items-center justify-center font-black text-xl shadow-lg border-2 border-white">
                AD
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                  MASTER ADMINISTRATOR
                </span>
                <h3 className="text-xl font-extrabold">MIT-ADT System Administrator</h3>
                <p className="text-xs text-purple-200">University Vice-Chancellor Office & Registrar Secretariat</p>
                <p className="text-[11px] text-purple-300 font-mono">Master ID: MIT-MASTER-ADMIN-01</p>
              </div>
            </div>

            <button
              onClick={() => {
                login('admin', 'MIT-MASTER-ADMIN-01');
              }}
              className="px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login as Master Admin</span>
            </button>
          </div>

        </div>
      </section>

      {/* 5. Footer */}
      <footer className="mt-auto bg-[#1e0b38] text-purple-200 text-xs py-8 px-6 border-t border-purple-900/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <MitAdtLogo />
            <p className="text-[11px] text-purple-300 mt-2">
              &copy; 2026 MIT-ADT University Pune, India &bull; All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-purple-300 font-bold">
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            <a href="#terms" className="hover:text-white">Terms of Governance</a>
            <a href="#support" className="hover:text-white">IT Support Cell</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
