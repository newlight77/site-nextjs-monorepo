import { BlogContentService } from 'blog-content-service';
import { blogContentfulAdapter } from 'contentful-adapter';
import { blogNotionAdapter, notionAdapter } from 'notion-adapter';

export const contentfulService = new BlogContentService(blogContentfulAdapter, notionAdapter);
export const notionService = new BlogContentService(blogNotionAdapter, notionAdapter);
