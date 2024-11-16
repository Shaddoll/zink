import 'css/prism.css'
import 'katex/dist/katex.css'

import fetchPost from '@/data/blog'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { components } from '@/components/MDXComponents'
import PostSimple from '@/layouts/PostSimple'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { languages } from 'app/i18n/settings'
import remarkGfm from 'remark-gfm'

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lang: string }
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
      locale: params.lang.replace('-', '_'),
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

export default async function Page({ params }: { params: { slug: string; lang: string } }) {
  if (!languages.includes(params.lang)) {
    return notFound()
  }
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
    url: `${siteMetadata.siteUrl}/blog/${params.lang}/${slug}`,
    author: {
      '@type': 'Person',
      name: siteMetadata.author,
    },
  }
  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostSimple content={myPost} locale={params.lang}>
        <MDXRemote source={myPost.content} options={options} components={components} />
      </PostSimple>
    </>
  )
}
