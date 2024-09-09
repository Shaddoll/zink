'use client'

import { useEffect } from 'react'
import { init } from '@waline/client'
import '@waline/client/waline.css'
import 'css/waline.css'

interface WalineCommentsProps {
  path: string
  serverURL: string
}

export default function WalineComments({ path, serverURL }: WalineCommentsProps) {
  useEffect(() => {
    const walineInstance = init({
      el: '#waline',
      serverURL: serverURL,
      path: path, // Unique path for each blog post
      comment: true,
      emoji: [
        'https://unpkg.com/@waline/emojis@1.2.0/tw-emoji',
        'https://unpkg.com/@waline/emojis@1.2.0/bmoji',
        'https://unpkg.com/@waline/emojis@1.2.0/tieba',
      ],
      dark: 'html[style="color-scheme: dark;"]',
    })
    return () => walineInstance?.destroy()
  }, [path, serverURL])

  return <div id="waline" />
}
