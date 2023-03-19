import { notionClientAdapter } from '@/lib/spi/notion-client-adapter'
import { NextApiRequest, NextApiResponse } from 'next'

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const searchParams: any = req.body

  console.log('<<< lambda notion-search', searchParams)
  const results = await notionClientAdapter.search(searchParams)
  console.log('>>> lambda notion-searcj', results)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(results)
}

export default search;