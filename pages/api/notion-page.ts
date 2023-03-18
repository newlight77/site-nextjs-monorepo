import { NextApiRequest, NextApiResponse } from 'next'
// import { notionApiService, notionClientService } from '../../lib/domain/notion.service';

const getPage = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const pageId: string | undefined = req.body.pageId ? req.body.pageId : undefined

  fetchPage(pageId);

  // console.log('<<< lambda page')
  // const page = await notionApiService.getPage(pageId);
  // console.log('>>> notion-page notionApiService', page)

  // const page2 = await notionClientService.getPage(pageId);
  // console.log('>>> notion-page notionClientService', page2)


  // res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  // )
  // res.status(200).json(page)
}

const fetchPage = async (pageId?: string) => {
  // const result = await fetch(`https://api.notion.com/v1/pages/${pageId ? pageId : 'fbad63643b7447c1a27d19bcf9f02331'}`);
  const result = await fetch(`https://api.notion.com/v1/pages/${pageId ? pageId : 'fbad63643b7447c1a27d19bcf9f02331'}`, {
      method: 'GET',
      headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer secret_jEpthR4bHr0e4ZhM1JXidqO16Lpv9l5FWZ0ORuiwqWb'
      }
  });
  const posts = await result.json();

  console.log('NotionClientAdapter getPage fetch', pageId, posts);
  return posts;
}

export default getPage;