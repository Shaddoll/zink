import createPost from './actions'
import EditorForm from '@/components/EditorForm'
import { languages } from 'app/i18n/settings'
import { notFound } from 'next/navigation'

export default function EditorPage({ params: { lang } }) {
  if (!languages.includes(lang)) {
    return notFound()
  }
  return (
    <EditorForm
      formAction={createPost}
      title=""
      tags={[]}
      summary=""
      content="**Hello world!!!**"
    />
  )
}
