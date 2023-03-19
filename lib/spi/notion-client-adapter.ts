import { SearchParams } from 'notion-types';
import { Client, LogLevel } from '@notionhq/client';

import { NotionSpi } from '../domain/notion.service';
import { GetPageResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

const accessToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_7V4rGuSckUhQV0DzAaVKE5mVNZ2nm8xKJzEyenXQfvD';
const rootNotionPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';

const client = new Client({
  auth: accessToken,
  logLevel: LogLevel.DEBUG,
});

class NotionClientAdapter implements NotionSpi {

  constructor(private client: Client) {}

  getPage = async (pageId: string): Promise<GetPageResponse | undefined > => {
    console.log('NotionClientAdapter getPage pageId auth', pageId, accessToken);
    const response = await this.client.pages.retrieve({ page_id: pageId ? pageId : rootNotionPageId });
    // console.log('NotionClientAdapter getPage response', response);
    return response;
  }

  search = async (params: SearchParams): Promise<SearchResponse | undefined> => { 
    const results = await this.client.search({});
    console.log('NotionClientAdapter search params results', params, results);
    return results;
  }
}

export const notionClientAdapter = new NotionClientAdapter(client);
