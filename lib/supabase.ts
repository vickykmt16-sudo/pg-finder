import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uaflnijnftewzdfhbild.supabase.co';

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZmxuaWpuZnRld3pkZmhiaWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1Mzg1NzUsImV4cCI6MjA5NjExNDU3NX0.OLAWTVBlNS-dj-SfJRJhf_Dv_QXd-iJhjjdbRxH5ck4';

export const supabase = createClient(supabaseUrl, supabaseKey);