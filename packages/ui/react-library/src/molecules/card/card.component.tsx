import React, { FunctionComponent } from 'react';
import { BlogPost } from 'blog-model';
import { format } from 'date-fns';
import './card.module.css';


export const getHref = (): string => `/post/[slug]`;

type Props = {
  info: BlogPost;
};

export const Card: FunctionComponent<Props> = ({ info }) => {
  // const cardBGStyles = {
  //   backgroundImage: `url(${info.heroImage})`,
  //   background: `linear-gradient(45deg, rgba(18, 40, 76, 0.22), rgba(39, 173, 213, 0.22), rgba(79, 192, 176, 0.22)), url(${info.heroImage}) no-repeat`
  // };

  const newDate = (x: Date) => {
    if (x === undefined) { return new Date(); }
    return new Date(x);
  }

  const publishedAt = format(newDate(info.publishedAt), 'yyyy-MM-dd');

  const renderTag = (tag: any, index: number) => (
    // <div className="card__tag} key={index}>{tag}</div>
    <div
      className="card__tag"
      key={index}
    >
      {tag.name}
    </div>

  );

  const getNavigationLink = (): string => `/post/${info.id}?slug=${info.slug}`;

  return (
    <div className="card">
      {/* <div className="card__header} style={cardBGStyles} /> */}
      <a className="card__image" href={getNavigationLink()}>
        <img src={info.heroImage} alt={info.title} />
      </a>
      <div className="card__container">
        <div className="card__header">
          <div className="card__author">{info.author.name}</div>
          <div className="card__publishedAt">{publishedAt}</div>
        </div>
        <a className="card__body" href={getNavigationLink()}>
          <h3 className="card__title">{info.title}</h3>
          <p className="card__text">{info.description.substring(0, 150)}</p>
        </a>
        {/* <div className="card__spacer"></div> */}
        <div className="card__tags">
          {/* <p className="card__tags_title">tags: </p> */}
          {info.tags.map(renderTag)}
        </div>
      </div>
    </div>
  );
};
