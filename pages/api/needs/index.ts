import { onValue, ref } from 'firebase/database'
import firebase from '../../../firebase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const needsRef = ref(firebase.database, 'needs/')
  console.log(needsRef)
  try {
    onValue(needsRef, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      res.status(200).json({ data })
      return
    })
  } catch (err) {
    res.status(500).json({ error: "error getting data from db", })
    return
  }
}

