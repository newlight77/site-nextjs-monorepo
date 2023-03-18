import { NextApiRequest, NextApiResponse } from 'next'
import { notionClientService } from '../../lib/domain/notion.service';

const getTags = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  console.log('<<< lambda notion-tags')
  const tags = await notionClientService.getAllTags();
  console.log('>>> lambda notion-tags', tags)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(tags)
}

export default getTags;