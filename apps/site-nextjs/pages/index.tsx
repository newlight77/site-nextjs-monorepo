import React from 'react';

import { NextPage } from 'next';
import { PostsFilter } from '../models/blog.post';
import PostsPage, { toFilter } from './post/posts';


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


export default IndexPage;