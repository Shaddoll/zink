'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { useTranslation } from 'app/i18n/client'
import { languages } from 'app/i18n/settings'

export default function LocalDropdown({ locale }) {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation(locale, 'header')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLanguageChange = (locale: string) => {
    setDropdownOpen(false)
    const segments = pathname!.split('/')
    const localeIndex = segments.findIndex((segment) => languages.includes(segment))
    if (localeIndex !== -1) {
      segments[localeIndex] = locale
    } else {
      segments.splice(1, 0, locale)
    }
    const newPath = segments.join('/').replace(/\/$/, '')
    router.push(newPath)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="text-md flex items-center focus:outline-none"
      >
        {t('language')}
        <svg
          className="ml-1 h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.75 7.75 10 12.25l4.25-4.5"
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-28 rounded-lg border bg-white py-2 shadow dark:bg-gray-800">
          {siteMetadata.supportedLocales.map((locale) => (
            <button
              onClick={() => handleLanguageChange(locale)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              key={locale}
            >
              {siteMetadata.localeToLanguageMap[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
