import { Database, getDatabase, onValue, ref, set } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";
import { Admin, User } from "../../../types";

const getUser = async (userId: string, db: Database) => {
  const userRef = ref(db, 'users/' + userId)
  let userData: User = { id: '', churchId: '', name: '' }
  onValue(userRef, (snapshot) => {
    userData = snapshot.val()
  })
  return userData
}

const updateUser = async (userData: User, db: Database, newData?: Partial<User>) => {
  if (!newData || !newData.name) {
    throw new Error(`No new data supplied to update ${userData.id}`)
  }
  set(ref(db, 'users/' + userData.id), { name: newData.name })
}

const deleteUser = async (userData: User, db: Database, admin?: User | Admin) => {
  if (!db || !userData) {
    return false
  }
  if (admin && "isAdmin" in admin && admin.isAdmin) {
    return true
  }
  return false
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user: User = req.body.user
  const newData = req.body.newData
  const method = req.method
  if (!method) {
    res.status(400).json({ error: "No valid REST method attached." })
    return
  }
  const db = getDatabase()
  switch (method) {
    case "GET": {
      res.status(200).json(await getUser(user.id, db))
      return
    }
    case "PUT":
    case "PATCH": {
      res.status(200).json(await updateUser(user, db, newData))
      return
    }
    case "DELETE": {
      res.status(200).json(await deleteUser(user, db, req.body.admin))
      return
    }
    default: {
      await Promise.reject("invalid REST method")
    }
  }

}
