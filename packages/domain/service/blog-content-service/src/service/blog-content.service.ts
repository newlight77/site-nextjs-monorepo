import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from 'blog-model';
import { Tag } from 'blog-model';
import { newLogger } from "logger";

const logger = newLogger();
logger.log = logger.noOp;

export interface BlogContentSpi {
    fetchAllTags(): Promise<Tag[]>;
    fetchBlogPosts(filter: BlogPostsPaginatedFilter): Promise<BlogPostsPaginated>;
    fetchPostById(id: string): Promise<BlogPost | undefined>;
    fetchSuggestions(tags: string[], currentArticleId: string, max: number): Promise<BlogPost[] | undefined>;
    search(params: any): Promise<any | undefined>;    
    fetchUsers(): Promise<any | undefined>;
}

export class BlogContentService {
    constructor(private spi: BlogContentSpi) { }

    async getAllTags(): Promise<Tag[]> {
        try {
            const tags = await this.spi.fetchAllTags();
            logger.log('getAllTags tags', tags);
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
        logger.log('getBlogPosts limit skip tag', limit, skip, tag);
        try {
            const posts = await this.spi.fetchBlogPosts({ limit, skip, tag });
            logger.log('getBlogPosts posts', posts);
            return posts;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostById(id: string): Promise<BlogPost | undefined> {
        logger.log('getPostById id', id);
        try {
            const post = await this.spi.fetchPostById(id);
            logger.log('getBlogPostById post', post);
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], currentArticleId: string, max = 2): Promise<BlogPost[] | undefined> {
        logger.log('getSuggestions tags currentArticleId max', tags, currentArticleId, max);
        try {
            const suggestions = await this.spi.fetchSuggestions(tags, currentArticleId, max);
            logger.log('getSuggestions suggestions', suggestions);

            return suggestions;
        } catch (e) {
            console.error(e);
        }
    }

    async search(params: any): Promise<any | undefined> {
        try {
            const results = await this.spi.search(params);
            logger.log('search results', results);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

}
