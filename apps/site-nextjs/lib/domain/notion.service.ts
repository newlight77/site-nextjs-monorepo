import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post';
import { Tag } from '../../models/tags';
import { notionClientAdapter } from '../spi/notion-client-adapter';

// const log = (message?: any, ...optionalParams: any[]) => {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
//     console.log(`------    NotionService  ${message}`, colorfulParams);
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const log = (message?: any, ...optionalParams: any[]) => {};

export interface NotionSpi {
    fetchAllTags(): Promise<Tag[]>;
    fetchBlogPosts(filter: BlogPostsPaginatedFilter): Promise<BlogPostsPaginated>;
    fetchPostById(id: string): Promise<BlogPost | undefined>;
    fetchSuggestions(tags: string[], currentArticleId: string, max: number): Promise<BlogPost[] | undefined>;
    search(params: any): Promise<any | undefined>;    
    fetchUsers(): Promise<any | undefined>;
}

export class NotionService {
    constructor(private spi: NotionSpi) { }

    async getAllTags(): Promise<Tag[]> {
        try {
            const tags = await this.spi.fetchAllTags();
            log('getAllTags tags', tags);
            return tags
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getBlogPosts(
        { limit, skip, tag }: BlogPostsPaginatedFilter = {
            limit: 15,
            skip: 0,
            tag: ''
        }
    ): Promise<BlogPostsPaginated | undefined> {
        log('getBlogPosts limit skip tag', limit, skip, tag);
        try {
            const posts = await this.spi.fetchBlogPosts({ limit, skip, tag });
            log('getBlogPosts posts', posts);
            return posts;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostById(id: string): Promise<BlogPost | undefined> {
        log('getPostById id', id);
        try {
            const post = await this.spi.fetchPostById(id);
            log('getBlogPostById post', post);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], currentArticleId: string, max = 2): Promise<BlogPost[] | undefined> {
        log('getSuggestions tags currentArticleId max', tags, currentArticleId, max);
        try {
            const suggestions = await this.spi.fetchSuggestions(tags, currentArticleId, max);
            log('getSuggestions suggestions', suggestions);

            return suggestions;
        } catch (e) {
            console.error(e);
        }
    }

    async search(params: any): Promise<any | undefined> {
        try {
            const results = await this.spi.search(params);
            log('search results', results);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

}

export const notionClientService = new NotionService(notionClientAdapter)
