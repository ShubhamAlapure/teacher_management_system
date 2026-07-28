import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or localStorage override
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('shikshak_supabase_url') || envUrl : envUrl;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('shikshak_supabase_key') || envKey : envKey;

export const isSupabaseConfigured = Boolean(localUrl && localKey && (localUrl.includes('supabase') || localUrl.length > 10));

export const supabase = isSupabaseConfigured 
  ? createClient(localUrl, localKey)
  : null;

export const getSupabaseStatus = () => {
  return {
    configured: isSupabaseConfigured,
    url: localUrl ? `${localUrl.substring(0, 25)}...` : 'Not Configured',
    mode: isSupabaseConfigured ? 'Live Supabase Connection' : 'Mock Local Engine'
  };
};
