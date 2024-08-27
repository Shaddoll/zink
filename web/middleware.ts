import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import siteMetadata from './data/siteMetadata'

const defaultLocale = 'en-US'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const headers = {'accept-language': request.headers.get('accept-language')}
  const languages = new Negotiator({ headers }).languages()
  const locale = match(languages, siteMetadata.supportedLocales, defaultLocale)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/about']
}