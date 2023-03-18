import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { NotionAPI } from 'notion-client'

import { NotionSpi } from '../domain/notion.service'

// const accessToken = process.env.NOTION_API_TOKEN || 'secret_jEpthR4bHr0e4ZhM1JXidqO16Lpv9l5FWZ0ORuiwqWb';
const rootNotionPageId = process.env.ROOT_NOTION_PAGE_ID || '0887029a91fb4f0b9b9032932069c9bd';
// const blogsDatabaseId = process.env.BLOGS_DB_ID || '39d392b168454d1a8373a5e5472bdcd2';
// const blogsDatabaseViewId = '05d98bc9ffcd4d4fb9113501c800a9e6';
// const rootNotionSpaceId = process.env.ROOT_NOTION_SPACE_ID || '';

const notionApi = new NotionAPI({
  // authToken: accessToken
})

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

class NotionAdapter implements NotionSpi {

  constructor(private notionApi: NotionAPI) {}

  getPage = async (pageId?: string): Promise<ExtendedRecordMap | undefined> => {
    console.log('pageId', pageId);
    const recordMap = this.notionApi.getPage(pageId ? pageId : rootNotionPageId);
    console.log('recordMap', recordMap);

    // const database = this.notionApi.getCollectionData(blogsDatabaseId, blogsDatabaseViewId, {});
    // console.log('database', database);

    return recordMap;
  }

  search = (params: SearchParams): Promise<SearchResults | undefined> => {
    const results = this.notionApi.search(params);
    console.log('results', results);
    return results;
  }

}

export const notionApiAdapter = new NotionAdapter(notionApi);
