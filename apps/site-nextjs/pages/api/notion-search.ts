import { blogContentNotionAdapter } from 'blog-content-notion-adapter';
import { NextApiRequest, NextApiResponse } from 'next'

const log = (message?: any, ...optionalParams: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
console.log(`------    notion-search ${message}`, colorfulParams);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
// const log = (message?: any, ...optionalParams: any[]) => {};

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const searchParams: any = req.body

  log('<<< search searchParams', searchParams)
  const results = await blogContentNotionAdapter.search(searchParams)
  log('>>> search results', results)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(results)
}

export default search;