import { NewsletterAPI } from 'pliny/newsletter'
import type { NewsletterResponse } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'
import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '../captcha/route'
import { cookies } from 'next/headers'

const handler = NewsletterAPI({
  // @ts-ignore
  provider: siteMetadata.newsletter.provider,
})

export async function POST(req: NextRequest, res: NewsletterResponse) {
  const { captcha } = await req.clone().json()
  const session = await getIronSession<SessionData>(cookies(), {
    password: process.env.SECRET_COOKIE_PASSWORD || '',
    cookieName: 'captcha',
  })
  if (captcha !== session.captcha) {
    return NextResponse.json({ error: 'Invalid captcha' }, { status: 400 })
  }
  return handler(req, res)
}
