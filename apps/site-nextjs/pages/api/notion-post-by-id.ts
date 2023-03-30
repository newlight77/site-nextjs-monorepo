import { NextApiRequest, NextApiResponse } from 'next'
import { notionService } from '@/lib/content-service.provider';
import { newLogger } from "logger";

const logger = newLogger();
logger.log = logger.noOp;


const getBlogPostById = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const id: string = req.body.id
  logger.log('<<< getBlogPostById id', id)

  const post = await notionService.getPostById(id);

  logger.log('>>> getBlogPostById id post', id, post)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(post)
}

export default getBlogPostById;