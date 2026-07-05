import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rvrtvygojgqxgqeiybrz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnR2eWdvamdxeGdxZWl5YnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzcwOTgsImV4cCI6MjA5ODgxMzA5OH0.b6Xx4ejs6t0P4NLJmqiIdTrbTQE_BrS2jxnl_1v_Bqg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
