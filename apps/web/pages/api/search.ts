import { NextApiRequest, NextApiResponse } from 'next'
import { SEO_REVERT_MAP } from 'const/notion'
import { getUnOfficialNotion } from '../../service/server/notion'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const keyword = req.query.keyword?.toString() || ''
  const output = await getUnOfficialNotion()
    .search({
      query: keyword,
      ancestorId: SEO_REVERT_MAP['/'],
    })
    .then(function (res) {
      return res
    })
    .catch(function () {
      return null
    })
  return res.status(200).json(output)
}
