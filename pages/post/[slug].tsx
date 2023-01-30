import { NextPage, NextPageContext } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Card from '../../components/card/card.component';
import Layout from '../../components/layout/layout.component';
import { BlogPost } from '../../models/blog.post';
import { MetaTags, PageType, RobotsContent } from '../../models/tags';
import { ContentfulService } from '../../service/contentful.service';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import rangeParser from 'parse-numeric-range'

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('scss', scss)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('json', json)

type Props = {
  article: BlogPost;
  suggestedArticles: BlogPost[];
};

type CodeBlock = {
  node: any,
  inline: any,
  className: string
}

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

  const syntaxTheme = oneDark;

  const MarkdownComponents: object = {
    code({ node, inline, className, ...props }: CodeBlock) {
      const match = /language-(\w+)/.exec(className || '')
      const hasMeta = node?.data?.meta

      const applyHighlights: object = (applyHighlights: number) => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/
          const metadata = node.data.meta?.replace(/\s/g, '')
          const strlineNumbers = RE?.test(metadata)
            ? RE?.exec(metadata)![1]
            : '0'
          const highlightLines = rangeParser(strlineNumbers)
          const highlight = highlightLines
          const data: string | null = highlight.includes(applyHighlights)
            ? 'highlight'
            : null
          return { data }
        } else {
          return {}
        }
      }

      return match ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={match[1]}
          PreTag="div"
          className="codeStyle"
          showLineNumbers={true}
          wrapLines={hasMeta ? true : false}
          useInlineStyles={true}
          lineProps={applyHighlights}
          children={node.children}
          {...props}
        />
      ) : (
        <code className={className} {...props} />
      )
    },
  }

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