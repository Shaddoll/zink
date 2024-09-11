import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/[lang]/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fetchPostsByTag from '@/data/tag'
import fetchTagCounts from '@/data/tags'

export async function generateMetadata({
  params,
}: {
  params: { tag: string; lang: string }
}): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    params: { lang: params.lang },
  })
}

export default async function TagPage({ params }: { params: { tag: string; lang: string } }) {
  const tag = decodeURI(params.tag)
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const posts = await fetchPostsByTag(tag)
  if (posts.length === 0) {
    return notFound()
  }
  const tagCounts = await fetchTagCounts()
  return (
    <ListLayout
      posts={posts}
      title={title}
      postsPerPage={1}
      tagCounts={tagCounts}
      locale={params.lang}
    />
  )
}