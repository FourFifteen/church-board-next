import { User } from "../types"

export const generateEmptyUser = (): User => ({
  name: "",
  email: "",
  id: "",
  photoURL: ""
})

