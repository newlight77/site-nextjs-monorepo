import { SearchParams, SearchResults } from 'notion-types'
import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post';
import { Tag } from '../../models/tags';
import { notionApiAdapter } from '../spi/notion-api-adapter';
import { notionClientAdapter } from '../spi/notion-client-adapter';

export interface NotionSpi {
    getDatabaseMeta(databaseId?: string): Promise<any | undefined>;
    getDatabase(databaseId?: string): Promise<any | undefined>;
    getPage(pageId?: string): Promise<any | undefined>;
    getBlocks(blockId: string): Promise<any[] | undefined>;
    search(params: SearchParams): Promise<any | undefined>;
}

export class NotionService {
    constructor(private spi: NotionSpi) { }

    async getPage(pageId?: string): Promise<any | undefined> {
        try {
            const page = await this.spi.getPage(pageId);
            console.log('NotionService getPage page', page);

            const databaseMeta = await this.spi.getDatabaseMeta();
            console.log('NotionService getPage databaseMeta', databaseMeta);

            const database = await this.spi.getDatabase();
            console.log('NotionService getPage database', database);

            // const blocks = await this.spi.getBlocks();
            // console.log('NotionService getPage blocks', blocks);

            return page;
        } catch (error) {
            console.log(error);
        }
    }

    async search(params: SearchParams): Promise<SearchResults | undefined> {
        try {
            const results = await this.spi.search(params);
            console.log('NotionService search results', results);
            return results;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllTags(): Promise<Tag[]> {
        try {
            const page = await this.spi.getPage();
            console.log('NotionService getAllTags page', page);
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getBlogPosts(
        { limit, skip, tag }: BlogPostsPaginatedFilter = {
            limit: 5,
            skip: 0,
            tag: ''
        }
    ): Promise<BlogPostsPaginated | undefined> {
        console.log('limit skip tag', limit, skip, tag);
        try {
            const page = await this.spi.getPage();
            console.log('NotionService getBlogPosts page', page);
            return;
        } catch (error) {
            console.log(error);
        }
    }

    async getPostBySlug(slug: string | string[] | undefined): Promise<BlogPost | undefined> {
        console.log('slug', slug);
        try {
            const page = await this.spi.getPage();
            console.log('NotionService getPostBySlug page', page);
            return ;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], max: number, currentArticleSlug: string): Promise<BlogPost[] | undefined> {
        console.log('tags max currentArticleSlug', tags, max, currentArticleSlug);
        try {
            const page = await this.spi.getPage();
            console.log('NotionService getSuggestions page', page);
            return;
        } catch (e) {
            console.error(e);
        }
    }
}

export const notionApiService = new NotionService(notionApiAdapter)
export const notionClientService = new NotionService(notionClientAdapter)
