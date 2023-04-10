import { NextPage, NextPageContext } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Card} from 'react-library';
import {Layout} from 'react-library';
import { BlogPost } from 'blog-model';
import { MetaTags, PageType, RobotsContent } from 'blog-model';
import { MarkdownSyntaxHighlighter } from '@/components/markdown/markdown-syntax-highlighter';
import { contentfulService } from '@/lib/content-service.provider';
import { notionService } from '@/lib/content-service.provider';
import { newLogger } from "logger";

const logger = newLogger("[id] page");
logger.log = logger.noOp;

type Props = {
  article: BlogPost;
  suggestedArticles: BlogPost[];
};

const renderCards = (suggestions: any) => {
  if (suggestions === undefined) return;
  return suggestions.map((suggestion: any, index: number) => (
    <Card key={index} info={suggestion} />
  ));
}

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
        <ReactMarkdown className="markdown" components={MarkdownSyntaxHighlighter}>
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
  logger.log('query.id', query);
  const id: string = typeof query.id === "string" ? query.id : '';
  const slug: string = typeof query.slug === "string" ? query.slug : '';

  logger.log('getInitialProps id slug', id, slug);
  if (!isUUID(id)) {
    const article: any = await contentfulService.getPostById(slug);
    // logger.log('getInitialProps article', article);
    const tags = article.tags ? article.tags.map((tag: any) => tag.sys.id) : [];
    logger.log('getInitialProps tags', tags);
    const suggestedArticles = await contentfulService.getSuggestions(tags, article.id, 2);
    // logger.log('getInitialProps suggestedArticles', suggestedArticles);
    return { article, suggestedArticles };
  } else {
    const article: any = await notionService.getPostById(id);
    // logger.log('getInitialProps article', article);
    const tags = article.tags ? article.tags.map((tag: any) => tag.id) : [];
    logger.log('getInitialProps tags', tags);
    const suggestedArticles = await notionService.getSuggestions(tags, article.id, 2);
    // logger.log('getInitialProps suggestedArticles', suggestedArticles);
    return { article, suggestedArticles };
  }
};

function isUUID (uuid: string ) {
  const result = uuid.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');  
  return (result !== null)
}

export default PostPage;