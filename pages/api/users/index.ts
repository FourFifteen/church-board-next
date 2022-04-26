import { Database, getDatabase, ref, set } from 'firebase/database'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'
import type { User } from '../../../types'

const setValue = (db: Database) => <T>(value: T, id: string) => {
  return set(ref(db, 'users/' + id), {
    ...value
  })
}

export const addUser = async (userData: User, db: Database) => {
  const { name, id, churchId } = userData
  await setValue(db)({
    name,
    churchId
  }, id)
  return userData
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getDatabase()
    if (!db) { 
      throw "database not initialized properly."
    }
    const userData = req.body
    const user: User = {...userData, id: uuid()}
    if (!user.churchId || !user.name) {
      throw "Either no churchId or name."
    }
    const response = await addUser(user, db)
    res.status(200).json({ user: response })
  } catch (err) {
    res.status(500).json({ message: "error adding user. See this for more", error: err })
  }
}
