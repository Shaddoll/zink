import updatePost from './actions'
import EditorForm from '@/components/EditorForm'
import fetchPost from '@/data/blog'
import { notFound } from 'next/navigation'
import { languages } from 'app/i18n/settings'

export default async function EditorPage({ params }: { params: { slug: string; lang: string } }) {
  if (!languages.includes(params.lang)) {
    return notFound()
  }
  const slug = decodeURI(params.slug)
  const myPost = await fetchPost(slug)
  if (!myPost) {
    return notFound()
  }
  return (
    <EditorForm
      formAction={updatePost}
      title={myPost.title}
      tags={myPost.tags}
      summary={myPost.summary}
      content={myPost.content}
      slug={slug}
    />
  )
}
