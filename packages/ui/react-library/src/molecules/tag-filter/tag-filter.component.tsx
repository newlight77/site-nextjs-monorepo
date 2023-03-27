import React, { FunctionComponent } from 'react';

import styles from './tag-filter.module.css';

type Props = {
  tags: { id: string; name: string }[];
  selectedTagId: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  updatePage: Function;
};

export const TagFilters: FunctionComponent<Props> = ({
  tags,
  updatePage,
  selectedTagId
}) => {
  const handleTagChosen = (tag: any) => {
    updatePage(tag);
  };

  const renderTag = (tag: any, index: number) => (
    <div
      className={`${styles.tag} ${selectedTagId === '' || selectedTagId === tag.id ? styles.tag__selected : ''}`}
      key={index}
      onClick={() => handleTagChosen(tag.id)}
    >
      {tag.name}
    </div>
  );

  return (
    <div className={styles.filters}>
      <h2 className={styles.filters__header}>Filters : </h2>
      <div className={styles.filters__tags}>
        <div
          className={`${selectedTagId === '' ? styles.tag__selected : 'global-tag'} ${styles.tag} `}
          onClick={() => handleTagChosen('')}
        >
          All
        </div>
        {tags.map(renderTag)}
      </div>
    </div>
  );
};
