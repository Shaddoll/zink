import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { redirect } from 'next/navigation'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page({ params: { lang } }) {
  const author = allAuthors.find((p) => p.name === 'Z' && p.locale === lang) as Authors
  if (!author) {
    redirect('/en-US/about')
  }
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
