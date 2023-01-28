import { Author } from './author';

export type BlogPost = {
    title: string;
    slug: string;
    heroImage: any;
    description: string;
    body: any;
    author: Author;
    publishDate: Date;
};

export type PostsFilter = {
    tag: string;
    page?: number;
    skip: number;
    limit: number;
};

export type PostsResult = {
    entries: BlogPost[];
    tags: { id: string; name: string }[];
    total: number;
    page?: number;
    skip: number;
    limit: number;
};