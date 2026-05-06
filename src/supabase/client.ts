import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;


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
export const supabase = supabaseCreateClient(
  (url as string) || "",
  (key as string) || ""
);

/**
 * @deprecated Import `supabase` directly instead of calling createClient().
 * This function is kept for backward compatibility and always returns the
 * same singleton — it is safe to call but the pattern is discouraged.
 */
export const createClient = () => supabase;


