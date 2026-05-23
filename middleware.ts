import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const publicPaths = ['/auth', '/onboarding']
  const isPublic = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))

  const token = req.cookies.get('sb-vbgsuemjunddfacpgpsz-auth-token')

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  if (token && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}