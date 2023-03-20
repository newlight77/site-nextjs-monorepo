import { NextApiRequest, NextApiResponse } from 'next'
import { notionClientService } from '../../lib/domain/notion.service';

const log = (message?: any, ...optionalParams: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
console.log(`------    notion-post-by-id ${message}`, colorfulParams);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
// const log = (message?: any, ...optionalParams: any[]) => {};

const getBlogPostById = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const id: string = req.body.id
  log('<<< getBlogPostById id', id)

  const post = await notionClientService.getPostById(id);

  log('>>> getBlogPostById id post', id, post)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(post)
}

export default getBlogPostById;