import { BlogPost, BlogPosts, PostsFilter } from 'blog-model';
import { api } from 'pages/api/routing';
import { newLogger } from "logger";

const logger = newLogger("ssr-client");
logger.log = logger.noOp;


const getPostById = async (id?: string): Promise<BlogPost> => {
    logger.info('ssr-client getPostById id', id);
    const post:any = await fetch(`${api.notionPostById}`, {
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

const getBlogPosts = async ({ limit, skip, tag }: PostsFilter): Promise<BlogPosts> => {
    const results:any = await fetch(`${api.notionPosts}`, {
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
    const results: any = await fetch(`${api.notionTags}`, {
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

const getSuggestions = async (tags: string[], currentArticleId: string, max: number): Promise<BlogPosts> => {
    const results:any = await fetch(`${api.notionPosts}`, {
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
    getSuggestions
}
