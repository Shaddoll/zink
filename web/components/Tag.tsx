import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
  locale: string
}

const Tag = ({ text, locale }: Props) => {
  return (
    <Link
      href={`/${locale}/tags/${slug(text)}`}
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
