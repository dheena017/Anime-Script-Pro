import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

const viteEnv = (import.meta as any)?.env ?? {};
const url = viteEnv.VITE_SUPABASE_URL;
const key = viteEnv.VITE_SUPABASE_ANON_KEY;

const noopSupabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase not configured') }),
    updateUser: async () => ({ data: null, error: new Error('Supabase not configured') }),
  },
} as const;


/**
 * Single shared Supabase client instance for the entire application.
 *
 * IMPORTANT: This module exports a singleton. Never call createClient()
 * inside a React component, hook, or service function — doing so creates
 * a new GoTrueClient on every render, causing "Multiple GoTrueClient
 * instances detected" warnings and navigator.locks contention.
 *
 * Usage:
 *   import { supabase } from '../supabase/client';
 *   const { data } = await supabase.auth.getSession();
 *
 * Legacy compat:
 *   import { createClient } from '../supabase/client';
 *   const supabase = createClient(); // still returns the singleton
 */
export const supabase = url && key
  ? supabaseCreateClient((url as string) || "", (key as string) || "")
  : (noopSupabase as any);

/**
 * @deprecated Import `supabase` directly instead of calling createClient().
 * This function is kept for backward compatibility and always returns the
 * same singleton — it is safe to call but the pattern is discouraged.
 */
export const createClient = () => supabase;


