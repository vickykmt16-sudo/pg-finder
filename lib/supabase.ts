import { createClient } from '@supabase/supabase-js'

// 🔥 PERMANENT ILAJ: Agar .env file fail hui, toh ye direct backup keys use kar lega.
// Note: Supabase URL aur ANON key frontend ke liye safe hoti hain.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uaflnijnftewzdfhbild.supabase.co";

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZmxuaWpuZnRld3pkZmhiaWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1Mzg1NzUsImV4cCI6MjA5NjExNDUzNX0.OLAWlVBlNS-dj-SFJRJhf_Dv_QXd-iJhjjdbRxH5ck4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);