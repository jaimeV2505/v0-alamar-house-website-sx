#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] SEED: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

async function seedAdmin() {
  try {
    console.log('[v0] SEED: Starting admin user seeding...')
    
    const email = 'admin@alamarhouse.com'
    const password = '123456'
    const name = 'Admin'
    
    console.log('[v0] SEED: Creating password hash for admin...')
    const passwordHash = await bcrypt.hash(password, 10)
    console.log('[v0] SEED: Password hash created')
    
    console.log('[v0] SEED: Checking if admin user already exists...')
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      console.log('[v0] SEED: Admin user already exists, updating password...')
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          is_active: true,
        })
        .eq('email', email)
      
      if (updateError) {
        console.error('[v0] SEED: Error updating admin user:', updateError.message)
        throw updateError
      }
      console.log('[v0] SEED: Admin user updated successfully')
    } else {
      console.log('[v0] SEED: Creating new admin user...')
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          password_hash: passwordHash,
          role: 'super_admin',
          is_active: true,
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('[v0] SEED: Error creating admin user:', insertError.message)
        throw insertError
      }
      console.log('[v0] SEED: Admin user created successfully:', newUser.id)
    }
    
    console.log('[v0] SEED: ✓ Admin user ready')
    console.log('[v0] SEED: Email:', email)
    console.log('[v0] SEED: Password:', password)
    console.log('[v0] SEED: Seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('[v0] SEED: Fatal error during seeding:', error)
    process.exit(1)
  }
}

seedAdmin()
