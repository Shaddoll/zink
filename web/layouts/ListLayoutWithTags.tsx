/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import type { Post } from '@/data/blog'
import { useTranslation } from 'app/i18n/client'

interface PaginationProps {
  totalPages: number
  currentPage: number
  pathname: string
  searchParams: URLSearchParams
}
interface ListLayoutProps {
  posts: Post[]
  title: string
  postsPerPage: number
  tagCounts: Record<string, number>
  locale: string
}

function Pagination({ totalPages, currentPage, pathname, searchParams }: PaginationProps) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  const createUrl = (pathname: string, page: number) => {
    const params = new URLSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: String(page),
    })
    if (params.get('page') === '1') {
      params.delete('page')
    }
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link href={createUrl(pathname, currentPage - 1)} rel="prev">
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={createUrl(pathname, currentPage + 1)} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  postsPerPage,
  tagCounts,
  locale,
}: ListLayoutProps) {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const pathname = usePathname()
  const displayPosts = posts.slice(postsPerPage * (currentPage - 1), postsPerPage * currentPage)
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const { t } = useTranslation(locale, 'list')

  // tags related
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="bg[#ffebcd] hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
            <div className="px-6 py-4">
              {pathname.includes('/blog') ? (
                <h3 className="font-bold uppercase text-primary-500">{t('all')}</h3>
              ) : (
                <Link
                  href={`/${locale}/blog`}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                >
                  {t('all')}
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {pathname.split('/tags/')[1] === slug(t) ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/${locale}/tags/${slug(t)}`}
                          className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="w-full">
            <ul>
              {displayPosts.map((post) => {
                const { slug, date, title, summary, tags } = post
                return (
                  <li key={slug} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pathname={pathname}
                searchParams={searchParams}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
