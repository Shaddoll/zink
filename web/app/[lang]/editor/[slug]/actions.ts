'use server'

import { cookies } from 'next/headers'
import siteMetadata from '@/data/siteMetadata'

export type FormState = {
  success: boolean
  error?: string
}

export default async function updatePost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const tagsData: string | File = formData.get('tags') as string | File
    let tags: string[]
    if (typeof tagsData === 'string') {
      tags = tagsData.split(',').map((tag: string) => tag.trim())
    } else {
      tags = []
    }
    const response = await fetch(`${siteMetadata.apiUrl}/post/update/${formData.get('slug')}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies().get('token')?.value}`,
      },
      body: JSON.stringify({
        title: formData.get('title'),
        tags: tags,
        summary: formData.get('summary'),
        content: formData.get('content'),
      }),
    })
    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, error: `Failed to create post: ${await response.text()}` }
    }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'An error occurred' }
  }
}
