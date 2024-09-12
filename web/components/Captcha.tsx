'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'app/i18n/client'

const Captcha = ({ locale }) => {
  const [captchaSvg, setCaptchaSvg] = useState<string | null>(null)
  const { t } = useTranslation(locale, 'newsletter')

  const fetchCaptcha = async () => {
    const response = await fetch('/api/captcha')
    const data = await response.json()
    setCaptchaSvg(data.svg)
  }

  useEffect(() => {
    fetchCaptcha() // Fetch captcha when the component mounts
  }, [])

  return (
    <div>
      {captchaSvg ? (
        // Make the captcha clickable, refresh on click
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          onClick={fetchCaptcha}
          dangerouslySetInnerHTML={{ __html: captchaSvg }}
          className="inline-block cursor-pointer"
        />
      ) : (
        <p>{t('loadCaptcha')}</p>
      )}
    </div>
  )
}

export default Captcha
