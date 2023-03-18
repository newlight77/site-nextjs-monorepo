import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post';
import { Tag } from '../../models/tags';
import { notionApiAdapter } from '../spi/notion-api-adapter';

export interface NotionSpi {
    getPage(pageId?: string): Promise<ExtendedRecordMap | undefined>;
    search(params: SearchParams): Promise<SearchResults | undefined>;
}

export class NotionService {
    constructor(private spi: NotionSpi) { }

    async getPage(pageId?: string): Promise<ExtendedRecordMap | undefined> {
        try {
            const page = await this.spi.getPage(pageId);
            // console.log('service page', page);
            return page;
        } catch (error) {
            console.log(error);
        }
    }

    async search(params: SearchParams): Promise<SearchResults | undefined> {
        try {
            const results = await this.spi.search(params);
            console.log('service results', results);
            return results;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllTags(): Promise<Tag[]> {
        try {
            const page = await this.spi.getPage();
            console.log('service page', page);
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
            console.log('service page', page);
            return;
        } catch (error) {
            console.log(error);
        }
    }

    async getPostBySlug(slug: string | string[] | undefined): Promise<BlogPost | undefined> {
        console.log('slug', slug);
        try {
            const page = await this.spi.getPage();
            console.log('service page', page);
            return ;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], max: number, currentArticleSlug: string): Promise<BlogPost[] | undefined> {
        console.log('tags max currentArticleSlug', tags, max, currentArticleSlug);
        try {
            const page = await this.spi.getPage();
            console.log('service page', page);
            return;
        } catch (e) {
            console.error(e);
        }
    }
}

export const notionService = new NotionService(notionApiAdapter)