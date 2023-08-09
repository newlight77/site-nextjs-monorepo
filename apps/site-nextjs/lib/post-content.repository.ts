import { PostsFilter, PostsResult } from 'blog-model';
import { ssrClient } from 'pages/api/ssr-client';
import { contentfulServiceProvider } from '@/lib/content-service.provider';
import { newLogger } from "logger";

const logger = newLogger("posts page");
logger.log = logger.noOp;

export const getBlogPostEntries = async (filter: PostsFilter): Promise<PostsResult> => {
    const posts = await contentfulServiceProvider.getBlogPosts({
        tag: filter.tag,
        skip: filter.skip,
        limit: filter.limit
    });
    const tags = await contentfulServiceProvider.getAllTags();

    if (posts === undefined) return { entries: [], tags, total: 0 };

    if (posts.entries.length < filter.limit) {
        const notionPosts = await ssrClient.getBlogPosts({
            tag: filter.tag,
            skip: filter.skip,
            limit: filter.limit
        });
        posts.entries.push(...notionPosts.entries);
        // const posts = [...contentfulPosts.entries, ...notionPost.entries];

        const notionTags = await ssrClient.getAllTags();
        tags.push(...notionTags);
        // const tags = [ ...contentfulTags, ...notionTags ];
    }

    logger.log('======    Posts.tsx getAllTags posts', posts);
    logger.log('======    Posts.tsx getAllTags tags', tags);

    const results = { entries: posts.entries, tags, total: posts.total };
    logger.log('======    Posts.tsx getAllTags results', results);

    return results;
}