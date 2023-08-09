import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import {Layout} from 'react-library';
import {Card} from 'react-library';
import {Paginator} from 'react-library';
import { defaultMetaTags } from 'blog-model';
import {TagFilters} from 'react-library';
import { PostsFilter, PostsResult } from 'blog-model';
import { getBlogPostEntries } from '@/lib/post-content.repository';
import { newLogger } from "logger";

const logger = newLogger("posts page");
logger.log = logger.noOp;

export const MAX_PER_PAGE = 10;

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
      <div className="blogposts__container">
          <div className="blogposts__filters">
            <TagFilters tags={postsResult.tags} updatePage={handleTagChosen} selectedTagId={postsFilter.tag}/>
          </div>
          <h1 className="blogposts__header">Latest posts</h1>
          <div className="blogposts__cards">{cards(postsResult.entries)}</div>
          {/* <div>{postCards(postsFilter)}</div> */}
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


export default PostsPage;