import { ReactNode } from 'react'
import { formatDate } from '@/utils/formatDate'
import type { Post } from '@/data/blog'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import Tag from '@/components/Tag'
import WalineComments from '@/components/WalineComments'
import WalineViewCount from '@/components/WalineViewCount'
import ShareDropdown from '@/components/ShareDropdown'

interface LayoutProps {
  content: Post
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  locale: string
}

export default async function PostLayout({ content, next, prev, children, locale }: LayoutProps) {
  const { slug, date, title, tags } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date, locale)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              {tags && (
                <div className="flex items-center justify-center py-4 xl:py-4">
                  <h2 className="mr-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Tags:
                  </h2>
                  <div className="flex flex-wrap justify-center">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} locale={locale} />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <WalineViewCount
                  path={slug}
                  serverURL={siteMetadata.walineServerUrl}
                  locale={locale}
                />
                <ShareDropdown title={title} locale={locale} />
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            </div>
            <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <WalineComments
                path={slug}
                serverURL={siteMetadata.walineServerUrl}
                locale={locale}
              />
            </div>
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && prev.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${next.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
