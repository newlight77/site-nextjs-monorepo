import { NextPage, NextPageContext } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Card from '../../components/card/card.component';
import Layout from '../../components/layout/layout.component';
import { BlogPost } from '../../models/blog.post';
import { MetaTags, PageType, RobotsContent } from '../../models/tags';
import { ContentfulService } from '../../service/contentful.service';


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
        <ReactMarkdown className="markdown" children={props.article.body} />
      </div>
      <div className="post__footer">
        <div className="post__suggestions">{renderCards(props.suggestedArticles)}</div>
      </div>
    </Layout>
  );
};

PostPage.getInitialProps = async ({ query }: NextPageContext) => {
  const contentfulService = new ContentfulService();
  const article: any = await contentfulService.getPostBySlug(query.slug);

  const tags = article.tags ? article.tags.map((tag: any) => tag.sys.id) : [];

  const suggestedArticles = await contentfulService.fetchSuggestions(
    tags,
    article.slug
  );

  return { article, suggestedArticles };
};

export default PostPage;