'use client'

import React, { useRef, useState } from 'react'
import { useTranslation } from 'app/i18n/client'
import Captcha from './Captcha'

export interface NewsletterFormProps {
  title?: string
  apiUrl?: string
  locale: string
}

const NewsletterForm = ({
  title = 'Subscribe to the newsletter',
  apiUrl = '/api/newsletter',
  locale,
}: NewsletterFormProps) => {
  const { t } = useTranslation(locale, 'newsletter')

  const inputEl = useRef<HTMLInputElement>(null)
  const captchaInputEl = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch(apiUrl, {
      body: JSON.stringify({
        email: inputEl?.current?.value || '',
        captcha: captchaInputEl?.current?.value || '',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()
    if (error) {
      setError(true)
      if (res.status === 400) {
        setMessage(t('messageErrorCaptcha'))
      } else {
        setMessage(t('messageError'))
      }
      return
    }

    if (inputEl && inputEl.current) {
      inputEl.current.value = ''
    }
    if (captchaInputEl && captchaInputEl.current) {
      captchaInputEl.current.value = ''
    }
    setError(false)
    setSubscribed(true)
  }

  return (
    <div className="max-w-full">
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-3" onSubmit={subscribe}>
        <div className="sm:col-span-2">
          <label htmlFor="email-input">
            <span className="sr-only">{t('mail')}</span>
            <input
              autoComplete="email"
              className="w-full rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-black"
              id="email-input"
              name="email"
              placeholder={`${subscribed ? t('placeholderSuccess') : t('placeholderDefault')}`}
              ref={inputEl}
              required
              type="email"
              disabled={subscribed}
            />
          </label>
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-sm sm:col-span-1 sm:ml-3 sm:mt-0">
          <button
            className={`w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-white sm:py-0 ${
              subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'
            } focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:ring-offset-black`}
            type="submit"
            disabled={subscribed}
          >
            {subscribed ? t('buttonSuccess') : t('buttonDefault')}
          </button>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="captcha-input">
            <span className="sr-only">{t('placeholderCaptcha')}</span>
            <input
              type="text"
              id="captcha-input"
              name="captcha"
              placeholder={t('placeholderCaptcha')}
              ref={captchaInputEl}
              className="w-full border-0 border-b-2 border-gray-300 bg-transparent focus:border-gray-300 focus:outline-none focus:outline-0 focus:[box-shadow:none]"
              required
            />
          </label>
        </div>
        <div className="sm:col-span-1">
          <Captcha locale={locale} />
        </div>
      </form>
      {error && (
        <div className="w-72 pt-2 text-sm text-red-500 dark:text-red-400 sm:w-96">{message}</div>
      )}
    </div>
  )
}

export default NewsletterForm
