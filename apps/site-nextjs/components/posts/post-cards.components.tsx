import { PostsFilter, PostsResult } from 'blog-model';
import React from 'react';
import {Paginator} from 'react-library';
import {Card, TagFilters} from 'react-library';


type Props = {
    postsResult: PostsResult;
    postsFilter: PostsFilter;
    range: number[];
    handleTagChosen: (tag: any) => void;
    handlePageChosen: (page: number) => void;
};

const cards = (entries: any[]) =>
    entries.map((entry, index) => <Card info={entry} key={index} />);


export const PostCardsComponent = ({ postsResult, postsFilter, range, handleTagChosen, handlePageChosen }: Props) => {
    return (
        <div className="blogposts__container">
            <div className="blogposts__filters">
                <TagFilters tags={postsResult.tags} updatePage={handleTagChosen} selectedTagId={postsFilter.tag} />
            </div>
            <h1 className="blogposts__header">Latest posts</h1>
            <div className="blogposts__cards">{cards(postsResult.entries)}</div>
            <div className="blogposts__pagination">
                <Paginator
                    handlePaginationChange={(event) => handlePageChosen(event)}
                    range={range}
                    skip={postsFilter.page ? postsFilter.page : 1}
                />
            </div>
        </div>
    );
};
