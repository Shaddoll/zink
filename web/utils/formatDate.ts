export const formatDate = (date: string, locale = 'en-US') => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }
  const now = new Date(date).toLocaleDateString(locale, options)
  return now
}
