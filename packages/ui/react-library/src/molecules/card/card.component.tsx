import React, { FunctionComponent } from 'react';
import styles from './card.module.css';
import { BlogPost } from 'blog-model';
import { format } from 'date-fns';


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
    // <div className={styles.card__tag} key={index}>{tag}</div>
    <div
      className={`${styles.card__tag}`}
      key={index}
    >
      {tag.name}
    </div>

  );

  const getNavigationLink = (): string => `/post/${info.id}?slug=${info.slug}`;

  return (
    <div className={styles.card}>
      {/* <div className={styles.card__header} style={cardBGStyles} /> */}
      <a href={getNavigationLink()}>
        <div className={styles.card__image}>
            <img src={info.heroImage} alt={info.title} />
        </div>
      </a>
      <div className={styles.card__container}>
        <div className={styles.card__header}>
          <div className={styles.card__author}>{info.author.name}</div>
          <div className={styles.card__publishedAt}>{'   '} {publishedAt}</div>
        </div>
        <a href={getNavigationLink()}>
          <div className={styles.card__body}>
            <h3 className={styles.card__title}>{info.title}</h3>
            <p className={styles.card__text}>{info.description.substring(0, 150)}</p>
          </div>
        </a>
        <div className={styles.card__tags}>
          {/* <p className={styles.card__tags_title}>tags: </p> */}
          {info.tags.map(renderTag)}
        </div>
      </div>
    </div>
  );
};
