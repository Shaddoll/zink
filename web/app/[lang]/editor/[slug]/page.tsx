import updatePost from './actions'
import EditorForm from '@/components/EditorForm'
import fetchPost from '@/data/blog'
import { notFound } from 'next/navigation'

export default async function EditorPage({ params }: { params: { slug: string } }) {
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
