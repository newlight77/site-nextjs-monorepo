import { Client, LogLevel } from '@notionhq/client';

const accessToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_7V4rGuSckUhQV0DzAaVKE5mVNZ2nm8xKJzEyenXQfvD';
export const rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';
export const rootDatabaseId = process.env.NOTION_BLOG_DATABASE_ID || '077199b9945d4c86984505402120c25f';

export const notionClient = new Client({
    auth: accessToken,
    logLevel: LogLevel.ERROR,
});
