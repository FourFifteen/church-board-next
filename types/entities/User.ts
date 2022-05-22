export type User = {
  name: string
  email: string | null
  id: string | number
  photoURL?: string
}

export interface Admin extends User {
  isAdmin: boolean
}

export type UserID = User["id"]
