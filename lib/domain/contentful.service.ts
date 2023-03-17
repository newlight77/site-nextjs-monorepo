import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post'
import { Tag } from '../../models/tags';

export const CONTENT_TYPE_BLOGPOST = 'blogPost'
export const CONTENT_TYPE_PERSON = 'author'
export const CONTENT_TYPE_TAGS = 'tag'

export interface ContentfulSpi {
  fetchAllTags(): Promise<Tag[]>;
  fetchBlogPosts(filter: BlogPostsPaginatedFilter): Promise<BlogPostsPaginated>;
  fetchPostBySlug(slug: string | string[] | undefined): Promise<BlogPost | undefined>;
  fetchSuggestions(tags: string[], max: number, currentArticleSlug: string): Promise<BlogPost[] | undefined>;
}

export class ContentfulService {

  constructor(private spi: ContentfulSpi) {}

  async getAllTags(): Promise<Tag[]> {
    try {
      return await this.spi.fetchAllTags();
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
    try {
      return await this.spi.fetchBlogPosts({ limit, skip, tag });
    } catch (error) {
      console.log(error);
    }
  }

  async getPostBySlug(slug: string | string[] | undefined): Promise<BlogPost | undefined> {
    try {
      return await this.spi.fetchPostBySlug(slug)
    } catch (error) {
      console.error(error);
    }
  }

  async getSuggestions(tags: string[], max: number, currentArticleSlug: string): Promise<BlogPost[] | undefined> {
    try {
      return await this.spi.fetchSuggestions(tags, max, currentArticleSlug)
    } catch (e) {
      console.error(e);
    }
  }
}