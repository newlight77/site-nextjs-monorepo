import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from './card.module.css';
import { BlogPost } from '../../models/blog.post';
import { format } from 'date-fns';

export const getNavigationLink = (id: any): string => `/post/${id}`;

export const getHref = (): string => `/post/[slug]`;

type Props = {
  info: BlogPost;
};

const Card: FunctionComponent<Props> = ({ info }) => {
  // const cardBGStyles = {
  //   backgroundImage: `url(${info.heroImage})`,
  //   background: `linear-gradient(45deg, rgba(18, 40, 76, 0.22), rgba(39, 173, 213, 0.22), rgba(79, 192, 176, 0.22)), url(${info.heroImage}) no-repeat`
  // };

  const newDate = (x: Date) => {
    if (x === undefined) { return new Date(); }
    return new Date(x);
  }

  const publishedAt = format(newDate(info.publishedAt), 'yyyy-MM-dd');

  const handleTagChosen = (tag: any) => {
    console.log('tag chosen', tag);
  };

  const renderTag = (tag: any, index: number) => (
    // <div className={styles.card__tag} key={index}>{tag}</div>
    <div
      className={`${styles.card__tag}`}
      key={index}
      onClick={() => handleTagChosen(tag.id)}
    >
      {tag.name}
    </div>

  );

  return (
    <div className={styles.card}>
      {/* <div className={styles.card__header} style={cardBGStyles} /> */}
      <Link href={getHref()} as={getNavigationLink(info.id)}>
        <div className={styles.card__image}>
            <img src={info.heroImage} alt={info.title} />
        </div>
      </Link>
      <div className={styles.card__container}>
        <div className={styles.card__header}>
          <div className={styles.card__author}>{info.author.name}</div>
          <div className={styles.card__publishedAt}>{'   '} {publishedAt}</div>
        </div>
        <Link href={getHref()} as={getNavigationLink(info.id)}>
          <div className={styles.card__body}>
            <h3 className={styles.card__title}>{info.title}</h3>
            <p className={styles.card__text}>{info.description.substring(0, 150)}</p>
          </div>
        </Link>
        <div className={styles.card__tags}>
          {/* <p className={styles.card__tags_title}>tags: </p> */}
          {info.tags.map(renderTag)}
        </div>
      </div>
    </div>
  );
};

export default Card;