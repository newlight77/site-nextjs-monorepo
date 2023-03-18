import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'
import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post';
import { Tag } from '../../models/tags';
import { notionApiAdapter } from '../spi/notion-api-adapter';

// const rootNotionSpaceId = process.env.ROOT_NOTION_SPACE_ID || '';
const rootNotionPageId = process.env.ROOT_NOTION_PAGE_ID || '0887029a91fb4f0b9b9032932069c9bd';
// const blogsDatabaseId = process.env.BLOGS_DB_ID || '39d392b168454d1a8373a5e5472bdcd2';

export interface NotionSpi {
    getPage(pageId: string): Promise<ExtendedRecordMap | undefined>;
    search(params: SearchParams): Promise<SearchResults | undefined>;
}

export class NotionService {
    constructor(private spi: NotionSpi) { }

    async getAllTags(): Promise<Tag[]> {
        try {
            const page = await this.spi.getPage(rootNotionPageId);
            console.log('page', page);
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
            const page = await this.spi.getPage(rootNotionPageId);
            console.log('page', page);
            return;
        } catch (error) {
            console.log(error);
        }
    }

    async getPostBySlug(slug: string | string[] | undefined): Promise<BlogPost | undefined> {
        console.log('slug', slug);
        try {
            const page = await this.spi.getPage(rootNotionPageId);
            console.log('page', page);
            return ;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], max: number, currentArticleSlug: string): Promise<BlogPost[] | undefined> {
        console.log('tags max currentArticleSlug', tags, max, currentArticleSlug);
        try {
            const page = await this.spi.getPage(rootNotionPageId);
            console.log('page', page);
            return;
        } catch (e) {
            console.error(e);
        }
    }
}

export const notionService = new NotionService(notionApiAdapter)