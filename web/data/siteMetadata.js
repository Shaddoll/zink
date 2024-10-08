const siteMetadata = {
  title: 'Z\'ink',
  author: 'Z',
  headerTitle: 'Z\'ink',
  description: 'What matters is not what happened, but what to do.\n 重要的不是发生了什么，而是去做什么。',
  language: 'zh-CN',
  supportedLocales: ['en-US', 'zh-CN'],
  localeToLanguageMap: {
    'en-US': 'English',
    'zh-CN': '简体中文',
  },
  theme: 'system', // system, dark or light
  siteUrl: 'https://zink.top',
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  apiUrl: `${process.env.API_URL || 'http://localhost:8000'}`,
  walineServerUrl: `${process.env.WALINE_URL || 'http://localhost:7001'}`,
  mastodon: 'https://mastodon.social/@mastodonuser',
  email: 'z@zink.top',
  rss: 'https://zink.top/feed.xml',
  github: 'https://github.com',
  x: 'https://twitter.com/x',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com',
  threads: 'https://www.threads.net',
  instagram: 'https://www.instagram.com',
  weibo: 'https://weibo.com',
  bilibili: 'https://bilibili.com',
  zhihu: 'https://zhihu.com',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  analytics: {
    googleAnalytics: {
      googleAnalyticsId: `${process.env.GOOGLE_ANALYTICS_ID || ''}`,
    },
  },
  googleAcountKeyFilePath: process.env.GOOGLE_ACCOUNT_KEY_FILE_PATH || '/etc/secrets/google-account-key.json',
  googleAnalyticsProperty: process.env.GOOGLE_ANALYTICS_PROPERTY || '',
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: 'emailoctopus',
  },
  geoNameUsername: process.env.GEONAME_USERNAME || '',
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
