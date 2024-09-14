import siteMetadata from '@/data/siteMetadata'
import fetchPost from '@/data/blogs'
import type { Post } from '@/data/blog'
import path from 'path'
import { Cache } from '@/utils/cache'

const cache: Cache = new Cache({
  memoryTTL: 1000 * 60 * 60 * 24, // 24 hours
  diskTTL: 1000 * 60 * 60 * 24 * 7, // 7 days
  cacheFilePath: path.join(process.env.CACHE_PATH || '/tmp', 'sitemap.xml'),
})

const buildTime = process.env.BUILD_TIME || new Date().toISOString()

const generateSitemapItem = (config, post: Post) => `
  <url>
    <loc>${config.siteUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.lastmod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
  </url>
`
const generateSitemap = (config, posts: Post[]) => `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
      <loc>https://zink.top/</loc>
      <lastmod>${buildTime}</lastmod>
    </url>
    <url>
      <loc>https://zink.top/blog</loc>
      <lastmod>${buildTime}</lastmod>
    </url>
    <url>
      <loc>https://zink.top/tags</loc>
      <lastmod>${buildTime}</lastmod>
    </url>
    <url>
      <loc>https://zink.top/about</loc>
      <lastmod>${buildTime}</lastmod>
    </url>
    ${posts.map((post: Post) => generateSitemapItem(config, post)).join('')}
  </urlset>
`

export async function GET() {
  const sitemapContent = await cache.get()
  if (sitemapContent) {
    return new Response(sitemapContent, { headers: { 'Content-Type': 'application/xml' } })
  }

  const posts = await fetchPost()
  const sitemap = generateSitemap(siteMetadata, posts)

  try {
    await cache.set(sitemap)
  } catch (e) {
    console.error('Failed to cache RSS feed', e)
  }

  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } })
}
