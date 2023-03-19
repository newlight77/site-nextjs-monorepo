import { Client, LogLevel } from '@notionhq/client';

import { NotionSpi } from '../domain/notion.service';
import { GetDatabaseResponse, GetPageResponse, ListBlockChildrenResponse, PartialBlockObjectResponse, QueryDatabaseResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

const accessToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_7V4rGuSckUhQV0DzAaVKE5mVNZ2nm8xKJzEyenXQfvD';
const rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';
const rootDatabaseId = process.env.NOTION_BLOG_DATABASE_ID || 'fbad63643b7447c1a27d19bcf9f02331';

// const log = (message?: any, ...optionalParams: any[]) => {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
//   console.log(message, colorfulParams);
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const log = (message?: any, ...optionalParams: any[]) => {};

const client = new Client({
  auth: accessToken,
  logLevel: LogLevel.WARN,
});

class NotionClientAdapter implements NotionSpi {

  constructor(private client: Client) {}

  getUsers = async (): Promise<any | undefined> => {
    log('------    NotionClientAdapter getUsers', accessToken);
    const users = await this.client.users.list({  });
    log('------    NotionClientAdapter getUsers users', users);
    return users;
  }

  getPage = async (pageId?: string): Promise<GetPageResponse | undefined > => {
    log('------    NotionClientAdapter getPage pageId auth', pageId, accessToken);
    const page = await this.client.pages.retrieve({ page_id: pageId ? pageId : rootPageId });
    log('------    NotionClientAdapter getPage page', page);
    return page;
  }

  getDatabaseMeta = async (databaseId?: string): Promise<GetDatabaseResponse | undefined > => {
    log('------    NotionClientAdapter getDatabaseMeta databaseId auth', databaseId, accessToken);
    const dbMeta = await this.client.databases.retrieve({ database_id: databaseId ? databaseId : rootDatabaseId });
    log('------    NotionClientAdapter getDatabaseMeta database', dbMeta);
    return dbMeta;
  }

  getDatabase = async (databaseId?: string): Promise<QueryDatabaseResponse | undefined > => {
    log('------    NotionClientAdapter getDatabase databaseId auth', databaseId, accessToken);

    type direction = "descending" | "ascending"
    const sorts: [{ property: string, direction: direction }] = [{
        property: 'Name',
        direction: 'descending'
    }];

    const filter = {
      property: 'isPublic',
      checkbox: {
        equals: true,
      },
    };

    const database = await this.client.databases.query({
      database_id: databaseId ? databaseId: rootDatabaseId,
      filter, sorts
    });

    log('------    NotionClientAdapter getDatabase database', database);
    log('------    NotionClientAdapter getDatabase database.results', database.results);

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

    log('------    NotionClientAdapter getBlocks blocks', blocks);

    return blocks;
  };

  search = async (params: any): Promise<SearchResponse | undefined> => { 
    log('------    NotionClientAdapter search params', params);
    const results = await this.client.search(params);
    log('------    NotionClientAdapter search results', results);
    return results;
  }
}

export const notionClientAdapter = new NotionClientAdapter(client);
