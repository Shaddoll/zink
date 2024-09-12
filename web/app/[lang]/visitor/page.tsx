import dynamicImport from 'next/dynamic'
import fetchVisitor from '@/data/visitor'
import { languages } from 'app/i18n/settings'
import { notFound } from 'next/navigation'

const VisitorMap = dynamicImport(() => import('@/components/VisitorMap'), { ssr: false })

export const dynamic = 'force-dynamic'

export default async function Page({ params: { lang } }) {
  if (!languages.includes(lang)) {
    return notFound()
  }
  const currentDate = new Date()
  const startDate = new Date('2024-08-31')
  const { data, visits } = await fetchVisitor(startDate, currentDate)
  return (
    <VisitorMap
      data={data}
      visits={visits}
      startDate={startDate}
      currentDate={currentDate}
      locale={lang}
    />
  )
}
