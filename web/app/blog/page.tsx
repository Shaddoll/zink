import ListLayout from '@/layouts/ListLayoutWithTags'
import fetchPosts from '@/data/blogs'
import fetchTagCounts from '@/data/tags'
import { genPageMetadata } from 'app/seo'
import getLocale from '@/data/locale'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage() {
  const posts = await fetchPosts()
  const tagCounts = await fetchTagCounts()
  const locale = await getLocale()
  return (
    <ListLayout
      title="All Posts"
      posts={posts}
      postsPerPage={POSTS_PER_PAGE}
      tagCounts={tagCounts}
      locale={locale}
    />
  )
}
