import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from './card.module.css';
import { BlogPost } from '../../models/blog.post';
import { format } from 'date-fns';

export const getNavigationLink = (slug: any): string => `/post/${slug}`;

export const getHref = (): string => `/post/[slug]`;

type Props = {
  info: BlogPost;
};

const Card: FunctionComponent<Props> = ({ info }) => {
  const cardBGStyles = {
    backgroundImage: `url(${info.heroImage})`,
    background: `linear-gradient(45deg, rgba(18, 40, 76, 0.22), rgba(39, 173, 213, 0.22), rgba(79, 192, 176, 0.22)), url(${info.heroImage}) no-repeat`
  };

  const newDate = (x: Date) => {
    if (x === undefined) { return new Date(); }
    return new Date(x);
  }
  const publishedAt = format(newDate(info.publishedAt), 'yyyy-MM-dd');

  return (
    <Link href={getHref()} as={getNavigationLink(info.slug)}>
      <div className={styles.card__container}>
        {/* <div className={styles.card__header} style={cardBGStyles} /> */}
        <div className={styles.card__header}/>
          <div className={styles.card__image}>
              <img src={info.heroImage} alt={info.title} />
          </div>
        <div/>
        <div className={styles.card__body}>
          <h3 className={styles.card__title}>{info.title}</h3>
          <p className={styles.card__text}>{info.description}</p>
        </div>

        <div className={styles.card__footer}>
          <div className={styles.card__author}>{info.author.name}</div>
          <div className={styles.card__publishedAt}>{publishedAt}</div>
        </div>
      </div>
    </Link>
  );
};

export default Card;