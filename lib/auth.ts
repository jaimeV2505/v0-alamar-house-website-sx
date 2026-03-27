import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export interface AuthUser {
  id: string
  email: string
  role: 'super_admin' | 'viewer'
  name?: string
}

export const getAdminUser = async (email: string, password: string): Promise<AuthUser | null> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, role, name, password_hash')
    .eq('email', email)
    .single()

  if (error || !user) return null

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }
}

export const createAdminSession = async (userId: string, expiresIn: number = 24 * 60 * 60 * 1000) => {
  const token = require('crypto').randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + expiresIn)

  const { error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  
  return { token, expiresAt }
}

export const validateSession = async (token: string): Promise<AuthUser | null> => {
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single()

  if (sessionError || !session) return null

  if (new Date(session.expires_at) < new Date()) {
    await supabase.from('sessions').delete().eq('token', token)
    return null
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, role, name')
    .eq('id', session.user_id)
    .single()

  if (userError || !user) return null

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }
}

export const invalidateSession = async (token: string) => {
  await supabase.from('sessions').delete().eq('token', token)
}
