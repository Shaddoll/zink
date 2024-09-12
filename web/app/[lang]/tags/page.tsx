import { Metadata } from 'next'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { genPageMetadata } from 'app/[lang]/seo'
import fetchTagCounts from '@/data/tags'
import { createTranslation } from 'app/i18n/server'
import { languages } from 'app/i18n/settings'
import { notFound } from 'next/navigation'

type TagsProps = {
  params: { lang: string }
}

export async function generateMetadata({ params: { lang } }: TagsProps): Promise<Metadata> {
  const { t } = await createTranslation(lang, 'tags')
  return genPageMetadata({
    title: t('tags'),
    description: t('tags'),
    params: { lang },
  })
}

export default async function Page({ params: { lang } }: TagsProps) {
  if (!languages.includes(lang)) {
    return notFound()
  }
  const { t } = await createTranslation(lang, 'tags')
  const tagCounts = await fetchTagCounts()
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            {t('tags')}
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && t('notags')}
          {sortedTags.map((tag) => {
            return (
              <div key={tag} className="mb-2 mr-5 mt-2">
                <Tag text={tag} locale={lang} />
                <Link
                  href={`/${lang}/tags/${tag}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                  aria-label={`${t('view')} ${tag}`}
                >
                  {` (${tagCounts[tag]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
