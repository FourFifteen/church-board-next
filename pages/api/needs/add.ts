import { ref, set } from 'firebase/database'
import firebase from '../../../firebase/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'
import { Need, NeedData } from '../../../types/entities/Need'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: { name: string, fulfilledState: Need["fulfilledState"], description: string } = JSON.parse(req.body)
  console.log(firebase.database)

  const needData: NeedData = {
    ownerId: "test",
    assigneeId: null,
    ...body,
  }
  const need: Need = {
    ...needData,
    id: uuid()
  }

  await set(ref(firebase.database, 'needs/' + need.id), needData)
  res.status(200).json({ data: need })

}
