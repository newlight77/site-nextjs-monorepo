import { BlogContentService } from 'blog-content-service';
import { blogContentContentfulAdapter } from 'contentful-adapter';
import { blogContentNotionAdapter, notionAdapter } from 'notion-adapter';

export const contentfulService = new BlogContentService(blogContentContentfulAdapter, notionAdapter);
export const notionService = new BlogContentService(blogContentNotionAdapter, notionAdapter);
