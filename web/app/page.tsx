import Main from './Main'
import fetchPosts from '@/data/blogs'
import getLocale from '@/data/locale'

export default async function Page() {
  const posts = await fetchPosts()
  const locale = await getLocale()
  return <Main posts={posts} locale={locale} />
}
