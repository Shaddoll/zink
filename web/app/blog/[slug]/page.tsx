import 'css/prism.css'
import 'katex/dist/katex.css'

import fetchPost from '@/data/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from '@/components/MDXComponents'
import PostSimple from '@/layouts/PostSimple'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import getLocale from '@/data/locale'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug)
  const post = await fetchPost(slug)
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod).toISOString()

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'zh_Hans',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: [siteMetadata.socialBanner],
      authors: [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = decodeURI(params.slug)
  const myPost = await fetchPost(slug)
  if (!myPost) {
    return notFound()
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: myPost.title,
    datePublished: myPost.date,
    dateModified: myPost.lastmod,
    description: myPost.summary,
    image: '/static/images/twitter-card.png',
    url: `${siteMetadata.siteUrl}/blog/${slug}`,
    author: {
      '@type': 'Person',
      name: siteMetadata.author,
    },
  }
  const locale = await getLocale()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostSimple content={myPost} locale={locale}>
        <MDXRemote source={myPost.content} components={components} />
      </PostSimple>
    </>
  )
}
