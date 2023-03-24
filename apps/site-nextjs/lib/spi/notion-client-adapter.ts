import { Client, iteratePaginatedAPI, LogLevel } from '@notionhq/client';

import { NotionSpi } from '../domain/notion.service';
import { ListBlockChildrenResponse, PartialBlockObjectResponse, QueryDatabaseResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from 'models/blog.post';
import { Tag } from 'models/tags';

const accessToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_7V4rGuSckUhQV0DzAaVKE5mVNZ2nm8xKJzEyenXQfvD';
const rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';
const rootDatabaseId = process.env.NOTION_BLOG_DATABASE_ID || 'fbad63643b7447c1a27d19bcf9f02331';

const log = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
  console.log(`------    NotionClientAdapter  ${message}`, colorfulParams);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
// const log = (message?: any, ...optionalParams: any[]) => {};

const client = new Client({
  auth: accessToken,
  logLevel: LogLevel.ERROR,
});

type Property = [ propertyName: string, propertyValue: any ];

class NotionClientAdapter implements NotionSpi {

  constructor(private client: Client) {}

  fetchAllTags = async (): Promise<Tag[]> => {
    log('fetchAllTags databaseId auth', rootDatabaseId);
    const dbMeta = await this.client.databases.retrieve({ database_id: rootDatabaseId });
    log('fetchAllTags dbMeta', dbMeta);

    const tags = Object.entries(dbMeta.properties)
    .filter(([propertyName, ]: Property) => propertyName === 'Tags')
    .flatMap(([ , propertyValue]: Property) => {
        return propertyValue.multi_select.options
    });
    log('getAllTags tags', tags);

    return tags;
  }

  fetchBlogPosts = async (pagindatedFilter: BlogPostsPaginatedFilter): Promise<BlogPostsPaginated> => {
    log('fetchBlogPosts pagindatedFilter', pagindatedFilter);

    const database = await this.getDatabase(rootDatabaseId);

    log('getDatabase database', database);
    log('getDatabase database.results', database.results);

    
    log('getBlogPosts database', database);

    const posts: BlogPost[] = Object.entries(database.results)
    .flatMap(([ , propertyValue]: Property) => mapToBlogPost(propertyValue));
    // log('getBlogPosts posts', posts);

    return {
        entries: posts,
        total: posts.length,
    };
  }

  fetchPostById = async (id: string): Promise<BlogPost | undefined> => {
    log('getPage pageId auth', id, accessToken);
    const page = await this.client.pages.retrieve({ page_id: id ? id : rootPageId });
    log('getPage page', page);

    const postMeta = Object.entries([page])
    .map(([ , propertyValue]: Property) => {
      log('getPage postMeta', propertyValue)
      return mapToBlogPost(propertyValue)
    })[0];

    log('getPage postMeta', postMeta);

    for await (const block of iteratePaginatedAPI(this.client.blocks.children.list, {
      block_id: page.id,
    })) {
      log('getPage block', block);
    }

    return postMeta;
  }

  fetchSuggestions = async(tags: string[], currentArticleId: string, max: number): Promise<BlogPost[] | undefined> => {
    log('fetchSuggestions tags max currentArticleId', tags, max, currentArticleId);

    return;
  }

  search = async (params: any): Promise<SearchResponse | undefined> => { 
    log('search params', params);
    const results = await this.client.search(params);
    log('search results', results);
    return results;
  }

  fetchUsers = async (): Promise<any | undefined> => {
    log('getUsers', accessToken);
    const users = await this.client.users.list({  });
    log('getUsers users', users);
    return users;
  }

  private getDatabase = async (databaseId?: string): Promise<QueryDatabaseResponse > => {
    log('getDatabase databaseId auth', databaseId, accessToken);

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

    log('getDatabase database', database);
    log('getDatabase database.results', database.results);

    return database;
  }

  private getBlocks = async (blockId: string): Promise<PartialBlockObjectResponse[] | undefined> => {
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

    log('getBlocks blocks', blocks);

    return blocks;
  };
}

function mapToBlogPost(propertyValue: any): BlogPost {
  log('mapToBlogPost mapToBlogPost', propertyValue);
  return {
      id: propertyValue.id,
      slug: propertyValue.properties.Slug.rich_text[0].plain_text,
      body: undefined,
      title: propertyValue.properties.Name.title[0].plain_text,
      description: propertyValue.properties.Description.rich_text[0].plain_text,
      tags: propertyValue.properties.Tags.multi_select,
      heroImage: propertyValue.properties.Picture.files[0].file.url,
      author: propertyValue.properties.Author.people[0].name,
      publishedAt: propertyValue.properties.Created.created_time
  };
}

export const notionClientAdapter = new NotionClientAdapter(client);
