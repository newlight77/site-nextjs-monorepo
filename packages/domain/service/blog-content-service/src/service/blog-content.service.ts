import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from 'blog-model';
import { Tag } from 'blog-model';
import { LinkedBlock } from "notion-model"
import { markdownMarshaller } from 'markdown-library';
import { newLogger } from "logger";

const logger = newLogger("BlogContentService");
logger.log = logger.noOp;

export interface BlogContentSpi {
    fetchAllTags(): Promise<Tag[]>;
    fetchBlogPosts(filter: BlogPostsPaginatedFilter): Promise<BlogPostsPaginated>;
    fetchPostById(id: string): Promise<BlogPost | undefined>;
    fetchSuggestions(tags: string[], currentArticleId: string, max: number): Promise<BlogPost[] | undefined>;
    search(params: any): Promise<any | undefined>;
}

export interface NotionContentSpi {
    fetchBlock (rootBlockId: string, totalBlocks?: number, level?: number): Promise<LinkedBlock>;
}

export class BlogContentService {
    constructor(
        private blogContentSpi: BlogContentSpi,
        private notionSpi: NotionContentSpi) { }

    async getAllTags(): Promise<Tag[]> {
        try {
            const tags = await this.blogContentSpi.fetchAllTags();
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
            const posts = await this.blogContentSpi.fetchBlogPosts({ limit, skip, tag });
            return posts;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostById(id: string): Promise<BlogPost | undefined> {
        logger.log('getPostById id', id);
        try {
            const post = await this.blogContentSpi.fetchPostById(id);

            const block = await this.notionSpi.fetchBlock(id);
            logger.log('getPostById blocks', block);

            if (post && post.body === '') {
                post.body = toMarkdown(block);
            }
        
            return post;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], currentArticleId: string, max = 2): Promise<BlogPost[] | undefined> {
        logger.log('getSuggestions tags currentArticleId max', tags, currentArticleId, max);
        try {
            const suggestions = await this.blogContentSpi.fetchSuggestions(tags, currentArticleId, max);

            return suggestions;
        } catch (e) {
            console.error(e);
        }
    }

    async search(params: any): Promise<any | undefined> {
        try {
            const results = await this.blogContentSpi.search(params);
            return results;
        } catch (error) {
            console.error(error);
        }
    }
}

const toMarkdown = (blocks: LinkedBlock): string => {
    logger.log('toMarkdown blocks', blocks);
    return markdownMarshaller.toMarkdown(blocks);
}
