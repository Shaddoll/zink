import siteMetadata from '@/data/siteMetadata'
import fetchPost from '@/data/blogs'
import type { Post } from '@/data/blog'
import fs from 'fs'
import path from 'path'

interface Cache {
  rssContent: string | null
  timestamp: Date | null
}
// Memory cache object
let memoryCache: Cache = {
  rssContent: null,
  timestamp: null,
}
const CACHE_TTL = 3600 * 1000 * 24 * 7 // Cache TTL of 7 days
const CACHE_PATH = path.join(process.env.CACHE_PATH || '/tmp', 'feed.xml')

function isCacheValid(cacheTimestamp: Date | null) {
  const now = new Date()
  return cacheTimestamp && now.getTime() - cacheTimestamp.getTime() < CACHE_TTL
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (char) {
    switch (char) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case '"':
        return '&quot;'
      case "'":
        return '&apos;'
      default:
        return char
    }
  })
}

const generateRssItem = (config, post: Post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escapeXml(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
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
      ${posts.length > 0 && `<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>`}
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post: Post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

export async function GET() {
  // 1. Check Memory Cache
  if (memoryCache.rssContent && isCacheValid(memoryCache.timestamp)) {
    console.log('Serving from memory cache')
    return new Response(memoryCache.rssContent, {
      headers: { 'Content-Type': 'application/xml' },
    })
  }

  // 2. Check Disk Cache
  if (fs.existsSync(CACHE_PATH)) {
    const stats = fs.statSync(CACHE_PATH)
    if (isCacheValid(stats.mtime)) {
      console.log('Serving from disk cache')
      const cachedContent = fs.readFileSync(CACHE_PATH, 'utf-8')

      // Update memory cache from disk
      memoryCache = {
        rssContent: cachedContent,
        timestamp: new Date(stats.mtime),
      }

      return new Response(cachedContent, {
        headers: { 'Content-Type': 'application/xml' },
      })
    }
  }

  const posts = await fetchPost()
  const rss = generateRss(siteMetadata, posts, 'feed.xml')
  // Cache the result in memory
  memoryCache = {
    rssContent: rss,
    timestamp: new Date(),
  }

  // Cache the result on disk
  fs.writeFileSync(CACHE_PATH, rss, 'utf-8')

  return new Response(rss, { headers: { 'Content-Type': 'application/xml' } })
}
