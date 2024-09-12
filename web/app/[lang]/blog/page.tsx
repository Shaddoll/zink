import { Metadata } from 'next'
import ListLayout from '@/layouts/ListLayoutWithTags'
import fetchPosts from '@/data/blogs'
import fetchTagCounts from '@/data/tags'
import { genPageMetadata } from 'app/[lang]/seo'
import { createTranslation } from 'app/i18n/server'
import { languages } from 'app/i18n/settings'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

type BlogPageProps = {
  params: { lang: string }
}

export async function generateMetadata({ params: { lang } }: BlogPageProps): Promise<Metadata> {
  const { t } = await createTranslation(lang, 'blog')
  return genPageMetadata({
    title: t('blog'),
    params: { lang },
  })
}

export default async function BlogPage({ params: { lang } }) {
  if (!languages.includes(lang)) {
    return notFound()
  }
  const { t } = await createTranslation(lang, 'blog')
  const posts = await fetchPosts()
  const tagCounts = await fetchTagCounts()
  return (
    <ListLayout
      title={t('all')}
      posts={posts}
      postsPerPage={POSTS_PER_PAGE}
      tagCounts={tagCounts}
      locale={lang}
    />
  )
}
