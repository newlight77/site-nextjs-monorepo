import { PostsFilter, PostsResult } from 'blog-model';
import React from 'react';
import {Paginator} from 'react-library';
import {Card, TagFilters} from 'react-library';


type Props = {
    postsResult: PostsResult;
    postsFilter: PostsFilter;
    range: number[];
    handleTagChosen: (tag: any) => {};
    handlePageChosen: (page: number) => {};
};

const cards = (entries: any[]) =>
    entries.map((entry, index) => <Card info={entry} key={index} />);


export const PostCardsComponent = ( { postsResult, postsFilter, range } : Props) => {

    const handleTagChosen = (tag: any) => {
        setFilter({tag: tag, page: 1, skip: 0, limit: postsFilter.limit});
    };

    const handlePageChosen = (page: number) => {
        setFilter({tag: postsFilter.tag, page: page, skip: (page - 1) * MAX_PER_PAGE, limit: postsFilter.limit});
    };
    
    return (
        <div className="blogposts__container">
            <div className="blogposts__filters">
                <TagFilters tags={postsResult.tags} updatePage={handleTagChosen} selectedTagId={postsFilter.tag} />
            </div>
            <h1 className="blogposts__header">Latest posts</h1>
            <div className="blogposts__cards">{cards(postsResult.entries)}</div>
            {/* <div>{postCards(postsFilter)}</div> */}
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

const calculateRange = (length: number) => Array.from({ length }, (v, k) => k + 1);

const getRange = (total: number, limit: number) => {
    const rangeLimit = Math.ceil(total / limit);
    return calculateRange(rangeLimit);
}
