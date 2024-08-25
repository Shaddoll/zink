'use server'

import { cookies } from 'next/headers'
import siteMetadata from '@/data/siteMetadata'

export type FormState = {
  success: boolean
  error?: string
}

export default async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const response = await fetch(`${siteMetadata.apiUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
    })
    if (response.ok) {
      const data = await response.json()
      cookies().set('token', data.token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })
      return { success: true }
    } else {
      return { success: false, error: 'Invalid username or password' }
    }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'An error occurred' }
  }
}
