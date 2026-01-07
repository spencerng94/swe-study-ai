import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Falling back to localStorage.')
}

// Create Supabase client (will be null if env vars are missing, allowing fallback to localStorage)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to get or create user ID
// For now, we'll use a simple device-based ID stored in localStorage
// In production, you'd want to implement proper authentication
export const getUserId = () => {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('userId', userId)
  }
  return userId
}
