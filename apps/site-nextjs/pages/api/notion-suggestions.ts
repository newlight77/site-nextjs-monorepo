import { NextApiRequest, NextApiResponse } from 'next'
import { notionClientService } from '../../lib/domain/notion.service';

const log = (message?: any, ...optionalParams: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
console.log(`------    notion-suggestions ${message}`, colorfulParams);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
// const log = (message?: any, ...optionalParams: any[]) => {};

const getSuggestions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const tags: string[] = req.body.tags ? req.body.tags : undefined;
  const currentArticleId: string = req.body.currentArticleId ? req.body.currentArticleId : undefined
  const max: number | undefined = req.body.max ? req.body.max : undefined
  log('<<< getSuggestions filter', { tags, currentArticleId, max })

  const posts = await notionClientService.getSuggestions(tags, currentArticleId, max);

  log('>>> getSuggestions posts', posts)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(posts)
}

export default getSuggestions;