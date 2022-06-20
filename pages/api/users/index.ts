import { NextApiRequest, NextApiResponse } from "next"
import { FirebaseDocDatabaseService } from "../../../adapters/firebase-database"
import { User } from "../../../types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method
  if (method !== "GET") {
    return res
      .status(405)
      .json({ error: "This endpoint supports GET requests only" })
  }

  // get the User as a DB ref
  const id = req.query.id
  if (id instanceof Array) {
    // get multiple users
    const users: User[] = []

    for (const val of id) {
      users.push(await getUser(val))
    }
    res.status(200).json({ data: users })
  }
  const user: User = await getUser("" + id)
  res.status(200).json({ data: [user] })
}

const getUser = async (id: User["id"]) => {
  const { getValFromRef, getTableRef } = FirebaseDocDatabaseService
  const ref = getTableRef("users/" + id)
  const snapshot = await getValFromRef(ref)
  return snapshot.val()
}
