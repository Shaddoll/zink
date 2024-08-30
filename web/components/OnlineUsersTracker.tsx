'use client'

import React, { useEffect, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

const OnlineUsersTracker = () => {
  const [onlineUsers, setOnlineUsers] = useState(1)

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
    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
      Online Vistors: {onlineUsers}
    </div>
  )
}

export default OnlineUsersTracker
