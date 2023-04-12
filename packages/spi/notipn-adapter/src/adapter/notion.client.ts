import { Client, LogLevel } from '@notionhq/client';

const accessToken = process.env.NOTION_INTEGRATION_TOKEN || '';
export const rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || '';
export const rootDatabaseId = process.env.NOTION_BLOG_DATABASE_ID || '';

export const notionClient = new Client({
    auth: accessToken,
    logLevel: LogLevel.ERROR,
});
