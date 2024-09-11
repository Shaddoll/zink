'use client'

import React from 'react'
import { useTranslation } from 'app/i18n/client'

type VisitorStatsProps = {
  startDate: Date
  currentDate: Date
  locale: string
  visits?: {
    total: number
    lastMonth: number
    lastWeek: number
    yesterday: number
    today: number
  }
}

const VisitorStats = ({ startDate, currentDate, visits, locale }: VisitorStatsProps) => {
  const { t } = useTranslation(locale, 'visitor')
  const startDateStr = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(startDate)
  const currentDateStr = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(currentDate)
  const yesterdayDateStr = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
  const lastWeekDateStr = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
  const lastMonthDateStr = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000))
  return (
    <div className="flex w-full items-center justify-around border-t border-gray-200 py-4">
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-500">{t('today')}</h4>
        <p className="text-2xl font-semibold text-gray-900">{visits ? visits.today : 'N/A'}</p>
        <p className="text-xs text-gray-400">{currentDateStr}</p>
      </div>
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-500">{t('yesterday')}</h4>
        <p className="text-2xl font-semibold text-gray-900">{visits ? visits.yesterday : 'N/A'}</p>
        <p className="text-xs text-gray-400">{yesterdayDateStr}</p>
      </div>
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-500">{t('week')}</h4>
        <p className="text-2xl font-semibold text-gray-900">{visits ? visits.lastWeek : 'N/A'}</p>
        <p className="text-xs text-gray-400">
          {lastWeekDateStr} - {currentDateStr}
        </p>
      </div>
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-500">{t('month')}</h4>
        <p className="text-2xl font-semibold text-gray-900">{visits ? visits.lastMonth : 'N/A'}</p>
        <p className="text-xs text-gray-400">
          {lastMonthDateStr} - {currentDateStr}
        </p>
      </div>
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-500">{t('total')}</h4>
        <p className="text-2xl font-semibold text-gray-900">{visits ? visits.total : 'N/A'}</p>
        <p className="text-xs text-gray-400">
          {t('since')} {startDateStr}
        </p>
      </div>
    </div>
  )
}

export default VisitorStats
