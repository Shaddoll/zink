'use client'

import { useEffect } from 'react'
import { init } from '@waline/client'
import '@waline/client/waline.css'

interface WalineCommentsProps {
  path: string
}

export default function WalineComments({ path }: WalineCommentsProps) {
  useEffect(() => {
    const walineInstance = init({
      el: '#waline',
      serverURL: 'https://waline-comments-olive.vercel.app',
      path: path, // Unique path for each blog post
      comment: true,
    })
    return () => walineInstance?.destroy()
  }, [path])

  return <div id="waline" />
}
