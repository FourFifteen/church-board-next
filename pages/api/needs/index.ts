import { push, ref, set } from 'firebase/database'
import firebase from '../../../firebase/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { Need } from '../../../types/entities/Need'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const needsListRef = ref(firebase.database, 'needs')
    const newNeedRef = push(needsListRef)
    await set(newNeedRef, needData)
    res.status(200).json({ data: need })

  } else {
    res.status(400).json({ error: "Bad request. Please use hook for GET requests" })
  }
}
