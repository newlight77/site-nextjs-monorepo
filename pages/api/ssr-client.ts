import { api, apiHost } from 'pages/api/routing';


const getPage = async (pageId?: string) => {
    const pageResult = await fetch(`${apiHost}${api.notionPage}`, {
        method: 'POST',
        body: JSON.stringify({pageId}),
        headers: {
            'content-type': 'application/json'
        }
    });

    if (!pageResult.ok) {
        console.log('ssr-client getPage', pageResult.json());
    }

    return pageResult;
}

export const ssrClient = {
    getPage
}
