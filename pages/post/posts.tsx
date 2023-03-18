import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import Layout from '../../components/layout/layout.component';
import Card from '../../components/card/card.component';
import Paginator from '../../components/paginator/paginator.component';
import { defaultMetaTags } from '../../models/tags';
import { ContentfulService } from '../../lib/domain/contentful.service';
import TagFilters from '../../components/tag-filter/tag-filter.component';
import { PostsFilter, PostsResult } from '../../models/blog.post';
import { contentfulAdapter } from '../../lib/spi/contentful-adapter';
import { ssrClient } from 'pages/ssr-client';

const MAX_PER_PAGE = 15;

const cards = (entries: any[]) =>
  entries.map((entry, index) => <Card info={entry} key={index} />);

const contentfulService = new ContentfulService(contentfulAdapter);

const PostsPage: NextPage<PostsFilter, any> = (filter: PostsFilter) => {
  const router = useRouter();

  const initResults: PostsResult = {
    entries: [],
    tags: [],
    total: 0,
    skip: 0,
    limit: 0
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

  const range = getRange(postsResult.total, postsResult.limit);

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
  const { entries, total, skip, limit }: any = 
  await contentfulService.getBlogPosts({
    tag: filter.tag,
    skip: filter.skip,
    limit: filter.limit
  });

  const tags = await contentfulService.getAllTags();

  ssrClient.getPage();

  return { entries, tags, total, page: filter.page, skip, limit };
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