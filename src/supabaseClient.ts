import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are missing. " +
    "Please make sure your .env file is configured correctly."
  );
}

// Create a safe client that won't crash on initialization if URL/Key are empty
const dummyClient = {
  from: () => ({
    select: async () => ({ data: null, error: new Error("Supabase is not configured. Using local fallback.") })
  })
} as any;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : dummyClient;
