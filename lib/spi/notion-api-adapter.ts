import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { NotionAPI } from 'notion-client'

import { NotionSpi } from '../domain/notion.service'

// const accessToken = process.env.NOTION_API_TOKEN || 'secret_jEpthR4bHr0e4ZhM1JXidqO16Lpv9l5FWZ0ORuiwqWb';
const rootNotionPageId = process.env.ROOT_NOTION_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';
// const blogsDatabaseId = process.env.BLOGS_DB_ID || '39d392b168454d1a8373a5e5472bdcd2';
// const blogsDatabaseViewId = '05d98bc9ffcd4d4fb9113501c800a9e6';
// const rootNotionSpaceId = process.env.ROOT_NOTION_SPACE_ID || '';

const notionApi = new NotionAPI({
  // authToken: accessToken
})

class NotionApiAdapter implements NotionSpi {

  constructor(private notionApi: NotionAPI) {}

  getPage = async (pageId?: string): Promise<ExtendedRecordMap | undefined> => {
    // console.log('NotionAdapter pageId', pageId);
    const recordMap = this.notionApi.getPage(pageId ? pageId : rootNotionPageId);
    // console.log('NotionApiAdapter getPage recordMap', (await recordMap));

    return recordMap;
  }

  search = (params: SearchParams): Promise<SearchResults | undefined> => {
    const results = this.notionApi.search(params);
    // console.log('NotionApiAdapter search results', results);
    return results;
  }

}

export const notionApiAdapter = new NotionApiAdapter(notionApi);
