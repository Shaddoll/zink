import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { languages } from './i18n/settings'

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/login', '/editor', '/visitor']
  for (const lang of languages) {
    disallow.push(`/${lang}/login`, `/${lang}/editor`, `/${lang}/visitor`)
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: disallow,
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
