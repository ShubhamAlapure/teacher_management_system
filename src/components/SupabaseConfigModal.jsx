import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, X, Copy, Check, Code } from 'lucide-react';
import { getSupabaseStatus } from '../lib/supabaseClient';

export const SupabaseConfigModal = () => {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen, pushNotification } = useApp();
  const dbStatus = getSupabaseStatus();

  const [urlInput, setUrlInput] = useState(() => localStorage.getItem('shikshak_supabase_url') || '');
  const [keyInput, setKeyInput] = useState(() => localStorage.getItem('shikshak_supabase_key') || '');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isSupabaseModalOpen) return null;

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('shikshak_supabase_url', urlInput);
    localStorage.setItem('shikshak_supabase_key', keyInput);
    pushNotification('Supabase Settings Saved', 'Reloading page to establish live Supabase connection...', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleCopySql = () => {
    const sqlText = `-- SHIKSHAK SETU SUPABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emp_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  cadre VARCHAR(50) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  current_school VARCHAR(150) NOT NULL,
  district VARCHAR(100) NOT NULL,
  basic_pay NUMERIC(10,2) DEFAULT 44900.00
);`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-white border border-purple-100 rounded-3xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-base font-extrabold text-purple-950">Supabase Database Integration</h3>
              <p className="text-xs text-slate-500">Current Mode: <strong className="text-purple-700">{dbStatus.mode}</strong></p>
            </div>
          </div>
          <button 
            onClick={() => setIsSupabaseModalOpen(false)} 
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your live Supabase credentials below to synchronize with your PostgreSQL database, or use the built-in local engine.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700">VITE_SUPABASE_URL</label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">VITE_SUPABASE_ANON_KEY</label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-purple-200 text-xs font-mono text-slate-900"
            />
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs font-extrabold text-purple-950">PostgreSQL schema.sql</p>
                <p className="text-[10px] text-slate-500">Run in your Supabase SQL Editor</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-xs font-bold text-purple-900 flex items-center gap-1.5 shadow-sm"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-600" />}
              {copiedSql ? 'Copied SQL' : 'Copy Schema'}
            </button>
          </div>

          <div className="pt-3 border-t border-purple-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSupabaseModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold shadow-md shadow-purple-600/20"
            >
              Save Credentials & Connect
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
