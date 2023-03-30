// const environment = process.env.NODE_ENV || 'development'
// const isDev = environment === 'development'
// const isServer = typeof window === 'undefined'

// const port = process.env.PORT || '3000'
// const apiHost = isDev ? `http://localhost:${port}` : `https://${process.env.VERCEL_URL || process.env.SITE_DOMAIN}`

const apiBaseUrl = `/api`

export const api = {
  notionTags: `${apiBaseUrl}/notion-tags`,
  notionPosts: `${apiBaseUrl}/notion-posts`,
  notionPostById: `${apiBaseUrl}/notion-post-by-id`,
  notionSearch: `${apiBaseUrl}/notion-search`,
}
