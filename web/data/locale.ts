'use server'

import { headers } from 'next/headers'

export default async function getLocale() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  const locale = acceptLanguage ? acceptLanguage.split(',')[0] : 'en-US';
  return locale
}