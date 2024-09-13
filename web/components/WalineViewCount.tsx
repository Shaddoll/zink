import { createTranslation } from 'app/i18n/server'
import { isMyOwnRequest } from '@/utils/isMyOwnRequest'

interface WalineCommentsProps {
  path: string
  serverURL: string
  locale: string
}

async function getViewCount(slug: string, serverURL: string): Promise<number> {
  try {
    const response = await fetch(`${serverURL}/api/article?path=${slug}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      console.error(
        'Failed to get view count',
        response.status,
        response.statusText,
        await response.json()
      )
      return 0
    }
    const data = await response.json()
    return data.data?.[0]?.time ?? 0
  } catch (error) {
    console.error('Failed to get view count', error)
    return 0
  }
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

export default async function WalineViewCount({ path, serverURL, locale }: WalineCommentsProps) {
  const { t } = await createTranslation(locale, 'blog')
  const isMyself = await isMyOwnRequest()
  let viewCount = 0
  if (isMyself) {
    viewCount = await getViewCount(path, serverURL)
  } else {
    viewCount = await incViewCount(path, serverURL)
  }

  return (
    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      <span>
        {viewCount} {t('views')}
      </span>
    </div>
  )
}
