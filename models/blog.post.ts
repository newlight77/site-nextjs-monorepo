import { Author } from './author';

export type BlogPost = {
    id: string;
    slug: string;
    body: any;
    title: string;
    description: string;
    tags: { id: string; name: string }[];
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
    tags: { id: string; name: string }[];
    total: number;
    page?: number;
    skip: number;
    limit: number;
};