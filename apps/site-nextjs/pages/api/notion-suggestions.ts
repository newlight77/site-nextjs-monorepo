import { NextApiRequest, NextApiResponse } from 'next'
import { notionService } from '@/lib/content-service.provider';
import { logger } from "logger";

logger.log = logger.log_;


const getSuggestions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const tags: string[] = req.body.tags ? req.body.tags : undefined;
  const currentArticleId: string = req.body.currentArticleId ? req.body.currentArticleId : undefined
  const max: number | undefined = req.body.max ? req.body.max : undefined
  logger.log('<<< getSuggestions filter', { tags, currentArticleId, max })

  const posts = await notionService.getSuggestions(tags, currentArticleId, max);

  logger.log('>>> getSuggestions posts', posts)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(posts)
}

export default getSuggestions;