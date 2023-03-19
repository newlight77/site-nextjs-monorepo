export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'
export const isServer = typeof window === 'undefined'

export const port = process.env.PORT || '3000'
export const host = isDev ? `http://localhost:${port}` : `https://${process.env.SITE_DOMAIN}`
export const apiHost = isDev ? host : `https://${process.env.VERCEL_URL || process.env.SITE_DOMAIN}`

export const apiBaseUrl = `/api`

export const api = {
  notionTags: `${apiBaseUrl}/notion-tags`,
  notionPosts: `${apiBaseUrl}/notion-posts`,
  notionPostById: `${apiBaseUrl}/notion-post-by-id`,
  notionSearch: `${apiBaseUrl}/notion-search`,
}
