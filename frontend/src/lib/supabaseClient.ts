import { createClient } from '@supabase/supabase-js';

const viteEnv = (import.meta as any)?.env ?? {};
const supabaseUrl = viteEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = viteEnv.VITE_SUPABASE_ANON_KEY || '';

const noopSupabase = {
	auth: {
		signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
		signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
		signOut: async () => ({ error: null }),
		getSession: async () => ({ data: { session: null }, error: null }),
		getUser: async () => ({ data: { user: null }, error: null }),
		onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
	},
} as const;

export const supabase = supabaseUrl && supabaseAnonKey
	? createClient(supabaseUrl, supabaseAnonKey)
	: (noopSupabase as any);



