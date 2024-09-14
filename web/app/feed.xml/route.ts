import siteMetadata from '@/data/siteMetadata'
import fetchPost from '@/data/blogs'
import type { Post } from '@/data/blog'
import path from 'path'
import { Cache } from '@/utils/cache'
import { escapeXml } from '@/utils/escapeXml'

const cache: Cache = new Cache({
  memoryTTL: 1000 * 60 * 60 * 24, // 24 hours
  diskTTL: 1000 * 60 * 60 * 24 * 7, // 7 days
  cacheFilePath: path.join(process.env.CACHE_PATH || '/tmp', 'feed.xml'),
})

const generateRssItem = (config, post: Post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escapeXml(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toISOString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`
const generateRss = (config, posts: Post[], page: string) => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escapeXml(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      ${posts.length > 0 && `<lastBuildDate>${new Date(posts[0].date).toISOString()}</lastBuildDate>`}
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post: Post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

export async function GET() {
  const rssContent = await cache.get()
  if (rssContent) {
    return new Response(rssContent, { headers: { 'Content-Type': 'application/xml' } })
  }

  const posts = await fetchPost()
  const rss = generateRss(siteMetadata, posts, 'feed.xml')

  try {
    await cache.set(rss)
  } catch (e) {
    console.error('Failed to cache RSS feed', e)
  }

  return new Response(rss, { headers: { 'Content-Type': 'application/xml' } })
}
