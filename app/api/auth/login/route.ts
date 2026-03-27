import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, createAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('[v0] LOGIN: Received login attempt for email:', email)

    if (!email || !password) {
      console.log('[v0] LOGIN: Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await getAdminUser(email, password)
    if (!user) {
      console.log('[v0] LOGIN: Authentication failed for email:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('[v0] LOGIN: User authenticated, creating session:', user.id)
    const { token, expiresAt } = await createAdminSession(user.id)

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      },
      { status: 200 }
    )

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    console.log('[v0] LOGIN: Login successful for user:', user.email)
    return response
  } catch (error) {
    console.error('[v0] LOGIN ERROR:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
