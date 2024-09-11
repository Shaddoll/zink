'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'app/i18n/client'

interface WalineCommentsProps {
  path: string
  serverURL: string
  locale: string
}

async function incViewCount(slug: string, serverURL: string): Promise<number> {
  try {
    const response = await fetch(`${serverURL}/api/article`, {
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

export default function WalineViewCount({ path, serverURL, locale }: WalineCommentsProps) {
  const [viewCount, setViewCount] = useState(0)
  const { t } = useTranslation(locale, 'blog')

  useEffect(() => {
    incViewCount(path, serverURL).then(setViewCount)
  }, [path, serverURL])

  return (
    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      <span>
        {viewCount} {t('views')}
      </span>
    </div>
  )
}
