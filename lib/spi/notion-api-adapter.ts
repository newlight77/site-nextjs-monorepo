import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types';
import { NotionAPI } from 'notion-client';

import { NotionSpi } from '../domain/notion.service';

const rootNotionPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';

const notionApi = new NotionAPI({});

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
