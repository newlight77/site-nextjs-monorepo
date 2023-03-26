import { NextApiRequest, NextApiResponse } from 'next'
import { notionService } from '@/lib/content-service.provider';

const log = (message?: any, ...optionalParams: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
console.log(`------    notion-tags ${message}`, colorfulParams);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
// const log = (message?: any, ...optionalParams: any[]) => {};

const getTags = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  log('<<< getTags')
  const tags = await notionService.getAllTags();
  log('>>> getTags tags', tags)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(tags)
}

export default getTags;