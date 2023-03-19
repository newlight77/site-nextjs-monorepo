import { PostsFilter } from 'models/blog.post';
import { api, apiHost } from 'pages/api/routing';


const getBlogPosts = async ({ limit, skip, tag }: PostsFilter) => {
    const results = await fetch(`${apiHost}${api.notionPosts}`, {
        method: 'POST',
        body: JSON.stringify({ limit, skip, tag }),
        headers: {
            'content-type': 'application/json'
        }
    });

    if (!results.ok) {
        console.log('ssr-client getBlogPosts', results.json());
    }

    return results;
}

const getAllTags = async () => {
    const results = await fetch(`${apiHost}${api.notionTags}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
    });

    if (!results.ok) {
        console.log('ssr-client getAllTags', results.json());
    }

    return results;
}

const search = async (params: any) => {
    const results = await fetch(`${apiHost}${api.notionTags}`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'content-type': 'application/json'
        }
    });

    if (!results.ok) {
        console.log('ssr-client search', results.json());
    }

    return results;
}

export const ssrClient = {
    getBlogPosts,
    getAllTags,
    search
}
