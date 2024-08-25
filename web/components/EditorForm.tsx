'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import type { ContextStore } from '@uiw/react-md-editor'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })
type OnChange = (
  value?: string,
  event?: React.ChangeEvent<HTMLTextAreaElement>,
  state?: ContextStore
) => void

export type FormState = {
  success: boolean
  error?: string
}

interface EditorFormProps {
  formAction: (prevState: FormState, data: FormData) => Promise<FormState>
  slug?: string
  title: string
  summary: string
  content: string
  tags: string[]
}

export default function EditorForm({
  formAction,
  title,
  tags,
  summary,
  content,
  slug,
}: EditorFormProps) {
  const [state, action] = useFormState(formAction, { success: false })
  const router = useRouter()
  const [value, setValue] = useState(content)

  const onChange = useCallback<OnChange>((val) => {
    setValue(val || '')
  }, [])

  const createPostAction = (formData: FormData) => {
    formData.set('content', value)
    slug && formData.set('slug', slug)
    return action(formData)
  }

  useEffect(() => {
    if (state.success) {
      router.push('/') // Redirect to the homepage if state.success is true
    }
  }, [state.success, router])

  return (
    <div className="container mx-auto p-4">
      <form action={createPostAction} className="mb-6">
        {state?.error && <div className="mb-4 text-red-600">{state.error}</div>}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            name="title"
            type="text"
            defaultValue={title}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="tags">
            Tags
          </label>
          <input
            name="tags"
            type="text"
            defaultValue={tags.join(',')}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="summary">
            Summary
          </label>
          <textarea
            name="summary"
            defaultValue={summary}
            className="focus:shadow-outline h-16 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            required
          />
        </div>
        <MDEditor
          value={value}
          onChange={onChange}
          minHeight={1000}
          style={{ minHeight: '100vh', height: '100%' }}
          textareaProps={{
            style: { minHeight: '100vh', height: '100%' },
          }}
        />
        <button
          type="submit"
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
