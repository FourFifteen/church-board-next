import { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseDocDatabaseService } from '../../../adapters/firebase-database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ensure that we have an instance of the db
  const { setList } = FirebaseDocDatabaseService
  const method = req.method
  const { needId, ownerId, assigneeId, message } = JSON.parse(req.body)

  if (method === "POST") {

    if (!needId || !ownerId) {
      return res.status(400).json({ error: "Bad request. missing need ID or assignee ID" })
    }

    const thanks = {
      needId,
      ownerId,
      assigneeId,
      message
    }

    await setList('thanks', thanks)
    res.status(200).json({ data: thanks })

  } else {
    res.status(400).json({ error: "Bad request. Please use hook for GET requests " })
  }
}

