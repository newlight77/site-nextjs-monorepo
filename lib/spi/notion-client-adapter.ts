import { Client, LogLevel } from '@notionhq/client';

import { NotionSpi } from '../domain/notion.service';
import { GetPageResponse, ListBlockChildrenResponse, PartialBlockObjectResponse, QueryDatabaseResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

const accessToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_7V4rGuSckUhQV0DzAaVKE5mVNZ2nm8xKJzEyenXQfvD';
const rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';
const rootDatabaseId = process.env.NOTION_BLOG_DATABASE_ID || 'fbad63643b7447c1a27d19bcf9f02331';

const client = new Client({
  auth: accessToken,
  logLevel: LogLevel.DEBUG,
});


class NotionClientAdapter implements NotionSpi {

  constructor(private client: Client) {}

  getPage = async (pageId?: string): Promise<GetPageResponse | undefined > => {
    console.log('-----    NotionClientAdapter getPage pageId auth', pageId, accessToken);
    const page = await this.client.pages.retrieve({ page_id: pageId ? pageId : rootPageId });
    // console.log('NotionClientAdapter getPage page', page);
    return page;
  }

  getDatabaseMeta = async (databaseId?: string): Promise<QueryDatabaseResponse | undefined > => {
    console.log('-----    NotionClientAdapter getDatabaseMeta databaseId auth', databaseId, accessToken);
    const database = await this.client.databases.query({ database_id: databaseId ? databaseId : rootDatabaseId });
    // console.log('NotionClientAdapter getDatabaseMeta database', database);
    return database;
  }

  getDatabase = async (databaseId?: string): Promise<QueryDatabaseResponse | undefined > => {
    console.log('-----    NotionClientAdapter getDatabase databaseId auth', databaseId, accessToken);
    const filter = {
      property: 'isPublic',
      checkbox: {
        equals: false,
      },
    };

    type direction = "descending" | "ascending"
    const sorts: [{ property: string, direction: direction }] = [{
        property: 'Name',
        direction: 'descending'
    }];

    const database = await this.client.databases.query({
      database_id: databaseId ? databaseId: rootDatabaseId,
      filter, sorts
    });

    console.log('-----    NotionClientAdapter getDatabase database', database);
    console.log('-----    NotionClientAdapter getDatabase database.results', database.results);
    console.log('-----    NotionClientAdapter getDatabase database.page', database.page);

    Object.entries(database.results[0].properties['Tags'].multi_select[0]).forEach(([propertyName, propertyValue]) => {
      console.log(`${propertyName}: ${propertyValue}`);
    });



    // console.log('NotionClientAdapter getDatabase database', database);
    return database;
  }

  getBlocks = async (blockId: string): Promise<PartialBlockObjectResponse[] | undefined> => {
    const blocks = [];
    let cursor: string | undefined;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { results, next_cursor }: ListBlockChildrenResponse =
        await this.client.blocks.children.list({
          start_cursor: cursor,
          block_id: blockId,
        });
      blocks.push(...results);
      if (!next_cursor) {
        break;
      }
      cursor = next_cursor;
    }
    return blocks;
  };

  search = async (params: any): Promise<SearchResponse | undefined> => { 
    const results = await this.client.search({});
    console.log('-----    NotionClientAdapter search params results', params, results);
    return results;
  }
}

export const notionClientAdapter = new NotionClientAdapter(client);
