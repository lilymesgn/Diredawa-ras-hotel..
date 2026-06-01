import { createClient } from "@supabase/supabase-js";

// @ts-ignore
const rawUrl = import.meta.env?.VITE_SUPABASE_URL;
// @ts-ignore
const rawKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = true;

const supabaseUrl = rawUrl || "https://znqmgaocvcvbcqhexnrk.supabase.co";
const supabaseAnonKey = rawKey || "sb_publishable_pJRW5XmX2xd2VJfYVmI3xg_YCFhY4wm";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
