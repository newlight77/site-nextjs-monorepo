import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { NotionAPI } from 'notion-client'

import { NotionSpi } from '../domain/notion.service'

// const accessToken = process.env.NOTION_API_TOKEN || 'secret_jEpthR4bHr0e4ZhM1JXidqO16Lpv9l5FWZ0ORuiwqWb';
const notionBaseUrl = process.env.NOTION_API_BASE_URL || 'https://api.notion.com/v1';

const notionApi = new NotionAPI({
  apiBaseUrl: notionBaseUrl,
  // authToken: accessToken
})

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

class NotionAdapter implements NotionSpi {

  constructor(private notionApi: NotionAPI) {}

  getPage = async (pageId: string): Promise<ExtendedRecordMap | undefined> => {
    console.log('notionBaseUrl', notionBaseUrl);
    console.log('pageId', pageId);
    // const recordMap = this.notionApi.getPage(pageId);
    // console.log('recordMap', recordMap);
    return undefined;
  }

  search = (params: SearchParams): Promise<SearchResults | undefined> => {
    const results = this.notionApi.search(params);
    console.log('results', results);
    return results;
  }

}

export const notionApiAdapter = new NotionAdapter(notionApi);
