import React, { FunctionComponent } from 'react';
import './tag-filter.module.css';

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
      className={`tag ${selectedTagId === '' || selectedTagId === tag.id ? 'tag__selected' : ''}`}
      key={index}
      onClick={() => handleTagChosen(tag.id)}
    >
      {tag.name}
    </div>
  );

  return (
    <div className="filters">
      <h2 className="filters__header">Filters : </h2>
      <div className="filters__tags">
        <div
          className={`tag ${selectedTagId === '' ? 'tag__selected' : 'global-tag'}`}
          onClick={() => handleTagChosen('')}
        >
          All
        </div>
        {tags.map(renderTag)}
      </div>
    </div>
  );
};
