import Main from './Main'
import fetchPosts from '@/data/blogs'
import { languages } from 'app/i18n/settings'
import { notFound } from 'next/navigation'

export default async function Page({ params: { lang } }) {
  if (!languages.includes(lang)) {
    return notFound()
  }
  const posts = await fetchPosts()
  return <Main posts={posts} locale={lang} />
}
