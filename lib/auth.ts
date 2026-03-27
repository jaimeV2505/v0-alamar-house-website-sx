import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
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

  if (!verifyPassword(password, user.password_hash)) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }
}

export const createAdminSession = async (userId: string, expiresIn: number = 24 * 60 * 60 * 1000) => {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + expiresIn)

  const { data, error } = await supabase
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
