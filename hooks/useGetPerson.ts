import { useDBServiceObject } from "../adapters/firebase-database"
import { User } from "../types"

export const useGetPerson = (id: User["id"]) =>
  useDBServiceObject("users/" + id)
