import { useEffect, useState } from "react"
import { useDBServiceObject } from "../adapters/firebase-database"
import { User } from "../types"
import { generateEmptyUser } from "../utils/generateEmptyUser"

export const useGetPerson = (id: User["id"]) => {
  const [userSnapshot, loading, error] = useDBServiceObject("users/" + id)
  const [name, setName] = useState<User["name"]>(userSnapshot?.val().name)
  const [email, setEmail] = useState<User["email"]>(userSnapshot?.val().email)
  const [photoURL, setPhotoURL] = useState<User["photoURL"]>(userSnapshot?.val().photoURL)
  const [user, setUser] = useState<User>({ ...generateEmptyUser(), id })

  useEffect(() => {
    const userVal: User | undefined = userSnapshot?.val()
    if (!userVal) {
      return
    }
    setName(userVal.name)
    setEmail(userVal.email)
    setPhotoURL(userVal.photoURL)
  }, [userSnapshot])

  useEffect(() => {
    setUser({
      name,
      email,
      photoURL,
      id
    })
  }, [name, email, photoURL, id])

  return [user, loading, error] as [User, boolean, Error | undefined]
}
