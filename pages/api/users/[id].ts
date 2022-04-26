import { Database, getDatabase } from "firebase/database";
import { NextApiRequest, NextApiResponse } from "next";
import { Admin, User } from "../../../types";
import { RESTMethods } from "./types/utils/RESTMethods";

const getUser = async (userId: string, db: Database) => {
  return true
}

const updateUser = async (userData: User, db: Database) => {
  return false
}

const deleteUser = async (userData: User, db: Database, admin?: User | Admin,) => {
  if (admin && "isAdmin" in admin && admin.isAdmin) {
    return true
  }
  return false
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user: User = req.body.user
  const method = req.method
  if (!method) {
    res.status(400).json({ error: "No valid REST method attached." })
    return
  }
  const db = getDatabase()
  switch (method) {
    case "GET": {
      res.status(200).json(await getUser(user.id, db))
    }
    case "PUT":
    case "PATCH": {
      res.status(200).json(await updateUser(user, db))
    }
    case "DELETE": {
      res.status(200).json(await deleteUser(user, db, req.body.admin))
    }
    default: await Promise.reject("invalid REST method")
  }

}