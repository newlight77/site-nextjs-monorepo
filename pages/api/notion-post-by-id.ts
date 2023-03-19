import { NextApiRequest, NextApiResponse } from 'next'
import { notionClientService } from '../../lib/domain/notion.service';

const getBlogPostById = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const id: string = req.body.id
  console.log('<<< notion-post-by-id getBlogPostById id', id)

  const post = await notionClientService.getPostById(id);

  console.log('>>> notion-post-by-id')

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(post)
}

export default getBlogPostById;