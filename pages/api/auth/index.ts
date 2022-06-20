import { NextApiRequest, NextApiResponse } from "next"
import { FirebaseDocDatabaseService } from "../../../adapters/firebase-database"
import { User } from "../../../types"

export default async function hander(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { getValFromRef, getTableRef, setValFromRef } =
    FirebaseDocDatabaseService
  const getUserRef = (id: User["id"]) => getTableRef("users/" + id)
  const method = req.method

  const checkUserExists = async (existingUserId: User["id"]) => {
    const snapshot = await getValFromRef(getUserRef(existingUserId))
    if (!snapshot || !snapshot.val()) {
      return false
    }
    const user = snapshot.val()
    const id = user.id
    return id === existingUserId
  }

  const setUser = async (user: User) => {
    await setValFromRef(getUserRef(user.id), user)
    return res.status(200).json({ data: user })
  }

  const setUserIfNew = async () => {
    const { id, email, name, photoURL }: User = JSON.parse(req.body)
    const doesUserExist = await checkUserExists(id)

    if (doesUserExist) {
      return res.status(200).json({ data: { id, email, name, photoURL } })
    }

    return setUser({ id, email, name, photoURL })
  }

  switch (method) {
    case "POST":
    case "PATCH":
      return await setUserIfNew()
    default:
      return res.status(400).json({
        error:
          "Bad request. This endpoint is for only for creating and updating users.",
      })
  }
}
