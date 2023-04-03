import { NextApiRequest, NextApiResponse } from 'next'
import { notionService } from '@/lib/content-service.provider';
import { newLogger } from "logger";

const logger = newLogger("notion-tags");
logger.log = logger.noOp;


const getTags = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  logger.log('<<< getTags')
  const tags = await notionService.getAllTags();
  logger.log('>>> getTags tags', tags)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(tags)
}

export default getTags;