import { Client, LogLevel } from '@notionhq/client';

const accessToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_7V4rGuSckUhQV0DzAaVKE5mVNZ2nm8xKJzEyenXQfvD';

export const notionClient = new Client({
    auth: accessToken,
    logLevel: LogLevel.ERROR,
});
