import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rvrtvygojgqxgqeiybrz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_daTgi5LRc0MhUNjnDD-Zfg_t6Yvfd7X'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
