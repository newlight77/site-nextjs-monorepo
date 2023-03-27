import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import Layout from '../../components/layout/layout.component';
import Card from '../../components/card/card.component';
import Paginator from '../../components/paginator/paginator.component';
import { defaultMetaTags } from 'blog-model';
import TagFilters from '../../components/tag-filter/tag-filter.component';
import { PostsFilter, PostsResult } from 'blog-model';
import { ssrClient } from 'pages/api/ssr-client';
import { contentfulService } from '@/lib/content-service.provider';
import { logger } from "logger";

logger.log = logger.log_;

const MAX_PER_PAGE = 10;

const cards = (entries: any[]) =>
  entries.map((entry, index) => <Card info={entry} key={index} />);


const PostsPage: NextPage<PostsFilter, any> = (filter: PostsFilter) => {
  const router = useRouter();

  const initResults: PostsResult = {
    entries: [],
    tags: [],
    total: 0,
  };

  const [postsFilter, setFilter] = useState(filter);
  const [postsResult, setResults] = useState(initResults);

  useEffect(() => {
    getBlogPostEntries(postsFilter).then((results => setResults(results)));
    void router.push({ pathname: '/', query: { page: postsFilter.page, tag: postsFilter.tag } });
  }, [postsFilter]);

  const handleTagChosen = (tag: any) => {
    setFilter({tag: tag, page: 1, skip: 0, limit: postsFilter.limit});
  };

  const handlePageChosen = (page: number) => {
    setFilter({tag: postsFilter.tag, page: page, skip: (page - 1) * MAX_PER_PAGE, limit: postsFilter.limit});
  };

  const range = getRange(postsResult.total, filter.limit);

  return (
    <Layout metaTags={defaultMetaTags}>
      <div className="blogposts_container">
          <div className="blogposts__filters">
            <TagFilters tags={postsResult.tags} updatePage={handleTagChosen} selectedTagId={postsFilter.tag}/>
          </div>
          <h1 className="blogposts__header">Latest posts</h1>
          <div className="blogposts__cards">{cards(postsResult.entries)}</div>
          <div className="blogposts__pagination">
            <Paginator
              handlePaginationChange={(event) => handlePageChosen(event)}
              range={range}
              skip={postsFilter.page ? postsFilter.page : 1}
            />
          </div>
        </div>
    </Layout>
  );
};

const calculateRange = (length: number) => Array.from({ length }, (v, k) => k + 1);

const getRange = (total: number, limit: number) => {
  const rangeLimit = Math.ceil(total / limit);
  return calculateRange(rangeLimit);
}

const getBlogPostEntries = async( filter: PostsFilter ): Promise<PostsResult> => {
  const posts = await contentfulService.getBlogPosts({
      tag: filter.tag,
      skip: filter.skip,
      limit: filter.limit
    });
  const tags = await contentfulService.getAllTags();
  
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

  const results = { entries : posts.entries, tags, total: posts.total };
  logger.log('======    Posts.tsx getAllTags results', results);

  return results;
}

export const toFilter = async (tag: string, page: number): Promise<PostsFilter> => {
  return {
    tag: tag,
    page: page,
    skip: (page - 1) * MAX_PER_PAGE,
    limit: MAX_PER_PAGE
  };
};

export default PostsPage;