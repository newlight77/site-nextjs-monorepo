import { BlogPost, BlogPostsPaginated, PostsFilter } from 'blog-model';
import { api, apiHost } from 'pages/api/routing';
import { newLogger } from "logger";

const logger = newLogger();
// logger.log = logger.noOp;


const getPostById = async (id?: string): Promise<BlogPost> => {
    const post:BlogPost = await fetch(`${apiHost}${api.notionPostById}`, {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => {
        if (!res.ok) return toError(res, post);
        return res;
    })
    .then((res) => res.json());
    logger.info('ssr-client getPostById post', post);

    return post;
}

const getBlogPosts = async ({ limit, skip, tag }: PostsFilter): Promise<BlogPostsPaginated> => {
    const results:any = await fetch(`${apiHost}${api.notionPosts}`, {
        method: 'POST',
        body: JSON.stringify({ limit, skip, tag }),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => {
        if (!res.ok) return toError(res, results);
        return res;
    })
    .then((res) => res.json());
    logger.info('ssr-client getBlogPosts results', results);
    return results;
}

const getAllTags = async () => {
    const results: any = await fetch(`${apiHost}${api.notionTags}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => {
        if (!res.ok) return toError(res, results);
        return res;
    })
    .then((res) => res.json());
    logger.info('ssr-client getAllTags results', results);

    return results;
}

const search = async (params: any) => {
    const results: any = await fetch(`${apiHost}${api.notionTags}`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => {
        if (!res.ok) return toError(res, results);
        return res;
    })
    .then((res) => res.json());
    logger.info('ssr-client search results', results);

    return results;
}

const getSuggestions = async (tags: string[], currentArticleId: string, max: number): Promise<BlogPostsPaginated> => {
    const results:any = await fetch(`${apiHost}${api.notionPosts}`, {
        method: 'POST',
        body: JSON.stringify({ tags, currentArticleId, max }),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => {
        if (!res.ok) return toError(res, results);
        return res;
    })
    .then((res) => res.json());

    return results;
}

function toError(res: Response, results: any) {
    // convert non-2xx HTTP responses into errors
    const error: any = new Error(res.statusText);
    error.response = res;
    logger.error('ssr-client error', error, results.json());
    return Promise.reject(error);
}

export const ssrClient = {
    getPostById,
    getBlogPosts,
    getAllTags,
    search,
    getSuggestions
}
