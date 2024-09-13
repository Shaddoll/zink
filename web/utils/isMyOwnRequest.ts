'use server'

import { cookies } from "next/headers"

export const isMyOwnRequest = async () => {
  return cookies().get('cookie_identity')?.value === process.env.COOKIE_IDENTITY && (process.env.COOKIE_IDENTITY ? true : false)
}