import { Metadata } from 'next'
import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/[lang]/seo'
import { redirect } from 'next/navigation'
import { createTranslation } from 'app/i18n/server'

export async function generateMetadata({ params: { lang } }): Promise<Metadata | undefined> {
  const { t } = await createTranslation(lang, 'about')

  return genPageMetadata({
    title: `${t('about')} Z`,
    params: { lang },
  })
}

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
