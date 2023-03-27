import React from 'react';
import './tags.module.css';
import { Tag } from 'blog-model';

export const Tags = ({tags, removeTag}: {tags: Tag[], removeTag: Function}) => {
  (
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
              {tag}
            </div>
          );
        })
      }
    </div>
  );
}
