import { BlogContentService } from 'blog-content-service';
import { blogContentContentfulAdapter } from 'contentful-adapter';
import { blogContentNotionAdapter } from 'notion-adapter';

export const contentfulService = new BlogContentService(blogContentContentfulAdapter);
export const notionService = new BlogContentService(blogContentNotionAdapter);
