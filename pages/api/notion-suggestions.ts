import { NextApiRequest, NextApiResponse } from 'next'
import { notionClientService } from '../../lib/domain/notion.service';

const getSuggestions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const limit: number | undefined = req.body.limit ? req.body.limit : undefined
  const skip: number | undefined = req.body.skip ? req.body.skip : undefined
  const tag: string | undefined = req.body.tag ? req.body.tag : undefined
  console.log('<<< notion-suggestions getSuggestions filter', { limit, skip, tag })

  const posts = await notionClientService.getBlogPosts({ limit, skip, tag });

  console.log('>>> notion-suggestions')

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(posts)
}

export default getSuggestions;