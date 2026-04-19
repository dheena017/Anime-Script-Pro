import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qninekqjjuyvkcyssloo.supabase.co';
const supabaseAnonKey = 'sb_publishable_2FUbNawEhWQGjfSjEfHsHg_STrtvMVG'; // Replace with your actual anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
