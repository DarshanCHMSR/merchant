import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://asksnagegfadzbgyneyg.supabase.co"; // Replace with your URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza3NuYWdlZ2ZhZHpiZ3luZXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDU1OTMsImV4cCI6MjA1NzEyMTU5M30.2bINhbgBnPudJkWmRamozP28d4PNeltQjRrVsbKbK1o"; // Replace with your Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
