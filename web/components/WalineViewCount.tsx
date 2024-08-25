'use client'

import { useEffect, useState } from 'react'

interface WalineCommentsProps {
  path: string
}

async function incViewCount(slug: string): Promise<number> {
  try {
    const response = await fetch(`https://waline-comments-olive.vercel.app/api/article`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: slug, type: 'time', action: 'inc' }),
    })
    if (!response.ok) {
      console.error(
        'Failed to increment view count',
        response.status,
        response.statusText,
        await response.json()
      )
      return 0
    }
    const data = await response.json()
    return data.data?.[0]?.time ?? 0
  } catch (error) {
    console.error('Failed to increment view count', error)
    return 0
  }
}

export default function WalineViewCount({ path }: WalineCommentsProps) {
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    incViewCount(path).then(setViewCount)
  }, [path])

  return (
    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      <span>{viewCount} views</span>
    </div>
  )
}
