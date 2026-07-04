import { createClient } from '@supabase/supabase-js';

const supabaseUrl = getRequiredEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getRequiredEnv('VITE_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getRequiredEnv(key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY') {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  if (key === 'VITE_SUPABASE_URL' && value.includes('/rest/v1')) {
    throw new Error(
      'VITE_SUPABASE_URL must be the project URL only, for example https://your-project.supabase.co'
    );
  }

  return value;
}
