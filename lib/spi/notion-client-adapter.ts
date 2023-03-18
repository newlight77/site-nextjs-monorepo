import { SearchParams } from 'notion-types'
import { Client, LogLevel } from '@notionhq/client';

import { NotionSpi } from '../domain/notion.service'
import { GetPageResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

const accessToken = process.env.NOTION_API_TOKEN || 'secret_jEpthR4bHr0e4ZhM1JXidqO16Lpv9l5FWZ0ORuiwqWb';
const rootNotionPageId = process.env.ROOT_NOTION_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';
// const blogsDatabaseId = process.env.BLOGS_DB_ID || '39d392b168454d1a8373a5e5472bdcd2';
// const blogsDatabaseViewId = '05d98bc9ffcd4d4fb9113501c800a9e6';
// const notionBaseUrl = process.env.NOTION_API_BASE_URL || 'https://api.notion.com/v1';


const client = new Client({
  auth: accessToken,
  // baseUrl: notionBaseUrl,
  logLevel: LogLevel.DEBUG,
});

class NotionClientAdapter implements NotionSpi {

  constructor(private client: Client) {}

  getPage = async (pageId: string): Promise<GetPageResponse | undefined > => {
    console.log('NotionClientAdapter getPage pageId', pageId);
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
