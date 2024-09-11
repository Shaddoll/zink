'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import login from './actions'

export default function Login() {
  const [state, loginAction] = useFormState(login, { success: false })
  const router = useRouter() // Initialize the router

  useEffect(() => {
    if (state.success) {
      router.push('/') // Redirect to the homepage if state.success is true
    }
  }, [state.success, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Login to Your Account</h2>
        </div>
        {state?.error && <div className="mb-4 text-red-600">{state.error}</div>}
        <form action={loginAction}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-500" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
