import { NextRequest, NextResponse } from 'next/server'
import { invalidateSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (token) {
      await invalidateSession(token)
    }

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    response.cookies.delete('admin_token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
