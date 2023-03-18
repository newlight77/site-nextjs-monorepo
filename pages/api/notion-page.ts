import { NextApiRequest, NextApiResponse } from 'next'
import { notionService } from '../../lib/domain/notion.service';

const getPage = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const pageId: string | undefined = req.body.pageId ? req.body.pageId : undefined
  // console.log('<<< lambda page')
  const page = await notionService.getPage(pageId);
  // console.log('>>> lambda page', page)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(page)
}

export default getPage;