import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ynychsxivuperghypqpz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueWNoc3hpdnVwZXJnaHlwcXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0Nzk4NDksImV4cCI6MjAyMDA1NTg0OX0.tEQmoz7kM5J0P6USutj1e3gp4hLvpNyAjOzwxNy_R8k'
const supabase = createClient(supabaseUrl, supabaseKey)

export const bucket = 'dnd-system'

export default supabase