import React, { useEffect, useState} from 'react';
import {Card} from 'react-library';
import { BlogPosts, PostsFilter, Tag } from 'blog-model';
import { contentfulServiceProvider } from '@/lib/content-service.provider';
import { ssrClient } from 'pages/api/ssr-client';
import { getBlogPostEntries } from '@/lib/post-content.repository';


const cards = (entries: any[]) =>
    entries.map((entry, index) => <Card info={entry} key={index} />);


export const PostCards = ( filter: PostsFilter ) => {
    const [posts, setPosts] = useState<BlogPosts>({total:0, entries: []});
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const fetchPosts = async (filter: PostsFilter) => {
            setIsLoading(true);
                
            try {
                const results = await getBlogPostEntries(filter);
                setPosts({total: results.total, entries: results.entries});
                setTags(results.tags);

                const postData = await contentfulServiceProvider.getBlogPosts({
                    tag: filter.tag,
                    skip: filter.skip,
                    limit: filter.limit
                });
                const tagData = await contentfulServiceProvider.getAllTags();
                if (postData === undefined) return { entries: [], tags, total: 0 };

                if (postData.entries.length < filter.limit) {
                    const notionPosts = await ssrClient.getBlogPosts({
                        tag: filter.tag,
                        skip: filter.skip,
                        limit: filter.limit
                    });
                    postData.entries.push(...notionPosts.entries);
                    // const posts = [...contentfulPosts.entries, ...notionPost.entries];
                
                    const notionTags = await ssrClient.getAllTags();
                    tagData.push(...notionTags);
                    // const tags = [ ...contentfulTags, ...notionTags ];
                }

                setPosts(postData);
                setTags(tagData);

            } catch (error: any) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts(filter);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const results = { entries : posts.entries, tags, total: posts.total };

    return <div className="blogposts__cards">{cards(results.entries)}</div>;
}
