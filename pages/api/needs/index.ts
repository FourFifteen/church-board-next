import { push, set } from 'firebase/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseDocDatabaseService } from '../../../adapters/firebase-database'
 import { Need } from '../../../types/entities/Need'

 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   // ensure that we have an instance of the db
   const { getTableRef } = FirebaseDocDatabaseService
   const method = req.method

  // ADD A NEW NEED
  if (method === "POST") {
    const body: {
      name: string,
      fulfilledState: Need["fulfilledState"],
      description: string
    } = JSON.parse(req.body)
    const needData = {
      ownerId: "test",
      assigneeId: null,
      ...body,
    }
    const need: Need = {
      ...needData,
    }
    const needsListRef = getTableRef("needs")
    const newNeedRef = push(needsListRef)
    await set(newNeedRef, needData)
    res.status(200).json({ data: need })
  } else {
    res.status(400).json({ error: "Bad request. Please use hook for GET requests" })
  }
}
