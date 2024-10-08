'use client'

import React, { useEffect, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'
import { useTranslation } from 'app/i18n/client'

const OnlineUsersTracker = ({ locale }) => {
  const [onlineUsers, setOnlineUsers] = useState(1)
  const { t } = useTranslation(locale, 'header')

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(`${siteMetadata.siteUrl.replace('https://', 'wss://')}/ws`)
    // Handle incoming messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.online_users !== undefined) {
        setOnlineUsers(data.online_users)
      }
    }
    // Clean up the WebSocket connection on component unmount
    return () => {
      ws.close()
    }
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <Link
      href={`/${locale}/visitor`}
      className="block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
    >
      {t('online')}: {onlineUsers}
    </Link>
  )
}

export default OnlineUsersTracker
