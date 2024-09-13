import type { InitOptions } from 'i18next'

export const fallbackLng = 'en-US'
export const languages = [fallbackLng, 'zh-CN']
export const cookieName = 'i18next'
export const defaultNS = 'translation'

export function getOptions(lng = fallbackLng, ns = defaultNS): InitOptions {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    // backend: {
    //   projectId: '01b2e5e8-6243-47d1-b36f-963dbb8bcae3'
    // }
  }
}
