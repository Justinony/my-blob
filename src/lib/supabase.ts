import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase credentials are properly configured
let supabaseClient = null

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://your-project.supabase.co' || 
    supabaseAnonKey === 'your-anon-key-here') {
  console.warn('Supabase credentials not configured. Using mock data mode.')
  supabaseClient = null
} else {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient
export default supabase