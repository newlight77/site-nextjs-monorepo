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

type Property = [ propertyName: string, propertyValue: any ];

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
            // log('======    NotionService getAllTags dbMeta', dbMeta);

            const tags = Object.entries(dbMeta.properties)
            .filter(([propertyName, ]: Property) => propertyName === 'Tags')
            .flatMap(([ , propertyValue]: Property) => {
                return propertyValue.multi_select.options
            });
            // log('======    NotionClientAdapter getAllTags tags', tags);

            return tags;
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
        log('======    NotionService getBlogPosts limit skip tag', limit, skip, tag);
        try {
            const database = await this.spi.getDatabase();
            log('======    NotionService getBlogPosts database', database);

            const posts: BlogPost[] = Object.entries(database.results)
            .flatMap(([ , propertyValue]: Property) => {
                log('======    NotionClientAdapter getBlogPost propertyName propertyValue', propertyValue )
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
                }
            });
            log('======    NotionClientAdapter getBlogPosts posts', posts);

            return {
                entries: posts,
                total: posts.length,
                limit: 15,
                skip: database.results.next_cursor
            };
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
