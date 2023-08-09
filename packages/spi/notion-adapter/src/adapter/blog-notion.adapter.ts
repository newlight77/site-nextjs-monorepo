import { Client } from '@notionhq/client';
import {
  ListBlockChildrenResponse,
  PartialBlockObjectResponse,
  QueryDatabaseResponse,
  SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import { notionClient, rootDatabaseId, rootPageId } from "./notion.client";
import { BlogPost, BlogPosts, BlogPostsPaginatedFilter } from 'blog-model';
import { Tag } from 'blog-model';
import { BlogContentSpi } from 'blog-content-service';
import { newLogger } from "logger";

const logger = newLogger("BlogContentNotionAdapter");
logger.log = logger.noOp;


type Property = [ propertyName: string, propertyValue: any ];

export class BlogNotionAdapter implements BlogContentSpi {

  constructor(private client: Client) {}

  fetchAllTags = async (): Promise<Tag[]> => {
    // logger.log('fetchAllTags databaseId auth', rootDatabaseId);
    const dbMeta = await this.client.databases.retrieve({ database_id: rootDatabaseId });
    // logger.log('fetchAllTags dbMeta', dbMeta);

    const tags = Object.entries(dbMeta.properties)
    .filter(([propertyName, ]: Property) => propertyName === 'Tags')
    .flatMap(([ , propertyValue]: Property) => {
        return propertyValue.multi_select.options
    });
    logger.log('fetchAllTags tags', tags);

    return tags;
  }

  fetchBlogPosts = async (pagindatedFilter: BlogPostsPaginatedFilter): Promise<BlogPosts> => {
    logger.log('fetchBlogPosts pagindatedFilter', pagindatedFilter);

    const database = await this.getDatabase(rootDatabaseId);
    // logger.log('fetchBlogPosts database', database);
    // logger.log('fetchBlogPosts database.results', database.results);

    const posts: BlogPost[] = [];
    Object.entries(database.results)
    .flatMap(([ , propertyValue]: Property) => 
      mapToBlogPost(propertyValue).then(e => posts.push(e))
    );
    logger.log('getBlogPosts posts', posts);

    return {
        entries: posts,
        total: posts.length,
    };
  }

  fetchPostById = async (id: string): Promise<BlogPost | undefined> => {
    const page = await this.client.pages.retrieve({ page_id: id ? id : rootPageId });
    // logger.log('fetchPostById page', page);

    const pageContentList = Object.entries([page])
    .map(([ , propertyValue]: Property) => propertyValue);
    logger.log('fetchPostById pageContentList', pageContentList);
    const pageContent = pageContentList[0];
    const postMeta = await mapToBlogPost(pageContent)

    logger.log('fetchPostById postMeta', postMeta);

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

  private getDatabase = async (databaseId?: string): Promise<QueryDatabaseResponse > => {

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
    // logger.log('getDatabase database.results', database.results);

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

async function mapToBlogPost(propertyValue: any, body = ""): Promise<BlogPost> {
  logger.log('mapToBlogPost propertyValue', propertyValue);
  return {
      id: propertyValue.id,
      slug: propertyValue.properties.Slug.rich_text[0].plain_text,
      body: body,
      title: propertyValue.properties.Name.title[0].plain_text,
      description: propertyValue.properties.Description.rich_text[0].plain_text,
      tags: propertyValue.properties.Tags.multi_select,
      heroImage: propertyValue.properties.Picture.files[0].file.url,
      author: propertyValue.properties.Author.people[0].name,
      publishedAt: propertyValue.properties.Created.created_time
  };
}

export const blogNotionAdapter = new BlogNotionAdapter(notionClient);
