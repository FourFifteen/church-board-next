import { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseDocDatabaseService } from '../../../adapters/firebase-database'
import { NeedData } from '../../../types/entities/Need'
import { sendNeedsResponse } from '../../../utils/needs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ensure that we have an instance of the db
  const { setList } = FirebaseDocDatabaseService
  const method = req.method
  const needsResponseMessages = sendNeedsResponse(res)
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
    needsResponseMessages(200)(need)
  } else {
    needsResponseMessages(400)()
  }
}
