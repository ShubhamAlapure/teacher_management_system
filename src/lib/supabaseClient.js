import { createClient } from '@supabase/supabase-js';

// Fallback Live Supabase Credentials for Vercel & Production
const DEFAULT_URL = 'https://oehmekbmoszcmroxsfbr.supabase.co';
const DEFAULT_KEY = 'sb_publishable__4jy5jZjj3HIw2koMgs4oQ_lPKdiaJj';

const envUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('shikshak_supabase_url') || envUrl : envUrl;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('shikshak_supabase_key') || envKey : envKey;

export const isSupabaseConfigured = Boolean(localUrl && localKey && localUrl.includes('supabase'));

export const supabase = isSupabaseConfigured 
  ? createClient(localUrl, localKey)
  : null;

export const getSupabaseStatus = () => {
  return {
    configured: isSupabaseConfigured,
    url: localUrl ? `${localUrl.substring(0, 30)}...` : 'Not Configured',
    mode: isSupabaseConfigured ? 'Live Supabase Connection' : 'Mock Local Engine'
  };
};
