import { NextApiRequest, NextApiResponse } from "next"
import { FirebaseDocDatabaseService } from "../../../adapters/firebase-database"
import { Need, NeedData } from "../../../types"
import { sendNeedsResponse } from "../../../utils/needs"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // ensure that we have an instance of the db
  const { setListFromRef, getTableRef } = FirebaseDocDatabaseService
  const method = req.method
  const needsResponseMessages = sendNeedsResponse(res)
  // UPDATE AN EXISTING NEED
  const need: Need = JSON.parse(req.body)
  const patchData: NeedData = {
    name: need.name,
    assigneeId: need.assigneeId,
    fulfilledState: need.fulfilledState,
    description: need.description,
    ownerId: need.ownerId,
  }
  if (method === "PATCH") {
    const needRef = getTableRef("needs/" + need.id)
    await setListFromRef(needRef, patchData, "update")
    needsResponseMessages(200)(patchData)
  } else {
    needsResponseMessages(400)()
  }
}
