import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { Client, LogLevel } from '@notionhq/client';

import { NotionSpi } from '../domain/notion.service'

const accessToken = process.env.NOTION_API_TOKEN || 'secret_jEpthR4bHr0e4ZhM1JXidqO16Lpv9l5FWZ0ORuiwqWb';
const notionBaseUrl = process.env.NOTION_API_BASE_URL || 'https://api.notion.com/v1';


const client = new Client({
  auth: accessToken,
  baseUrl: notionBaseUrl,
  logLevel: LogLevel.ERROR,
});

class NotionAdapter implements NotionSpi {

  constructor(private client: Client) {}

  getPage = async (pageId: string): Promise<ExtendedRecordMap | undefined > => {
    console.log('pageId', pageId);
    return undefined;
  }

  search = async (params: SearchParams): Promise<SearchResults | undefined> => { 
    console.log('params', params);
    return undefined;
  }
}

export const notionClientAdapter = new NotionAdapter(client);
