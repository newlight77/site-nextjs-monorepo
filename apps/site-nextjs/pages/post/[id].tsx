import { NextPage, NextPageContext } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Card from '../../components/card/card.component';
import Layout from '../../components/layout/layout.component';
import { BlogPost } from '../../models/blog.post';
import { MetaTags, PageType, RobotsContent } from '../../models/tags';
import MarkdownComponents from '../../components/markdown/markdown-syntax-highlighter';
import { contentfulService } from '@/lib/domain/contentful.service';
import { ssrClient } from 'pages/api/ssr-client';

type Props = {
  article: BlogPost;
  suggestedArticles: BlogPost[];
};

const renderCards = (suggestions: any) =>
  suggestions.map((suggestion: any, index: number) => (
    <Card key={index} info={suggestion} />
  ));

const PostPage: NextPage<Props, any> = (props: Props) => {
  const postMetaTags: MetaTags = {
    canonical: `${process.env.DOMAIN_PUBLIC}`,
    description: `${props.article.description}`,
    // contentful does not set the http or https before an image link, so we need to add it ourselves
    image: `https:${props.article.heroImage.url}`,
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `${props.article.title}`,
    type: PageType.article
  };


  return (
    <Layout metaTags={postMetaTags}>
      <div className="post__container" id="postcontainer">
        <div className="post__header">
          <h1>{props.article.title}</h1>
          <div className="post__author">
            <p>Written by {props.article.author.name}</p>
          </div>
        </div>
      </div>
      <div className="post__body">
        {/* <ReactMarkdown className="markdown" children={props.article.body} /> */}
        <ReactMarkdown className="markdown" components={MarkdownComponents}>
          {props.article.body}
        </ReactMarkdown>
      </div>
      <div className="post__footer">
        <h2 className="post__suggestions_title">Related articles : </h2>
        <div className="post__suggestions">{renderCards(props.suggestedArticles)}</div>
      </div>
    </Layout>
  );
};

PostPage.getInitialProps = async ({ query }: NextPageContext) => {
  console.log('query.id', query);
  const id: string = typeof query.id === "string" ? query.id : '';
  const slug: string = typeof query.slug === "string" ? query.slug : '';

  if (isContentful(id)) {
    console.log('getInitialProps id slug', id, slug);
    const article: any = await contentfulService.getPostById(slug);
    console.log('getInitialProps article', article);
    const tags = article.tags ? article.tags.map((tag: any) => tag.id) : [];
    console.log('getInitialProps tags', tags);
    const suggestedArticles = await contentfulService.getSuggestions(tags, article.id, 2);
    return { article, suggestedArticles };
  } else {
    console.log('getInitialProps id slug', id, slug);
    const article: any = await ssrClient.getPostById(id);
    console.log('getInitialProps article', article);
    const tags = article.tags ? article.tags.map((tag: any) => tag.id) : [];
    console.log('getInitialProps tags', tags);
    const suggestedArticles = await contentfulService.getSuggestions(tags, article.id, 2);
    return { article, suggestedArticles };

  }
  
  // const service = id.length == 22 ? contentfulService: ssrClient;
  // console.log('getInitialProps id slug', id, slug);

  // const article: any = await service.getPostById(slug);
  // console.log('getInitialProps article', article);

  // const tags = article.tags ? article.tags.map((tag: any) => tag.id) : [];
  // console.log('getInitialProps tags', tags);
  // const suggestedArticles = await service.getSuggestions(tags, 2, article.id);
  // return { article, suggestedArticles };
};

const isContentful = (id: string): boolean => {
  if (id.length >= 32) {
    return false;
  }
  return true;
}

export default PostPage;