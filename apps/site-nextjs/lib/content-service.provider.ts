import { BlogContentService } from 'blog-content-service';
import { blogContentfulAdapter } from 'contentful-adapter';
import { blogNotionAdapter, notionAdapter } from 'notion-adapter';

export const contentfulServiceProvider = new BlogContentService(blogContentfulAdapter, notionAdapter);
export const notionServiceProvider = new BlogContentService(blogNotionAdapter, notionAdapter);
