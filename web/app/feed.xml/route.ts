import siteMetadata from '@/data/siteMetadata'
import fetchPost from '@/data/blogs'
import type { Post } from '@/data/blog'

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
  const posts = await fetchPost()
  const rss = generateRss(siteMetadata, posts, 'feed.xml')
  return new Response(rss, { headers: { 'Content-Type': 'application/xml' } })
}