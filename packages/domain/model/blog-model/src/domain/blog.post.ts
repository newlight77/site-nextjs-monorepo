import { Author } from './author';
import { Tag } from './tags';

export type BlogPost = {
    id: string;
    slug: string;
    body: any;
    title: string;
    description: string;
    tags: Tag[];
    heroImage: any;
    author: Author;
    publishedAt: Date;
};

export type PostsFilter = {
    tag: string;
    page?: number;
    skip: number;
    limit: number;
};

export type PostsResult = {
    entries: BlogPost[];
    tags: Tag[];
    total: number;
};

export type BlogPostsPaginatedFilter = {
    limit?: number, 
    skip?: number, 
    tag?: string
}

export type BlogPosts = {
    entries: BlogPost[], 
    total: number, 
}
