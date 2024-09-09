'use client'

import { useEffect } from 'react'
import { init } from '@waline/client'
import '@waline/client/waline.css'
import 'css/waline.css'
import siteMetadata from '@/data/siteMetadata'

interface WalineCommentsProps {
  path: string
}

export default function WalineComments({ path }: WalineCommentsProps) {
  useEffect(() => {
    const walineInstance = init({
      el: '#waline',
      serverURL: siteMetadata.walineServerUrl,
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
  }, [path])

  return <div id="waline" />
}
