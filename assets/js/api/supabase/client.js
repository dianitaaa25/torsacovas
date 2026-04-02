const SUPABASE_URL = "https://gqhgmalvclhufiwmleei.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaGdtYWx2Y2xodWZpd21sZWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjg0MjUsImV4cCI6MjA4OTgwNDQyNX0._DJ6ffFKwgmnd77iQl14U84G3yzhnQULYIRPQ4-9kbQ";

export const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);