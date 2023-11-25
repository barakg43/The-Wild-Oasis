import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://vhcmwngsztplmeuuiivv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY213bmdzenRwbG1ldXVpaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAxMzY5MDUsImV4cCI6MjAxNTcxMjkwNX0.ea9u1LaVftCRAWNvCEwMITGOOXTM0co--zlIacGbpM8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
