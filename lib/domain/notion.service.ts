import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post';
import { Tag } from '../../models/tags';
import { notionClientAdapter } from '../spi/notion-client-adapter';

export interface NotionSpi {
    getDatabaseMeta(databaseId?: string): Promise<any | undefined>;
    getDatabase(databaseId?: string): Promise<any | undefined>;
    getPage(pageId?: string): Promise<any | undefined>;
    getBlocks(blockId: string): Promise<any[] | undefined>;
    search(params: any): Promise<any | undefined>;
}

export class NotionService {
    constructor(private spi: NotionSpi) { }

    async search(params: any): Promise<any | undefined> {
        try {
            const results = await this.spi.search(params);
            console.log('======    NotionService search results', results);
            return results;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllTags(): Promise<Tag[]> {
        try {
            const database = await this.spi.getDatabase();
            console.log('======    NotionService getAllTags database', database);

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
        console.log('======    NotionService getBlogPosts limit skip tag', limit, skip, tag);
        try {
            const database = await this.spi.getDatabase();
            console.log('======    NotionService getBlogPosts database', database);
            
            return;
        } catch (error) {
            console.log(error);
        }
    }

    async getPostBySlug(slug: string | string[] | undefined): Promise<BlogPost | undefined> {
        console.log('======    NotionService getPostBySlug slug', slug);
        try {
            return ;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], max: number, currentArticleSlug: string): Promise<BlogPost[] | undefined> {
        console.log('======    NotionService getSuggestions tags max currentArticleSlug', tags, max, currentArticleSlug);
        try {
            return;
        } catch (e) {
            console.error(e);
        }
    }
}

export const notionClientService = new NotionService(notionClientAdapter)
