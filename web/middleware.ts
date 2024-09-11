import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { fallbackLng, languages } from './app/i18n/settings'

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname

    // Check if the default locale is in the pathname
    if (pathname.startsWith(`/${fallbackLng}/`) || pathname === `/${fallbackLng}`) {
      // e.g. incoming request is /en/about
      // The new URL is now /about
      return NextResponse.redirect(
        new URL(
          pathname.replace(`/${fallbackLng}`, pathname === `/${fallbackLng}` ? '/' : ''),
          request.url
        )
      )
    }
  
    const pathnameIsMissingLocale = languages.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )
  
    if (pathnameIsMissingLocale) {
      // We are on the default locale
      // Rewrite so Next.js understands
  
      // e.g. incoming request is /about
      // Tell Next.js it should pretend it's /en/about
      return NextResponse.rewrite(new URL(`/${fallbackLng}${pathname}`, request.url))
    }

    return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|static|track|data|css|scripts|.*\\..*|_next).*)',
}