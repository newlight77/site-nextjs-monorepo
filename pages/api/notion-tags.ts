import { NextApiRequest, NextApiResponse } from 'next'
import { NotionService } from '../../lib/domain/notion.service';
import { notionApiAdapter } from '../../lib/spi/notion-api-adapter';

const getTags = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const notionService = new NotionService(notionApiAdapter);

  console.log('<<< lambda notion-tags')
  const tags = await notionService.getAllTags();
  console.log('>>> lambda notion-tags', tags)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(tags)
}

export default getTags;