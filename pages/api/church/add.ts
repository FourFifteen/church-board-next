import { getDatabase, ref, set } from 'firebase/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'
import { ChurchData, Church } from '../../../types/entities/Church'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const churchData: ChurchData = JSON.parse(req.body)
  const church: Church = {
    ...churchData,
    id: uuid()
  }

  const db = getDatabase()
}
