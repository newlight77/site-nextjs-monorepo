import { BlogContentService } from 'blog-content-service';
import { blogContentContentfulAdapter } from 'blog-content-contentful-adapter';
import { blogContentNotionAdapter } from 'blog-content-notion-adapter';

export const contentfulService = new BlogContentService(blogContentContentfulAdapter);
export const notionService = new BlogContentService(blogContentNotionAdapter);
