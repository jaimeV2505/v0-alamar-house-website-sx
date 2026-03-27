import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from './lib/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow login page without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const user = await validateSession(token)
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-user-id', user.id)
    requestHeaders.set('x-admin-user-role', user.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
