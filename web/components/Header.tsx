import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import Image from 'next/image'
import LocalDropdown from './LocaleDropdown'
import OnlineUsersTracker from './OnlineUsersTracker'
import { createTranslation } from 'app/i18n/server'

const Header = async ({ locale }) => {
  const { t } = await createTranslation(locale, 'header')
  let headerClass = 'flex items-center w-full bg-[#faebd7] dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href={`/${locale}`} aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Image src="/static/images/logo.png" alt="Logo" width={54} height={44} />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <LocalDropdown locale={locale} />
        <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={`/${locale}${link.href}`}
                className="block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
              >
                {t(link.title.toLowerCase())}
              </Link>
            ))}
        </div>
        <OnlineUsersTracker locale={locale} />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
