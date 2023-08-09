import React from 'react';

import { NextPage } from 'next';
import { PostsFilter } from 'blog-model';
import PostsPage, { MAX_PER_PAGE } from './posts';

const IndexPage: NextPage<PostsFilter, any> = (props: PostsFilter) => {
  return (
    <PostsPage {...props}/>
  );
};

IndexPage.getInitialProps = async ({ query }): Promise<PostsFilter> => {
  let page = 1;
  if (query.page) {
    page = parseInt(query.page + '');
  }

  const tag = query.tag ? query.tag.toString() : ''

  return toFilter(tag, page);
};


export const toFilter = async (tag: string, page: number): Promise<PostsFilter> => {
  return {
    tag: tag,
    page: page,
    skip: (page - 1) * MAX_PER_PAGE,
    limit: MAX_PER_PAGE
  };
};

export default IndexPage;