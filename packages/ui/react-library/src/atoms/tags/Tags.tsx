import React from 'react';
import './tags.module.css';
import { Tag } from 'blog-model';

type TagsProps = {
  tags: Tag[],
  removeTag: any
}

export const Tags: React.FC<TagsProps> = ({tags, removeTag}: TagsProps) => {
  return (
    <div className="search__tags">
      {
        tags.map((tag, index) => {
          const tagStyle = {
            background: tag.color,
          }        
          return (
            <div
              style={tagStyle}
              onClick={() => removeTag(tag)}
              key={index}
              className="search__tags__tag"
            >
              {tag.name}
            </div>
          );
        })
      }
    </div>
  );
};
