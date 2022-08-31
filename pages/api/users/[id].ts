import { NextApiRequest, NextApiResponse } from "next"
import { FirebaseDocDatabaseService } from "../../../adapters/firebase-database"
import { User } from "../../../types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method
  // get the user ID from the query params
  const id = req.query.id

  if (method === "GET") {
    if (id instanceof Array) {
      // get multiple users
      const users: User[] = []

      for (const val of id) {
        users.push(await getUser(val))
      }
      res.status(200).json({ data: users })
    }
    const user: User = await getUser("" + id)
    return res.status(200).json({ data: [user] })
  } else if (method === "PATCH") {
    if (!id || id instanceof Array) {
      return res.status(400).json({
        error: "Sorry, updating more than one user at a time is prohibited.",
      })
    }

    const { setValFromRef, getTableRef } = FirebaseDocDatabaseService

    await setValFromRef(getTableRef("users/" + id), JSON.parse(req.body))
  }

  return res
    .status(405)
    .json({ error: "This endpoint supports GET or PATCH requests only" })
}

const getUser = async (id: User["id"]) => {
  const { getValFromRef, getTableRef } = FirebaseDocDatabaseService
  const ref = getTableRef("users/" + id)
  const snapshot = await getValFromRef(ref)
  return snapshot.val()
}
