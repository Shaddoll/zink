import createPost from './actions'
import EditorForm from '@/components/EditorForm'

export default function EditorPage() {
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
