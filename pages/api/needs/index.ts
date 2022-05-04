import { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseDocDatabaseService } from '../../../adapters/firebase-database'
import { NeedData } from '../../../types/entities/Need'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ensure that we have an instance of the db
  const { setList } = FirebaseDocDatabaseService
  const method = req.method

  // ADD A NEW NEED
  if (method === "POST") {
    const body: {
      name: string,
      fulfilledState: NeedData["fulfilledState"],
      description: string
    } = JSON.parse(req.body)
    const needData = {
      ownerId: "test",
      assigneeId: null,
      ...body,
    }
    const need: NeedData = {
      ...needData,
    }
    await setList('needs', need)
    res.status(200).json({ data: need })
  } else {
    res.status(400).json({ error: "Bad request. Please use hook for GET requests" })
  }
}
