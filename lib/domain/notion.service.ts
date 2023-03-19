import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post';
import { Tag } from '../../models/tags';
import { notionClientAdapter } from '../spi/notion-client-adapter';

const log = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
    console.log(message, colorfulParams);
};

export interface NotionSpi {
    getUsers(): Promise<any | undefined>;
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
            log('======    NotionService search results', results);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async getAllTags(): Promise<Tag[]> {
        try {
            const dbMeta = await this.spi.getDatabaseMeta();
            log('======    NotionService getAllTags dbMeta', dbMeta);


            type Property = [ propertyName: string, propertyValue: any ];

            const tags = Object.entries(dbMeta.properties)
            .filter(([propertyName, ]: Property) => propertyName === 'Tags')
            .flatMap(([ , propertyValue]: Property) => {
                return propertyValue.multi_select.options
            });

            log('======    NotionClientAdapter getAllTags tags', tags);

            return tags;
        } catch (error) {
            console.error(error);
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
        log('======    NotionService getBlogPosts limit skip tag', limit, skip, tag);
        try {
            const database = await this.spi.getDatabase();
            log('======    NotionService getBlogPosts database', database);
            
            return;
        } catch (error) {
            console.error(error);
        }
    }

    async getPostBySlug(slug: string | string[] | undefined): Promise<BlogPost | undefined> {
        log('======    NotionService getPostBySlug slug', slug);
        try {
            return ;
        } catch (error) {
            console.error(error);
        }
    }

    async getSuggestions(tags: string[], max: number, currentArticleSlug: string): Promise<BlogPost[] | undefined> {
        log('======    NotionService getSuggestions tags max currentArticleSlug', tags, max, currentArticleSlug);
        try {
            return;
        } catch (e) {
            console.error(e);
        }
    }
}

export const notionClientService = new NotionService(notionClientAdapter)
