import { MetadataRoute } from 'next'
import fetchPosts from '@/data/blogs'
import siteMetadata from '@/data/siteMetadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl
  const posts = await fetchPosts()

  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/${post.slug}`,
    lastModified: post.lastmod || post.date,
  }))

  const routes = ['', 'blog', 'tags', 'about'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
