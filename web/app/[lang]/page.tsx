import Main from './Main'
import fetchPosts from '@/data/blogs'

export default async function Page({ params: { lang } }) {
  const posts = await fetchPosts()
  return <Main posts={posts} locale={lang} />
}
