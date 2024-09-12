import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import svgCaptcha from 'svg-captcha'
import { getIronSession } from 'iron-session'

export type SessionData = {
  captcha: string
}

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), {
    password: process.env.SECRET_COOKIE_PASSWORD || '',
    cookieName: 'captcha',
  })
  const captcha = svgCaptcha.create()
  session.captcha = captcha.text
  await session.save()
  return NextResponse.json({ svg: captcha.data }, { status: 200 })
}
