import { Client, iteratePaginatedAPI, LogLevel } from '@notionhq/client';
import { ListBlockChildrenResponse, PartialBlockObjectResponse, QueryDatabaseResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from 'blog-model';
import { Tag } from 'blog-model';
import { BlogContentSpi } from 'blog-content-service';
import { newLogger } from "logger";

const logger = newLogger("BlogContentNotionAdapter");
logger.log = logger.noOp;


const accessToken = process.env.NOTION_INTEGRATION_TOKEN || 'secret_7V4rGuSckUhQV0DzAaVKE5mVNZ2nm8xKJzEyenXQfvD';
const rootPageId = process.env.NOTION_BLOG_ROOT_PAGE_ID || 'fbad63643b7447c1a27d19bcf9f02331';
const rootDatabaseId = process.env.NOTION_BLOG_DATABASE_ID || 'fbad63643b7447c1a27d19bcf9f02331';

const client = new Client({
  auth: accessToken,
  logLevel: LogLevel.ERROR,
});

type Property = [ propertyName: string, propertyValue: any ];

class BlogContentNotionAdapter implements BlogContentSpi {

  constructor(private client: Client) {}

  fetchAllTags = async (): Promise<Tag[]> => {
    logger.log('fetchAllTags databaseId auth', rootDatabaseId);
    const dbMeta = await this.client.databases.retrieve({ database_id: rootDatabaseId });
    logger.log('fetchAllTags dbMeta', dbMeta);

    const tags = Object.entries(dbMeta.properties)
    .filter(([propertyName, ]: Property) => propertyName === 'Tags')
    .flatMap(([ , propertyValue]: Property) => {
        return propertyValue.multi_select.options
    });
    logger.log('getAllTags tags', tags);

    return tags;
  }

  fetchBlogPosts = async (pagindatedFilter: BlogPostsPaginatedFilter): Promise<BlogPostsPaginated> => {
    logger.log('fetchBlogPosts pagindatedFilter', pagindatedFilter);

    const database = await this.getDatabase(rootDatabaseId);

    logger.log('getDatabase database', database);
    logger.log('getDatabase database.results', database.results);

    
    logger.log('getBlogPosts database', database);

    const posts: BlogPost[] = Object.entries(database.results)
    .flatMap(([ , propertyValue]: Property) => mapToBlogPost(propertyValue));
    // log('getBlogPosts posts', posts);

    return {
        entries: posts,
        total: posts.length,
    };
  }

  fetchPostById = async (id: string): Promise<BlogPost | undefined> => {
    logger.log('getPage pageId auth', id, accessToken);
    const page = await this.client.pages.retrieve({ page_id: id ? id : rootPageId });
    logger.log('getPage page', page);

    const postMeta = Object.entries([page])
    .map(([ , propertyValue]: Property) => {
      logger.log('getPage postMeta', propertyValue)
      return mapToBlogPost(propertyValue)
    })[0];

    logger.log('getPage postMeta', postMeta);

    for await (const block of iteratePaginatedAPI(this.client.blocks.children.list, {
      block_id: page.id,
    })) {
      logger.log('getPage block', block);
    }

    return postMeta;
  }

  fetchSuggestions = async(tags: string[], currentArticleId: string, max: number): Promise<BlogPost[] | undefined> => {
    logger.log('fetchSuggestions tags max currentArticleId', tags, max, currentArticleId);

    return;
  }

  search = async (params: any): Promise<SearchResponse | undefined> => { 
    logger.log('search params', params);
    const results = await this.client.search(params);
    logger.log('search results', results);
    return results;
  }

  fetchUsers = async (): Promise<any | undefined> => {
    logger.log('getUsers', accessToken);
    const users = await this.client.users.list({  });
    logger.log('getUsers users', users);
    return users;
  }

  private getDatabase = async (databaseId?: string): Promise<QueryDatabaseResponse > => {
    logger.log('getDatabase databaseId auth', databaseId, accessToken);

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

    logger.log('getDatabase database', database);
    logger.log('getDatabase database.results', database.results);

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

    logger.log('getBlocks blocks', blocks);

    return blocks;
  };
}

function mapToBlogPost(propertyValue: any): BlogPost {
  logger.log('mapToBlogPost mapToBlogPost', propertyValue);
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

export const blogContentNotionAdapter = new BlogContentNotionAdapter(client);
