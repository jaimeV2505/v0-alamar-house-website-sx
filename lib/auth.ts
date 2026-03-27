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
  console.log('[v0] Hashing password...')
  return bcrypt.hash(password, 10)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  console.log('[v0] Verifying password...')
  return bcrypt.compare(password, hash)
}

export interface AuthUser {
  id: string
  email: string
  role: 'super_admin' | 'viewer'
  name?: string
}

export const getAdminUser = async (email: string, password: string): Promise<AuthUser | null> => {
  console.log('[v0] AUTH: Looking up user by email:', email)
  
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, role, name, password_hash')
    .eq('email', email)
    .single()

  console.log('[v0] AUTH: User lookup result:', { error: error?.message, user: user ? 'found' : 'not found' })
  
  if (error || !user) {
    console.log('[v0] AUTH: User not found in database')
    return null
  }

  console.log('[v0] AUTH: User found:', { id: user.id, email: user.email, role: user.role })
  console.log('[v0] AUTH: Comparing password hash...')
  
  const isValid = await verifyPassword(password, user.password_hash)
  
  console.log('[v0] AUTH: Password match result:', isValid)
  
  if (!isValid) {
    console.log('[v0] AUTH: Password verification failed')
    return null
  }

  console.log('[v0] AUTH: Authentication successful')
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

  console.log('[v0] SESSION: Creating session for user:', userId)

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.log('[v0] SESSION: Error creating session:', error.message)
    throw error
  }
  
  console.log('[v0] SESSION: Session created successfully')
  return { token, expiresAt }
}

export const validateSession = async (token: string): Promise<AuthUser | null> => {
  console.log('[v0] SESSION: Validating session token')
  
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single()

  if (sessionError || !session) {
    console.log('[v0] SESSION: Session not found or error:', sessionError?.message)
    return null
  }

  if (new Date(session.expires_at) < new Date()) {
    console.log('[v0] SESSION: Session expired, invalidating')
    await supabase.from('sessions').delete().eq('token', token)
    return null
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, role, name')
    .eq('id', session.user_id)
    .single()

  if (userError || !user) {
    console.log('[v0] SESSION: User not found for session')
    return null
  }

  console.log('[v0] SESSION: Session validated successfully')
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }
}

export const invalidateSession = async (token: string) => {
  console.log('[v0] SESSION: Invalidating session')
  await supabase.from('sessions').delete().eq('token', token)
}
