import { blogContentNotionAdapter } from 'blog-content-notion-adapter';
import { NextApiRequest, NextApiResponse } from 'next'
import { newLogger } from "logger";

const logger = newLogger("notion-search");
logger.log = logger.noOp;


const search = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const searchParams: any = req.body

  logger.log('<<< search searchParams', searchParams)
  const results = await blogContentNotionAdapter.search(searchParams)
  logger.log('>>> search results', results)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(results)
}

export default search;