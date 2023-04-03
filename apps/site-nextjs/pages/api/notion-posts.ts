import { NextApiRequest, NextApiResponse } from 'next'
import { notionService } from '@/lib/content-service.provider';
import { newLogger } from "logger";

const logger = newLogger("notion-posts");
logger.log = logger.noOp;


const getBlogPosts = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const limit: number | undefined = req.body.limit ? req.body.limit : undefined
  const skip: number | undefined = req.body.skip ? req.body.skip : undefined
  const tag: string | undefined = req.body.tag ? req.body.tag : undefined
  logger.log('<<< getPosts filter', { limit, skip, tag })

  const posts = await notionService.getBlogPosts({ limit, skip, tag });

  logger.log('>>> getPosts posts', posts)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(posts)
}

export default getBlogPosts;